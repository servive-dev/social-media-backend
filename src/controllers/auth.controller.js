import { User } from "../model/user.model.js";
import { Session } from "../model/session.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { EMAIL_TYPES, OTP_TYPES } from "../constants/email.constant.js";
import { addEmailJob } from "../queues/email.queue.js";
import { createSession } from "../utils/createSession.js";
import { createOTP } from "../services/otp.service.js";
import jwt from "jsonwebtoken";
import {
    getCache,
    setCache,
    deleteCache,
    incrementCache,
    ttlCache,
    expiredCache,
} from "../services/cache.service.js";
import { cacheKeys } from "../utils/cacheKeys.js";
import { processImg } from "../utils/compressAvatar.js";
import { PURPOSE } from "../constants/auth.constant.js";
import { generateResetToken } from "../utils/jwt.js";

// TODO: COMPLETE FLOW RESET KRNA HAI REGISTER KA LIKE
/*  
    ----
    1. MAKE THE SENITIZE FUNCTIONS OF USERS 
    2. MAKE A UTILS FUNCTIONS 
    4. SESSION CREATION ON LOGIN OR NOT 
    5. SAVE ALL DETAILS OF LOGIN IN SESSION OR NOT 
    6. FIRST STORE IN REDIS AFTER BEFORE SAVE DIRECTLY TO DATEBASE OF SESSIONS

    9. CHECK DELETED ACCOUNT OR NOT  
    10. REMOVE UNNECESSARY IMPORTS FILES AND CONSOLE STATEMENTS 
    11. ADD LOGGING SYSTEM TO TRACK THEM 
    */

// Controller for register user
export const registerUser = asyncHandler(async (req, res) => {
    const { username, fullName, email, phone, dob, gender, avatar, password } =
        req.body;

    // GENERATE REGISTER -- REDIS KEY
    const registerKey = cacheKeys.registerUser(email);

    // SET TEMP DATA IN REDIS
    await setCache(
        registerKey,
        {
            username,
            fullName,
            email,
            phone,
            dob,
            gender,
            avatar: {
                url: req.file?.path,
                publicId: "",
            },
            password,
        },
        600 // 10min
    );

    // SEND EMAIL FOR OTP CODE
    await createOTP({
        type: EMAIL_TYPES.REGISTER,
        email,
        username,
        purpose: PURPOSE.OTP_EMAIL,
    });

    // SEND RESPONSE TO FRONTEND
    return res.status(201).json(
        new ApiResponse(
            201,
            {
                email,
            },
            "OTP send successfully"
        )
    );
});

// Controller for register verify otp
export const registerVerifyOtp = asyncHandler(async (req, res) => {
    const { email, type, otp } = req.body;

    // GENERATE OTP, ATTEMPT AND REGISTER -- REDIS KEY
    const otpKey = cacheKeys.otp(type, email);
    const attemptKey = cacheKeys.attempt(type, email);
    const registerKey = cacheKeys.registerUser(email);

    // GET VALUE OF OTP FROM OTP REDIS KEY
    const storedOTP = await getCache(otpKey);

    if (!storedOTP) {
        throw new ApiError(401, "OTP Expired or not found");
    }

    // CHECK OTP ATTEMPTS FOR REGISTER
    const attempts = Number(await getCache(attemptKey)) || 0;
    if (attempts >= 5) {
        await deleteCache(attemptKey);
        throw new ApiError(429, "Too many attempts ");
    }

    // INCREMENT THE ATTEMPT VALUE IF OTP NOT MATCHED
    if (storedOTP !== String(otp)) {
        await incrementCache(attemptKey);
        const ttl = await ttlCache(attemptKey);

        if (ttl === -1) {
            await expiredCache(attemptKey, 600);
        }
        throw new ApiError(400, "Invalid OTP");
    }

    // GET VALUE OF REGISTER_USER FROM REGISTER REDIS KEY
    const registeredData = await getCache(registerKey);

    if (!registeredData) {
        await deleteCache(otpKey);
        throw new ApiError(404, " Register Data Expired ");
    }

    // CHANGED DATA STRING TO JSON
    const userData =
        typeof registeredData === "string"
            ? JSON.parse(registeredData)
            : registeredData;

    // COMPRESS IMAGE AND UPLOAD TO CLOUDINARYY
    const avatarUpload = await processImg(userData.avatar?.url, "avatars");
    console.log("Avatar__Upload : ", avatarUpload);

    // CREATE AND SAVE USER IN DB
    const user = await User.create({
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        phone: userData?.phone,
        dob: userData.dob,
        gender: userData.gender,
        password: userData.password,
        avatar: {
            url: avatarUpload.secure_url,
            publicId: avatarUpload.public_id,
        },
        status: "active",
    });

    // DELETE OTP, ATTEMPT AND REGISTER -- REDIS KEY
    await deleteCache(registerKey);
    await deleteCache(otpKey);
    await deleteCache(attemptKey);

    // SEND WELCOME EMAIL MESSAGE
    await addEmailJob({
        type: EMAIL_TYPES.REGISTER,
        to: email,
        purpose: PURPOSE.REGISTER,
        username: userData.username,
    });

    // SEND RESPONSE TO FRONTEND
    return res.status(201).json(
        new ApiResponse(
            201,
            {
                userId: user._id,
                username: user.username,
                email: user.email,
            },
            "Account created Successfully"
        )
    );
});

