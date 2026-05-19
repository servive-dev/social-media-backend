export const RATE_LIMIT = {
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX: 100,
    MESSAGE:
      "Too many auth requests, try again later.",
  },

  OTP: {
    WINDOW_MS: 10 * 60 * 1000,
    MAX: 5,
    MESSAGE:
      "Too many OTP requests, try again later.",
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