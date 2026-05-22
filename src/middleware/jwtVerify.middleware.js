import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = (req, res, next) => {

    try {

        // 1. Get token from cookies or headers
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        console.log("TOKEN", token )
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // 2. Verify token
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET_KEY
        );

        // 3. Attach user to request
        req.user = decoded;
        console.log("DECODED TOKEN IN REQUEST.BODY" ,req.user)
        next();

    } catch (error) {
         return next(new ApiError(401, "Invalid or expired token"));
    }
};