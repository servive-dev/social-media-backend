import { EMAIL_TYPES } from "../constants/email.constant.js";
import { addEmailJob } from "../queues/email.queue.js";
import { ApiError } from "../utils/ApiError.js";
import { cacheKeys } from "../utils/cacheKeys.js";
import { generateOTP } from "../utils/generateOTP.js";
import { getCache, setCache } from "./cache.service.js";

// create otp
// TODO:  OTP SERVICE ONLY FOR OTP 
/*
    1. CHECK VALUES VALIDATION
    2. CREATE KEY OF REDIS 
    3. SAVE IN REDIS WITH EXPIRY TIME 
    4. AND RETURN 
*/

export const createOTP = async ({ email, userId, username, type, purpose }) => {
    const otpKey = cacheKeys.otp(type, email);
    const existingOTP = await getCache(otpKey);
    if (existingOTP) {
        throw new ApiError(429, "OTP already sent. Please wait for 5mins");
    }

    const otp = generateOTP();

    const savedOTP = await setCache(otpKey, otp, 300);
    if (!savedOTP) {
        throw new ApiError(500, "failed to generate otp");
    }

    // add Email Job
    addEmailJob({
        type: EMAIL_TYPES.OTP_EMAIL,
        to: email,
        purpose,
        username,
        otp,
    }).catch(console.error);

    return otp;
};
