import { User } from "../model/user.model.js";
import { Follow } from "../model/follow.model.js";
import { Block } from "../model/block.model.js";
import redisClient from "../config/redis.config.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { cacheKeys } from "../utils/cacheKeys.util.js";
import { deleteCache, getCache, setCache } from "../services/cache.service.js";
import { uploadToCloudinary } from "../helper/cloudinary/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../helper/cloudinary/deleteFromCloudinary.js";
import { processImg } from "../utils/compressAvatar.util.js";
import { compressImg } from "../services/image.service.js";

// TODO: RECHECK THE DATA FLOW AND REDIS IMPLEMENTATION
/*
    1. CHECK REDIS KEY ARE GENERATE PROPERLY AND SET DATA PROPERLY 
    2. VALIDATION CHECK 
    3. USE SENTITIZER FUNCTION OF USER
    4. CHECK REDIS KEY AND VALUE DELETED PROPERLY OR NOT 
    5. SEND MAIL IF EMAIL ARE UPDATE OR CHANGE OR AVATAR AND USERNAME OR PROFILE UPDATE
    6. RESPOSNE SEND PROPERLY 
    7. DATA SEND PROPERLY - NECCESSARY FIELD ONLY 
    8. REMOVE UNNESSARY IMPORTED STATEMENTS AND CONSOLE STATEMENT
    9. UPDATE CLOUIDNARY FUNCTION
    10. IF NEEDS USE PIPELINE  
*/

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const cacheKey = cacheKeys.user(username);

    // Check cache first
    const catched = await getCache(cacheKey);
    if (catched) {
        return res
            .status(200)
            .json(new ApiResponse(200, catched, "User fetched from cache"));
    }

    // Fetch user from database
    const user = await User.findOne({ username })
        .select(
            "_id username fullName avatar bio website followersCount followingCount postsCount createdAt"
        )
        .lean();
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Store user in cache
    await setCache(cacheKey, user, 3600); // Cache for 1 hour

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { fullName, bio, gender, website, avatar } = req.body;

    // 1. Agar file aayi hai
    let avatarUpload;
    if (req.file?.path) {
        avatarUpload = await processImg(req.file.path, "avatars");
        // console.log("Avatar Image Uploaded : ------->>>", avatarUpload)
    }

    // Validate input
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;
    if (avatar) {
        ((updateData.avatar.url = avatarUpload.url),
            (updateData.avatar.publicId = avatarUpload.public_id));
    }
    if (gender) updateData.gender = gender;
    if (website) updateData.website = website;

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }

    // Update user in database
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { returnDocument: "after" }
    )
        .select("_id username fullName avatar bio website createdAt")
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Invalidate cache
    const cacheKey = cacheKeys.userById(userId);

    // Remove the cached user data
    await deleteCache(cacheKey);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile updated successfully"));
});

// Update user avatar
export const updateUserAvatar = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { avatar } = req.body;

    const file = req.file.path;
    if (!file) {
        throw new ApiError(400, "No file uploaded");
    }

    // Upload to Cloudinary
    const existingUser = await User.findById(userId)
    if (existingUser?.avatar?.publicId) {
        await deleteFromCloudinary(existingUser.avatar.publicId, "image")
    } 
    const uploadAvatar = await processImg(req.file.path, "avatars");

    // Update user avatar in database
    const user = await User.findByIdAndUpdate(
        { _id: userId },
        { $set: {
            avatar: {
                url: uploadAvatar?.url,
                publicId: uploadAvatar?.public_id
            },
            avatarChangedAt: Date.now()
            }
        },
        { returnDocument: "after" }
    )
        .select("_id username fullName avatar bio website createdAt")
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Invalidate cache
    const cacheKey = cacheKeys.user(userId);
    await redisClient.del(cacheKey);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User avatar updated successfully"));
});

// Delete user avatar
export const deleteUserAvatar = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.avatar?.publicId) {
        throw new ApiError(400, "Avatar not found");
    }

    await deleteFromCloudinary(user.avatar.publicId, "image");

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                avatar: {
                    url: null,
                    publicId: null
                },
                avatarChangedAt: Date.now()
            }
        },
        { returnDocument: "after" }
    )
    .select("_id fullName email username avatar createdAt")
    .lean();

    await redisClient.del(cacheKeys.user(userId));

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "User avatar deleted successfully"
        )
    );
});

