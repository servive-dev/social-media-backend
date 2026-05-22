import { Router } from "express";
import {
    registerUser,
    loginUser,
    logOutUser,
    logOutAll,
    verifyOtp,
    resendOtp,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
    registerSchema,
    loginSchema,
    logoutSchema,
} from "../validator/auth.validation.js";
import {
    registerLimiter,
    verifyOtpLimiter,
    resendOtpLimiter,
    loginLimiter,
    logOutLimiter,
} from "../middleware/rateLimit.middlware.js";
import { verifyJWT } from "../middleware/jwtVerify.middleware.js";

const router = Router();

// REGISTER ROUTE
router
    .route("/register")
    .post(registerLimiter, validate(registerSchema), registerUser);

// OTP ROUTES
router
    .route("/verify-otp")
    .post(verifyOtpLimiter, verifyOtp);

router
    .route("/resend-otp")
    .post(resendOtpLimiter, resendOtp);

// LOGIN ROUTE
router
    .route("/login")
    .post(loginLimiter, validate(loginSchema), loginUser);

// LOGOUT ROUTES
router
    .route("/logout")
    .post(verifyJWT, logOutLimiter, validate(logoutSchema), logOutUser);
router
    .route("/logout/all-devices")
    .post(verifyJWT, logOutLimiter, validate(logoutSchema), logOutAll);

export default router;
