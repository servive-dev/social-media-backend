import {  Router } from "express";
import { registerUser, testRedis } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema } from "../validator/auth.validation.js";
import { authRateLimiter } from "../middleware/rateLimit.middlware.js";

const router = Router();

// Route for user registration
router.route("/register").post(
   authRateLimiter,
   validate(registerSchema),
   registerUser
);

router.get("/redis-test", testRedis);

export default router;