// Get user suggestions
export const getUserSuggestions = asyncHandler(async (req, res) => {
    const { keyword } = req.query;

    const cacheKey = cacheKeys.userSuggestions(keyword || "default");
    // Check cache first
    const catched = await getCache(cacheKey);

    if (catched) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    JSON.parse(catched),
                    "User suggestions fetched from cache"
                )
            );
    }

    // For simplicity, we will return the latest 5 users as suggestions
    const query = keyword
        ? { username: { $regex: keyword, $options: "i" } }
        : {};
    console.log("Query for suggestions:", query);

    const users = await User.find(query)
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
            "_id username fullName avatar bio website isVerified followersCount followingCount postsCount createdAt"
        )
        .lean();

    // Store suggestions in cache
    await setCache(cacheKey, users, 3600); // Cache for 1 hour

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "User suggestions fetched successfully")
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
                    "Search results fetched from cache"
                )
            );
    }

    // Search users by username or full name
    const users = await User.find({
        $or: [
            { username: { $regex: q, $options: "i" } },
            { fullName: { $regex: q, $options: "i" } },
        ],
    }).lean();

    // Store search results in cache
    await setCache(cacheKey, users, 3600); // Cache for 1 hour

    return res
        .status(200)
        .json(
            new ApiResponse(200, users, "Search results fetched successfully")
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
                new ApiResponse(200, catched, "Followers fetched from cache")
            );
    }

    const followers = await Follow.find({
        following: id,
    })
        .populate("follower", "username fullName avatar isVerified")
        .lean();
    console.log("Followers for user", followers);

    if (!followers) {
        throw new ApiError(404, "Followers not found");
    }

    // Store followers list in cache
    await setCache(
        cacheKey,
        followers.map((f) => f.follower),
        3600
    ); // Cache for 1 hour

    return res.status(200).json(
        new ApiResponse(
            200,
            followers.map((f) => f.follower),
            "Followers fetched successfully"
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
                new ApiResponse(200, catched, "Following fetched from cache")
            );
    }

    const following = await Follow.find({
        follower: id,
    })
        .populate("following", "username fullName avatar")
        .lean();

    console.log("Following for user", following);

    if (!following) {
        throw new ApiError(404, "User not found");
    }

    // following list
    const followingList = following.map((item) => item.following);

    // Store following list in cache
    await setCache(cacheKey, followingList, 3600); // Cache for 1 hour

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                followingList,
                "Following fetched successfully"
            )
        );
});

// Follow user
export const followUser = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from auth middleware
    const { id: targetUserId } = req.params;

    if (userId === targetUserId) {
        throw new ApiError(400, "You cannot follow yourself");
    }
    //  check if the follow relationship already exists
    const exisitingfollow = await Follow.findOne({
        follower: userId,
        following: targetUserId,
    });

    // If already following, return error
    if (exisitingfollow) {
        throw new ApiError(400, "You are already following this user");
    }

    // create follow relationship
    const follow = await Follow.create({
        follower: userId,
        following: targetUserId,
    });

    // Invalidate caches for both users
    await redisClient.del(cacheKeys.userFollowers(targetUserId));
    await redisClient.del(cacheKeys.userFollowing(userId));

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User followed successfully"));
});

// Unfollow user
export const unfollowUser = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from auth middleware
    const { id: targetUserId } = req.params;

    if (userId === targetUserId) {
        throw new ApiError(400, "You cannot unfollow yourself");
    }

    // Remove follow relationship
    const unfollow = await Follow.findOneAndDelete({
        follower: userId,
        following: targetUserId,
    });

    // If not following, return error
    if (!unfollow) {
        throw new ApiError(400, "You are not following this user");
    }

    // Invalidate caches for both users
    await redisClient.del(cacheKeys.userFollowers(targetUserId));
    await redisClient.del(cacheKeys.userFollowing(userId));

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User unfollowed successfully"));
});

// Block user
export const blockUser = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from auth middleware
    const { id: targetUserId } = req.params;

    if (userId === targetUserId) {
        throw new ApiError(400, "You cannot block yourself");
    }

    // check blocked user
    const alreadyBlocked = await Block.findOne({
        blocker: userId,
        blocked: targetUserId,
    });

    if (alreadyBlocked) {
        throw new ApiError(400, "User already blocked");
    }

    // blocked the user
    await Block.create({
        blocker: userId,
        blocked: targetUserId,
    });

    // remove follow relationships
    await Follow.deleteMany({
        $or: [
            {
                follower: userId,
                following: targetUserId,
            },

            {
                follower: targetUserId,
                following: userId,
            },
        ],
    });

    // Invalidate caches for both users
    await Promise.all([
        redisClient.del(cacheKeys.userFollowers(userId)),
        redisClient.del(cacheKeys.userFollowing(userId)),
        redisClient.del(cacheKeys.userFollowers(targetUserId)),
        redisClient.del(cacheKeys.userFollowing(targetUserId)),
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User blocked successfully"));
});

// Unblock user
export const unblockUser = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from auth middleware
    const { id: targetUserId } = req.params;

    if (userId === targetUserId) {
        throw new ApiError(400, "You cannot unblock yourself");
    }

    // unblock the user
    const unblock = await Block.findOneAndDelete({
        blocker: userId,
        blocked: targetUserId,
    });

    // Invalidate caches for both users
    await redisClient.del(cacheKeys.userFollowers(targetUserId));
    await redisClient.del(cacheKeys.userFollowing(userId));

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User unblocked successfully"));
});
