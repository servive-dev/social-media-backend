import { User } from "../model/user.model.js";
import { Session } from "../model/session.model.js";
import redisClient from "../config/redis.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { EMAIL_TYPES } from "../constants/email.constant.js";
import { addEmailJob } from "../queues/email.queue.js";

/*
TODO: REFACTOR THE FOLDER STRUCTURE 
TODO: MAKE A FILE REDIS.SERVICE.JS DO WORK LIKE LIKE SAVE TEMP USER--(EMAIL, DATA), GET TEMP USER BY EMAIL AND DELETER USER BY EMAIL
TODO: REGISTER CONTROLLER FLOW HEAVY REMOVE MONGO QUERY AND IMPLEMENT REDIS QUERIES
TODO: IN REDIS STORE USER TEMPORARY BEFORE THAT VERIFY EMAIL IS VERIFIED
TODO: EXPENSIVE OPERATION ARE DONE BY WORKERS IN BACKGORUND 
TODO: ONLY 2 FUNCTION RUNS 1st IS STORE USER AND 2nd IS ADD TO EMAIL JOB  
*/
export const registerUser = asyncHandler(async (req, res) => {

   const { username, fullName, email, phone, dob, password } = req.body;

   const createdUser = await User.create({
      username,
      fullName,
      email,
      phone: phone || undefined,
      dob,
      password
   });

   // fire & forget (non-blocking)
   addEmailJob({
      type: EMAIL_TYPES.WELCOME,
      to: createdUser.email,
      username: createdUser.username
   }).catch((err) => {
      console.error("EMAIL JOB FAILED IN ADD:", err);
   });

   const { _id, username: uname, email: mail, active } = createdUser;

   return res.status(201).json(
      new ApiResponse(
         201,
         {
            userId: _id,
            username: uname,
            email: mail,
            active
         },
         "User registered successfully"
      )
   );
});
// Controller for user login 
export const loginUser = asyncHandler(async (req, res) => {
   const {username, email, password} = req.body;

   //TODO:  Validation here -email, username 
   //TODO:  verify password here 
   //TODO:  generated refresh token and access token here 
   
   const user = {
      email,
      username
   }

   // device Info 
   const device = req.headers["user-agent"];
   const browser = "chrome";
   const ipAddress = req.ip;

   // queue login email
   await addEmailJob(
      {
         type: EMAIL_TYPES.LOGIN_ALERT,
         to: user.email,
         username: user.username,
         device,
         browser,
         ipAddress,
      }
   );

   // TODO: set refresh token and access token in cookies only 
   // TODO: return user without password and refreshtoken and accesstoken 

})

export const testRedis = async (req, res) => {
  await redisClient.set("name", "Om Yadav");

  const value = await redisClient.get("name");

  res.json({
    success: true,
    value,
  });
};