// Utility functions for generating cache keys
export const cacheKeys = {
    user: (username) => `user:${username.toLowerCase()}`,

    userById: (userId) => `user:id:${userId}`,

    post: (postId) => `post:${postId}`,

    followers: (userId) => `followers:${userId}`,

    userFollowers: (targetUserId) => `followers:${targetUserId}`,

    userFollowing: (userId) => `following:${userId}`,

    feed: (userId) => `feed:${userId}`,

    otp: (email) => `otp:${email.toLowerCase()}`,

    passwordReset: (email) => `passwordReset:${email.toLowerCase()}`,

    changeEmail: (email) => `changeEmail:${email.toLowerCase()}`,

    userSuggestions: (keyword) => `userSuggestions:${keyword}`,

    userSearch: (q) => `userSearch:${q.toLowerCase()}`,

    // Add more cache key generators as needed

};

