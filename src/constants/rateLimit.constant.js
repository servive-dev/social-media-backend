
export const RATE_LIMIT = {
    REGISTER: {
        WINDOW_MS: 15 * 60 * 1000, // 15 min
        MAX: 5,
        MESSAGE: "Too many registration attempts. Please try again later.",
    },

    LOGIN: {
        WINDOW_MS: 15 * 60 * 1000, // 15 min
        MAX: 5,
        MESSAGE: "Too many login attempts. Please try again later.",
    },

    LOGOUT: {
        WINDOW_MS: 15 * 60 * 1000,
        MAX: 10,
        MESSAGE: "Too many logout attempts. Please try again later.",
    },

    VERIFY_OTP: {
        WINDOW_MS: 10 * 60 * 1000, // 10 min
        MAX: 5,
        MESSAGE: "Too many OTP verification attempts. Please try again later.",
    },

    RESEND_OTP: {
        WINDOW_MS: 10 * 60 * 1000,
        MAX: 3,
        MESSAGE: "Too many OTP resend requests. Please try again later.",
    },

    RENEW_TOKEN: {
        WINDOW_MS: 15 * 60 * 1000,
        MAX: 20,
        MESSAGE: "Too many token refresh requests. Please try again later.",
    },

    FORGET_PASSWORD: {
        WINDOW_MS: 15 * 60 * 1000,
        MAX: 3,
        MESSAGE: "Too many password reset requests. Please try again later.",
    },

    RESET_PASSWORD: {
        WINDOW_MS: 15 * 60 * 1000,
        MAX: 3,
        MESSAGE: "Too many password reset attempts. Please try again later.",
    },

    PASSWORD_CHANGED: {
        WINDOW_MS: 15 * 60 * 1000,
        MAX: 5,
        MESSAGE: "Too many password change attempts. Please try again later.",
    },
};