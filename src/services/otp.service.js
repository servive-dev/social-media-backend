import redisClient from "../config/redis.config.js"
import { EMAIL_TYPES } from "../constants/email.constant.js";
import { addEmailJob } from "../queues/email.queue.js";
import { ApiError } from "../utils/ApiError.js";
import { generateOTP } from "../utils/generateOTP.js"

// create otp 
export const createOTP = async ({email, userId, username}) => {
   
   const otp = generateOTP();
   
   // Save OTP in Redis for 5 mins
   await redisClient.set(
      `otp:${userId}`,
      otp,
      {
         EX:300,
      }
   );

   console.log("otp : ", otp)

   // add Email Job 
   addEmailJob({
      type: EMAIL_TYPES.OTP_EMAIL,
      to: email,
      username,
      otp
   }).catch(console.error);

   return otp;

}
