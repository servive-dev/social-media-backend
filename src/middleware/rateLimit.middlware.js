import { RATE_LIMIT } from "../constants/rateLimit.constant.js";
import { createRateLimiter } from "./helpers/createRateLimiter.js";

export const registerLimiter =
createRateLimiter(RATE_LIMIT.REGISTER);

export const loginLimiter =
    createRateLimiter(RATE_LIMIT.LOGIN);

export const logOutLimiter =
    createRateLimiter(RATE_LIMIT.LOGOUT);

export const verifyOtpLimiter =
    createRateLimiter(RATE_LIMIT.VERIFY_OTP);

export const resendOtpLimiter =
    createRateLimiter(RATE_LIMIT.RESEND_OTP);

export const renewTokenLimiter =
    createRateLimiter(RATE_LIMIT.RENEW_TOKEN);

export const forgetPasswordLimiter =
    createRateLimiter(RATE_LIMIT.FORGET_PASSWORD);

export const resetPasswordLimiter =
    createRateLimiter(RATE_LIMIT.RESET_PASSWORD);

export const passwordChangedLimiter =
    createRateLimiter(RATE_LIMIT.PASSWORD_CHANGED);