import { User } from '../models/user.model.js';
import { redisClient } from '../config/redis.config.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cacheKeys } from '../utils/cacheKey.js';
import { getCache, setCache } from '../utils/cacheUtils.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
    const{ username } = req.params;

    const cacheKey = cacheKeys.user(username);

    // Check cache first
    const catched = await getCache(cacheKey);

    if (catched) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                JSON.parse(catched), 
                'User fetched from cache'
            )
        );
    }

    // Fetch user from database
    const user = await User.findOne({ username }).lean();
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Store user in cache
    await setCache(cacheKey, user, 3600); // Cache for 1 hour

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            user, 
            'User fetched successfully'
        )
    );
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {

    const { username } = req.params;
    const { fullName, bio, gender, website } = req.body;

    let avatarUrl;

    // 1. Agar file aayi hai
    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,   // 👈 IMPORTANT (not path)
            "avatars",         // folder
            "image"            // resourceType
        );

        avatarUrl = result.secure_url;
    }


    // Validate input
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;
    if (gender) updateData.gender = gender;
    if (website) updateData.website = website;

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, 'No valid fields provided for update');
    }

    // Update user in database
    const user = await User.findOneAndUpdate(
        { username },
        { $set: updateData },
        { new: true }
    ).lean();

    
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Invalidate cache
    const cacheKey = cacheKeys.user(username);

    // Remove the cached user data
    await redisClient.del(cacheKey);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            user, 
            'User profile updated successfully'
        )
    );
});   
