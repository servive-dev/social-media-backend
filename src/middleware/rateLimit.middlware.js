import rateLimit from "express-rate-limit";
import { RATE_LIMIT } from "../constants/rateLimit.constant.js";

// Rate limiting middleware to prevent abuse and protect against brute-force attacks
export const authRateLimiter = rateLimit({
   
  windowMs: RATE_LIMIT.AUTH.WINDOW_MS,

  max: RATE_LIMIT.AUTH.MAX,

  message: RATE_LIMIT.AUTH.MESSAGE,

  standardHeaders: true,

  legacyHeaders: false,
});