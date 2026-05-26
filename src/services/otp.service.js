import redisClient from "../config/redis.config.js";
import { EMAIL_TYPES } from "../constants/email.constant.js";
import { addEmailJob } from "../queues/email.queue.js";
import { ApiError } from "../utils/ApiError.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendSMS } from "./sms.service.js";

// create otp
export const createOTP = async ({
    email,
    userId,
    username,
    phone,
    type,
    purpose,
}) => {
    const otp = generateOTP();

    // Save OTP in Redis for 5 mins
    const otpKey = `otp:${type}:${userId}`;
    console.log("otp_key : ",otpKey)
    await redisClient.setEx(otpKey, 300, otp);

    const check = await redisClient.get(otpKey);
    console.log("IMMEDIATE CHECK OTP:", check);

    if (phone) {
        try {
            console.log("SMS BHEJ RAHA HU")
            // send SMS
            await sendSMS({
                phone,
                otp,
            });
            console.log("SMS BHEJ DIYA HAI")
        } catch (error) {
            console.log("SOME PROBLEM IN SMS SERVICE : ", error);
            throw new ApiError(400, "Service unAvailable ");
        }
    } else {
        // add Email Job
        addEmailJob({
            type: EMAIL_TYPES.OTP_EMAIL,
            to: email,
            purpose,
            username,
            otp,
        }).catch(console.error);
    }

    return otp;
};
