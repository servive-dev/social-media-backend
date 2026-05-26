import rateLimit from "express-rate-limit";
import { RATE_LIMIT } from "../constants/rateLimit.constant.js";

// REGISTER LIMITER
export const registerLimiter = rateLimit({
    windowMs: RATE_LIMIT.REGISTER.WINDOW_MS,
    max: RATE_LIMIT.REGISTER.MAX,
    message: RATE_LIMIT.REGISTER.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
});

// LOGIN LIMITER
export const loginLimiter = rateLimit({
    windowMs: RATE_LIMIT.LOGIN.WINDOW_MS,
    max: RATE_LIMIT.LOGIN.MAX,
    message: RATE_LIMIT.LOGIN.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
});

// LOGOUT LIMITER
export const logOutLimiter = rateLimit({
    windowMs: RATE_LIMIT.LOGOUT.WINDOW_MS,
    max: RATE_LIMIT.LOGOUT.MAX,
    message: RATE_LIMIT.LOGOUT.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
});

// VERIFY OTP limiter (strict - brute force protection)
export const verifyOtpLimiter = rateLimit({
    windowMs: RATE_LIMIT.VERIFY_OTP.WINDOW_MS,
    max: RATE_LIMIT.VERIFY_OTP.MAX,
    message: RATE_LIMIT.VERIFY_OTP.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
});

// RESEND OTP limiter (very strict)
export const resendOtpLimiter = rateLimit({
    windowMs: RATE_LIMIT.RESEND_OTP.WINDOW_MS,
    max: RATE_LIMIT.RESEND_OTP.MAX,
    message: RATE_LIMIT.RESEND_OTP.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
});

// RENEW RATE LIMITER 
export const renewTokenLimiter = rateLimit({
    windowMs: RATE_LIMIT.RENEW_TOKEN.WINDOW_MS,
    max: RATE_LIMIT.RENEW_TOKEN.MAX,
    message: RATE_LIMIT.RENEW_TOKEN.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
});

// FORGET PASSWORD RATE LIMITER 
export const forgetPasswordLimiter  = rateLimit({
    windowMs: RATE_LIMIT.FORGET_PASSWORD.WINDOW_MS,
    max: RATE_LIMIT.FORGET_PASSWORD.MAX,
    message: RATE_LIMIT.FORGET_PASSWORD.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
});

// FORGET PASSWORD RATE LIMITER 
export const resetPasswordLimiter   = rateLimit({
    windowMs: RATE_LIMIT.RENEW_TOKEN.WINDOW_MS,
    max: RATE_LIMIT.RENEW_TOKEN.MAX,
    message: RATE_LIMIT.RENEW_TOKEN.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
});

// PASSWORD CHANGE RATE LIMITER 
export const passwordChangedLimiter   = rateLimit({
    windowMs: RATE_LIMIT.PASSWORD_CHANGED.WINDOW_MS,
    max: RATE_LIMIT.PASSWORD_CHANGED.MAX,
    message: RATE_LIMIT.PASSWORD_CHANGED.MESSAGE,
    standardHeaders: true,
    legacyHeaders: false,
});
