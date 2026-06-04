// Utility functions for generating cache keys
export const cacheKeys = {
    user: (username) => `user:${username.toLowerCase()}`,

    userById: (id) => `user:id:${id}`,

    post: (postId) => `post:${postId}`,

    followers: (userId) => `followers:${userId}`,

    following: (userId) => `following:${userId}`,

    feed: (userId) => `feed:${userId}`,

    otp: (email) => `otp:${email.toLowerCase()}`,

    passwordReset: (email) => `passwordReset:${email.toLowerCase()}`,

    changeEmail: (email) => `changeEmail:${email.toLowerCase()}`,

    // Add more cache key generators as needed

};

