export const RATE_LIMIT = {
  REGISTER: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX: 10,
    MESSAGE:
      "Too many registrations, try again later",
  },

  LOGIN: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX: 5,
    MESSAGE:
      "Too many login attempts, try again later",
  },

  LOGOUT: {
    WINDOW_MS: 60 * 1000,
    MAX: 20,
    MESSAGE:
      "Too many logout requests",
  },

  VERIFY_OTP: {
    WINDOW_MS: 5 * 60 * 1000,
    MAX: 5,
    MESSAGE:
      "Too many OTP verification attempts. Try again later.",
  },

  RESEND_OTP: {
    WINDOW_MS: 60 * 1000,
    MAX: 2,
    MESSAGE:
      "Too many OTP resend requests. Try again later.",
  },

  RENEW_TOKEN: {
    WINDOW_MS: 60 * 1000,
    MAX: 2,
    MESSAGE:
      "Too many token renewal attempts",
  },

  FORGET_PASSWORD: {
    WINDOW_MS: 60 * 1000,
    MAX: 2,
    MESSAGE:
      "Too many password reset attempts. Try again later.",
  },

  RESET_PASSWORD: {
    WINDOW_MS: 60 * 1000,
    MAX: 2,
    MESSAGE:
      "Too many reset attempts. Try again later.",
  },
  PASSWORD_CHANGED: {
    WINDOW_MS: 60 * 1000,
    MAX: 2,
    MESSAGE:
      "Too many reset attempts. Try again later.",
  },

  COMMENT: {
    WINDOW_MS: 1 * 60 * 1000,
    MAX: 20,
    MESSAGE:
      "Too many comments, slow down.",
  },

  POST: {
    WINDOW_MS: 5 * 60 * 1000,
    MAX: 10,
    MESSAGE:
      "Too many posts created.",
  },
};