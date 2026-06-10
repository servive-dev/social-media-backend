import { User } from "../model/user.model.js";
import { Follow } from "../model/follow.model.js";
import { Block } from "../model/block.model.js";
import redisClient from "../config/redis.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cacheKeys } from "../utils/cacheKeys.js";
import { getCache, setCache } from "../services/cache.service.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";


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
            "_id username fullName avatar bio website isVerified followersCount followingCount postsCount createdAt"
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

// FIXME: MY REQ.FILE AND USERNAME ARE NOT COMING IN UPDATE PROFILE. CHECK WHY
// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

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
        throw new ApiError(400, "No valid fields provided for update");
    }

    // Update user in database
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { returnDocument: "after" }
    ).lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Invalidate cache
    const cacheKey = cacheKeys.userById(userId);

    // Remove the cached user data
    await redisClient.del(cacheKey);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile updated successfully"));
});

// Update user avatar
export const updateUserAvatar = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const file = req.file;

    if (!file) {
        throw new ApiError(400, "No file uploaded");
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
        file.buffer, // 👈 IMPORTANT (not path)
        "avatars", // folder
        "image" // resourceType
    );

    // Update user avatar in database
    const user = await User.findOneAndUpdate(
        { username },
        { $set: { avatar: result.secure_url } },
        { returnDocument: "after" }
    ).lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Invalidate cache
    const cacheKey = cacheKeys.user(username);
    await redisClient.del(cacheKey);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User avatar updated successfully"));
});

// Delete user avatar
export const deleteUserAvatar = asyncHandler(async (req, res) => {
    const { username } = req.params;
    // Update user avatar in database
    const user = await User.findOneAndUpdate(
        { username },
        { $set: { avatar: null } },
        { returnDocument: "after" }
    ).lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Invalidate cache
    const cacheKey = cacheKeys.user(username);
    await redisClient.del(cacheKey);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User avatar deleted successfully"));
});

// Get user suggestions
export const getUserSuggestions = asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    console.log("Keyword for suggestions:", keyword);
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
    const unblock = await Block.findOneAndDelete(
        {
            blocker: userId,
            blocked: targetUserId   
        }
    )

    // Invalidate caches for both users
    await redisClient.del(cacheKeys.userFollowers(targetUserId));
    await redisClient.del(cacheKeys.userFollowing(userId));

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User unblocked successfully"));
});
