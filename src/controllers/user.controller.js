import { User } from '../model/user.model.js';
import  redisClient  from '../config/redis.config.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cacheKeys } from '../utils/cacheKeys.js';
import { getCache, setCache } from '../services/cache.service.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';


// TODO: GET     /api/v1/users/:username ✅
// TODO: PATCH   /api/v1/users/profile ✅
// TODO: PATCH   /api/v1/users/avatar ✅
// TODO: DELETE  /api/v1/users/avatar ✅
// TODO: GET     /api/v1/users/suggestions ✅
// TODO: GET     /api/v1/users/search?q= ✅
// TODO: GET     /api/v1/users/:id/followers ✅
// TODO: GET     /api/v1/users/:id/following ✅
// TODO: POST    /api/v1/users/:id/follow
// TODO: DELETE  /api/v1/users/:id/follow
// TODO: POST    /api/v1/users/block/:id
// TODO: DELETE  /api/v1/users/block/:id


// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
    const{ username } = req.params;
    console.log("Fetching user profile for:", username);

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


    // FIXME: MY REQ.FILE AND USERNAME ARE NOT COMING IN UPDATE PROFILE. CHECK WHY 

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {

    // const { username } = req.params;
    let username = 'omyadavrs3';
    const { fullName, bio, gender, website } = req.body;

    // let avatarUrl;

    // // 1. Agar file aayi hai
    // if (req.file) {
    //     const result = await uploadToCloudinary(
    //         req.file.buffer,   // 👈 IMPORTANT (not path)
    //         "avatars",         // folder
    //         "image"            // resourceType
    //     );

    //     avatarUrl = result.secure_url;
    // }


    // Validate input
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;
    // if (avatar) updateData.avatar = avatar;
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

// Update user avatar
export const updateUserAvatar = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const file = req.file;

    if (!file) {
        throw new ApiError(400, 'No file uploaded');
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
        file.buffer,   // 👈 IMPORTANT (not path)
        "avatars",     // folder
        "image"        // resourceType
    );

    // Update user avatar in database
    const user = await User.findOneAndUpdate(
        { username },
        { $set: { avatar: result.secure_url } },
        { new: true }
    ).lean();

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Invalidate cache
    const cacheKey = cacheKeys.user(username);
    await redisClient.del(cacheKey);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            user,
            'User avatar updated successfully'
        )
    );
});

// Delete user avatar
export const deleteUserAvatar = asyncHandler(async (req, res) => {
    const { username } = req.params;
    // Update user avatar in database
    const user = await User.findOneAndUpdate(
        { username },
        { $set: { avatar: null } },
        { new: true }
    ).lean();

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Invalidate cache
    const cacheKey = cacheKeys.user(username);
    await redisClient.del(cacheKey);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            user,
            'User avatar deleted successfully'
        )
    );
});

// Get user suggestions
export const getUserSuggestions = asyncHandler(async (req, res) => {
    const { keyword } = req.query;

    const cacheKey = cacheKeys.userSuggestions(keyword || 'default');
    // Check cache first
    const catched = await getCache(cacheKey);

    if (catched) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                JSON.parse(catched),
                'User suggestions fetched from cache'
            )
        );
    }

    // For simplicity, we will return the latest 5 users as suggestions
    const query = keyword
        ? { username: { $regex: keyword, $options: 'i' } }
        : {};
    const users = await User.find(query)
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    // Store suggestions in cache
    await setCache(cacheKey, users, 3600); // Cache for 1 hour


    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            users,
            'User suggestions fetched successfully'
        )
    );
});

// Search users
export const searchUsers = asyncHandler(async (req, res) => {
    const { q } = req.query;
    if (!q) {
        throw new ApiError(400, 'Query parameter "q" is required');
    }

    const cacheKey = cacheKeys.userSearch(q);

    // Check cache first
    const catched = await getCache(cacheKey);

    if (catched) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                JSON.parse(catched),
                'Search results fetched from cache'
            )
        );
    }

    // Search users by username or full name
    const users = await User.find({
        $or: [
            { username: { $regex: q, $options: 'i' } },
            { fullName: { $regex: q, $options: 'i' } }
        ]
    }).lean();  

    // Store search results in cache
    await setCache(cacheKey, users, 3600); // Cache for 1 hour

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            users,
            'Search results fetched successfully'
        )
    );
});

// Get user followers
export const getUserFollowers = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const cacheKey = cacheKeys.userFollowers(id);

    // Check cache first
    const catched = await getCache(cacheKey);
   if (catched) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                JSON.parse(catched),
                'Followers fetched from cache'
            )
        );
    }
    const user = await User.findById(id).populate('followers', 'username fullName avatar').lean();

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            user.followers,
            'Followers fetched successfully'
        )
    );

});

// Get user following
export const getUserFollowing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cacheKey = cacheKeys.userFollowing(id);

    // Check cache first
    const catched = await getCache(cacheKey);

    if (catched) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                JSON.parse(catched),
                'Following fetched from cache'
            )
        );
    }

    const user = await User.findById(id).populate('following', 'username fullName avatar').lean();

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Store following list in cache
    await setCache(cacheKey, user.following, 3600); // Cache for 1 hour

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            user.following, 
            'Following fetched successfully'
        )
    );
});

// Follow user
export const followUser = asyncHandler(async (req, res) => {});

// Unfollow user
export const unfollowUser = asyncHandler(async (req, res) => {});
