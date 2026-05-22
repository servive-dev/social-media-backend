import { User } from "../model/user.model.js";
import { Session } from "../model/session.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { EMAIL_TYPES } from "../constants/email.constant.js";
import { addEmailJob } from "../queues/email.queue.js";
import { createSession } from "../utils/createSession.js";
import { getDeviceInfo } from "../utils/getDeviceInfo.js";

// Controller for register user
export const registerUser = asyncHandler(async (req, res) => {
    const { username, fullName, email, phone, dob, password } = req.body;

    const createdUser = await User.create({
        username,
        fullName,
        email,
        phone: phone || undefined,
        dob,
        password,
    });

    // fire & forget (non-blocking)
    addEmailJob({
        type: EMAIL_TYPES.WELCOME,
        to: createdUser.email,
        username: createdUser.username,
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
                active,
            },
            "User registered successfully"
        )
    );
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
        throw new ApiError(400, "Invalid credentials");
    }

    // check password
    const matchPassword = await user.matchPassword(password);
    if (!matchPassword) {
        throw new ApiError(400, "Password is Incorrect");
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

    // DEVICE INFO (for email queue)
    const userAgent = req.headers["user-agent"];

    const deviceData = userAgent
        ? getDeviceInfo(userAgent)
        : {
              name: "unknown",
              version: "unknown",
              os: "unknown",
              device: "unknown",
          };

    console.log("DEVICE DATA : ", req.headers["user-agent"]);

    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket?.remoteAddress ||
        "unknown";

    const location = "unknown";

    // EMAIL QUEUE
    addEmailJob({
        type: EMAIL_TYPES.LOGIN_ALERT,
        to: user.email,
        username: user.username,

        deviceInfo: deviceData.deviceInfo,
        deviceType: deviceData.deviceType,
        ip,
        location,
        loginMethod: req.username || req.email,
    }).catch(console.error);

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
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15Days
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
                    isVerified: user.isVerified,
                    lastLogin: user.lastLogin,
                },
            },
            "Login successful"
        )
    );
});

// Controller for user logout in current device 
export const logOutUser = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    console.log("USER ID", userId)
    
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

    return res.status(200).json(
        new ApiResponse(200, {}, "Logged out from this device only")
    );
});

// Controller for user logOut in all device
export const logOutAll = asyncHandler( async(req, res) => 
    {
    const userId = req.user?.id;
    console.log("USER ID", userId , req.user)

    const refreshToken = req.cookies?.refreshToken || req.header("Authorization").replace("Bearer", "").trim()
    console.log("REFRESH TOKEN ID :", refreshToken)


    if (!userId) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (!refreshToken) {
        throw new ApiError(400, "No session found");
    }

    // 1. delete the session
    const deletedAllSessions = await Session.deleteMany({userId})

    // 2.update lastseen
    await User.findByIdAndUpdate(userId, {
        lastSeen: new Date()
    }) 

    // 3. All devices clear cookies
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "LogOut User in All devices"
        )
    )
})