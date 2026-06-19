export const cacheKeys = {
    // AUTH SYSTEM
    auth: {
        otp: (type, email) =>
            `auth:otp:${type}:${email.toLowerCase()}`,

        attempt: (type, email) =>
            `auth:otp:attempt:${type}:${email.toLowerCase()}`,

        cooldown: (type, email) =>
            `auth:otp:cooldown:${type}:${email.toLowerCase()}`,

        resetToken: (email) =>
            `auth:reset:${email.toLowerCase()}`,

        register: (email) =>
            `auth:register:${email.toLowerCase()}`
    },

    // USER SYSTEM
    user: {
        profile: (username) =>
            `user:profile:${username.toLowerCase()}`,

        byId: (userId) =>
            `user:id:${userId}`,

        search: (q) =>
            `user:search:${q.toLowerCase()}`,

        suggestions: (keyword) =>
            `user:suggestions:${keyword.toLowerCase()}`
    },

    // SOCIAL
    social: {
        followers: (userId) =>
            `social:followers:${userId}`,

        following: (userId) =>
            `social:following:${userId}`,

        feed: (userId) =>
            `social:feed:${userId}`
    },

    // CONTENT
    post: (postId) =>
        `post:${postId}`,

    // MEDIA
    media: {
        avatar: (userId) =>
            `media:avatar:${userId}`,

        upload: (hash) =>
            `media:upload:${hash}`
    }
};