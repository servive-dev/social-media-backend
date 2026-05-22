import {  Router } from "express";
import { registerUser, loginUser, logOutUser, logOutAll } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema, logoutSchema } from "../validator/auth.validation.js";
import { authRateLimiter } from "../middleware/rateLimit.middlware.js";
import { verifyJWT } from "../middleware/jwtVerify.middleware.js";

const router = Router();

// Route for user registration
router.route("/register").post(
   authRateLimiter,
   validate(registerSchema),
   registerUser
);

router.route("/login").post(
   authRateLimiter,
   validate(loginSchema),
   loginUser
);

router.route("/logout").post(
   verifyJWT,
   authRateLimiter,
   // validate(logoutSchema),
   logOutUser
);


router.route("/logout/all-devices").post(
   verifyJWT,
   authRateLimiter,
   // validate(logoutSchema),
   logOutAll
);

export default router;