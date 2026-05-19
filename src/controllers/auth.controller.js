import { User } from "../model/user.model.js";
import { Session } from "../model/session.model.js";
import redisClient from "../config/redis.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { EMAIL_TYPES } from "../constants/email.constant.js";
import { addEmailJob } from "../queues/email.queue.js";


// Controller for user registration
export const registerUser = asyncHandler(async (req, res) => {
   // Extract user details from the request body
   const { username, fullName, email, phone, dob, password } = req.body;

   // Build the query to check for existing username, email, or phone
   const query = {
      $or: [
         { username },
         { email },
      ],
   };

   if (phone) {
      query.$or.push({ phone }); 
   }

   // Check if the username or email already exists
   const existingUser = await User.findOne(query);
   
   if (existingUser) {
      throw new ApiError(400, "Username, email, or phone already exists");
   }

   // Create a new user
   const createdUser = await User.create({
      username,
      fullName,
      email,
      phone: phone ? phone : undefined,
      dob,
      password
   });
   
   // Fetch the newly created user without the password field
   const newUser = await User.findById(createdUser._id).select("-password");

   if (!newUser) {
      throw new ApiError(500, "Failed to create user");
   }

   // queue email
   await addEmailJob({
      type: EMAIL_TYPES.WELCOME,

      to: newUser.email,

      username: newUser.username
   })

   // return the response with the newly created user data
   return res
   .status(201)
   .json(
      new ApiResponse(
         201,
         newUser,
         "User registered successfully. Please log in to continue.",
      )
   )
   
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