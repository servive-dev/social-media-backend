import { Router } from "express";
import {
    registerUser,
    loginUser,
    logOutUser,
    logOutAll,
    verifyOtp,
    resendOtp,
    renewToken,
    ForgetPassword,
    getMe,
    resetPassword,
    changePassword,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
    registerSchema,
    loginSchema,
    logoutSchema,
    verifyOtpSchema,
    resendOtpSchema,
    renewTokenSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
} from "../validator/auth.validation.js";
import {
    registerLimiter,
    verifyOtpLimiter,
    resendOtpLimiter,
    loginLimiter,
    logOutLimiter,
    renewTokenLimiter,
    forgetPasswordLimiter,
    resetPasswordLimiter,
    passwordChangedLimiter,
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
    .post(verifyOtpLimiter, validate(verifyOtpSchema), verifyOtp);
router
    .route("/resend-otp")
    .post(resendOtpLimiter,validate(resendOtpSchema ), resendOtp);

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

// Renew Token 
router
    .route("/renew-tokens")
    .post(renewTokenLimiter, validate(renewTokenSchema), renewToken)

// getMe 
router
    .route("/me")
    .get(verifyJWT, getMe)

// PASSWORD ROUTES
router  
    .route("/forget-password")
    .post(forgetPasswordLimiter, validate(forgetPasswordSchema), ForgetPassword)    
router  
    .route("/reset-password")
    .post(resetPasswordLimiter, validate(resetPasswordSchema), resetPassword)    
router  
    .route("/change-password")
    .patch(verifyJWT, passwordChangedLimiter, validate(changePasswordSchema), changePassword)    


export default router;
