import rateLimit from "express-rate-limit";

export const createRateLimiter = ({
    WINDOW_MS,
    MAX,
    MESSAGE,
}) => {
    return rateLimit({
        windowMs: WINDOW_MS,
        max: MAX,
        message: MESSAGE,
        standardHeaders: true,
        legacyHeaders: false,
    });
};