// Controller for verify otp
export const verifyOtp = asyncHandler(async (req, res) => {
    const { email, type, otp } = req.body;

    // GENERATE OTP, ATTEMPT AND REGISTER -- REDIS KEY
    const otpKey = cacheKeys.otp(type, email);
    const attemptKey = cacheKeys.attempt(type, email);

    // GET VALUE OF OTP FROM OTP REDIS KEY
    const storedOTP = await getCache(otpKey);

    if (!storedOTP) {
        throw new ApiError(401, "OTP Expired or not found");
    }

    // TRACKING OTP ATTEMPT
    const attempts = Number(await getCache(attemptKey)) || 0;
    if (attempts >= 5) {
        await deleteCache(attemptKey);
        throw new ApiError(429, "Too many attempts ");
    }

    // INCREMENT THE ATTEMPT VALUE IF OTP NOT MATCHED
    if (storedOTP !== String(otp)) {
        await incrementCache(attemptKey);
        const ttl = await ttlCache(attemptKey);

        if (ttl === -1) {
            await expiredCache(attemptKey, 600);
        }
        throw new ApiError(400, "Invalid OTP");
    }

    // DELETE THE CACHE OF REDIS KEY WHICH USED
    await deleteCache(attemptKey);
    await deleteCache(otpKey);

    // USER FIND BY EMAIL
    const user = await User.findOne(email);
    if (user) {
        if (type === OTP_TYPES.FORGET_PASSWORD) {
            // GENERATE RESET-TOKEN -- REDIS KEY
            const resetTokenKey = cacheKeys.resetToken(email);
            // GENERATE RESET-TOKEN
            const resetToken = await generateResetToken();
            // GET USERID FROM USER IN STRING
            const userId = user._id.toString();
            // SET USER_ID IN REDIS
            await setCache(resetTokenKey, userId, 150);

            // SET SECURE COOKIE
            res.cookie("resetToken", resetToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000, // 15min
            });

            // SEND RESPOSE TO FRONTEND
            return res
                .status(200)
                .json(new ApiResponse(200, {}, "OTP verfied Successfully "));
        } else if (type === OTP_TYPES.EMAIL_CHANGED) {
            console.log("Email Changed Successfully");
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP type",
            });
        }
    }
});

// FIXME: FLOW
// Controller for resend otp
export const resendOtp = asyncHandler(async (req, res) => {
    const { email, type } = req.body;
    if (!email || !type) {
        throw new ApiError(400, "userId and type are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // const userId = user._id;
    // const coolDownKey = cacheKeys.coolDownKey(type, userId);
    const coolDownKey = cacheKeys.coolDownKey(type, email);

    const isBlocked = await getCache(coolDownKey);
    if (isBlocked) {
        throw new ApiError(429, "Please wait before requesting new OTP");
    }

    // EXISTING EXPIRED OTP DELETE PRECAUTIONS
    const otpKey = cacheKeys.otp(type, email);
    await deleteCache(otpKey);

    // SEND EMAIL FOR OTP CODE
    await createOTP({
        type: EMAIL_TYPES.RESEND_OTP,
        email,
        username: user.username,
        purpose: PURPOSE.RESEND_OTP,
    });

    await redisClient.set(coolDownKey, "1", { EX: 60 });

    return res.status(200).json({
        success: true,
        message: "OTP resent successfully",
    });
});

// Controller for user login
export const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const query = {
        $or: [{ username }, { email }],
    };

    // check user
    const user = await User.findOne(query).select("+password");
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    // check password
    const matchPassword = await user.matchPassword(password);
    if (!matchPassword) {
        throw new ApiError(401, "Invalid credentials");
    }

    //  Generate Refresh And Access Token
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    // tracking user
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // session create
    await createSession({
        userId: user._id,
        refreshToken,
        req,
    });

    // LOGIN META
    // const loginMeta = getLoginMeta(req);

    // LOGIN ALERT EMAIL QUEUE
    // await addEmailJob({
    //     type: EMAIL_TYPES.LOGIN_ALERT,
    //     to: user.email,
    //     username: user.username,
    //     email: user.email,

    //     ...loginMeta,
    // });

    // set secure cookies
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15min
    });

    // set secure cookies
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30Days
    });

    // Response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    avatar: user?.avatar || "",
                    // lastLogin: user.lastLogin,
                },
            },
            "Login successful"
        )
    );
});

