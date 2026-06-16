import { EMAIL_TYPES } from "../constants/email.constant.js";
import { addEmailJob } from "../queues/email.queue.js";
import { ApiError } from "../utils/ApiError.js";
import { cacheKeys } from "../utils/cacheKeys.js";
import { generateOTP } from "../utils/generateOTP.js";
import { deleteCache, getCache, setCache } from "./cache.service.js";

// create otp
// TODO:  OTP SERVICE ONLY FOR OTP
/*
    1. CHECK VALUES VALIDATION
    2. CREATE KEY OF REDIS 
    3. SAVE IN REDIS WITH EXPIRY TIME 
    4. AND RETURN 
*/

export const createOTP = async ({ email, userId, username, type, purpose }) => {
    let otp;
    const otpKey = cacheKeys.otp(type, email);

    try {
        const existingOTP = await getCache(otpKey);

        otp = generateOTP();
        
        const savedOTP = await setCache(otpKey, otp);

    } catch (error) {
        await deleteCache(otpKey);
        console.error("Error :", error);
    }

    // add Email Job
    addEmailJob({
        // type: EMAIL_TYPES.OTP_EMAIL,
        type,
        to: email,
        purpose,
        username,
        otp,
    }).catch(console.error);

    return otp;
};
