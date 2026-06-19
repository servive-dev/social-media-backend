import { EMAIL_TYPES } from "../constants/email.constant.js";
import { addEmailJob } from "../queues/email.queue.js";
import { ApiError } from "../utils/ApiError.util.js";
import { cacheKeys } from "../utils/cacheKeys.util.js";
import { generateOTP } from "../utils/generateOTP.util.js";
import { deleteCache, getCache, setCache } from "./cache.service.js";

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

    // ADD EMAIL JOB
    addEmailJob({
        type,
        to: email,
        purpose,
        username,
        otp,
    }).catch(console.error);

    return otp;
};