// Controller for user logout in current device
export const logOutUser = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    console.log("USER ID", userId);

    const refreshToken = req.cookies?.refreshToken;
    // console.log("refershtoken ID", refreshToken)

    if (!userId) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (!refreshToken) {
        throw new ApiError(400, "No session found");
    }

    // 1. delete ONLY current device session
    const deletedSession = await Session.findOneAndDelete({
        userId,
        refreshToken,
    });

    if (!deletedSession) {
        throw new ApiError(404, "Session already expired");
    }

    // 2. update lastSeen
    await User.findByIdAndUpdate(userId, {
        lastSeen: new Date(),
    });

    // 3. clear cookies (ONLY current device)
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Logged out from this device only"));
});

// Controller for user logOut in all device
export const logOutAll = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    console.log("USER ID", userId, req.user);

    const refreshToken =
        req.cookies?.refreshToken ||
        req.header("Authorization").replace("Bearer", "").trim();
    console.log("REFRESH TOKEN ID :", refreshToken);

    if (!userId) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (!refreshToken) {
        throw new ApiError(400, "No session found");
    }

    // 1. delete the session
    const deletedAllSessions = await Session.deleteMany({ userId });

    // 2.update lastseen
    await User.findByIdAndUpdate(userId, {
        lastSeen: new Date(),
    });

    // 3. All devices clear cookies
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "LogOut User in All devices"));
});

// renew refresh token
export const renewToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    console.log("INCOMING REFRESH TOKEN", incomingRefreshToken);

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token missing");
    }

    let decoded;

    try {
        decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY
        );

        console.log("DECODED", decoded);
    } catch (error) {
        console.log("JWT ERROR NAME:", error.name);
        console.log("JWT ERROR MESSAGE:", error.message);

        throw new ApiError(401, "Invalid refresh token");
    }

    const session = await Session.findOne({
        userId: decoded.id,
        refreshToken: incomingRefreshToken,
    });

    if (!session) {
        throw new ApiError(401, "Session expired or invalid");
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // ROTATE SESSION
    session.refreshToken = newRefreshToken;
    await session.save();

    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { userId: user._id },
                "Tokens refreshed successfully"
            )
        );
});

// Get ME
export const getMe = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    console.log("USER ID", userId);

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "Get Me"));
});

// forget password
export const ForgetPassword = asyncHandler(async (req, res) => {
    const { email, phone } = req.body;

    const user = await User.findOne({
        $or: [{ email }, { phone }],
    });

    // always same response (security)
    if (!user) {
        return res.status(200).json({
            success: true,
            message: "If account exists, OTP has been sent",
        });
    }

    await createOTP({
        email: email,
        type: OTP_TYPES.FORGET_PASSWORD,
        purpose: OTP_TYPES.FORGET_PASSWORD,
        username: user.username,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "If account exists, OTP has been sent"));
});

// reset Password
export const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken, newPassword } = req.body;

    const resetKey = cacheKeys.reset(resetToken);

    const userId = await getCache(resetKey);
    if (!userId) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(400, "User not found");
    }

    // newPassword save in db
    user.password = newPassword;
    await user.save();

    // delete the token from redis (one time use)
    await deleteCache(resetKey);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfully"));
});

// change Password
export const changePassword = asyncHandler(async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 2. PASSWORD update
    user.password = newPassword;
    await user.save();

    // 3. SEND EMAIL (NON-BLOCKING)
    await addEmailJob({
        type: EMAIL_TYPES.PASSWORD_CHANGED,
        to: user.email,
        username: user.username,
        purpose: PURPOSE.PASSWORD_CHANGED,
        // time: new Date().toLocaleString(),
        // ip: req.ip,
        // device: req.headers["user-agent"],
    }).catch(console.error);

    // 4. RESPONSE
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Password changed successfully"));
});
