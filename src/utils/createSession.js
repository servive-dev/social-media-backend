import { Session } from "../model/session.model.js";
import { getDeviceInfo } from "./getDeviceInfo.js";

export const createSession = async ({
    userId,
    refreshToken,
    req,
    loginMethod = "email",
}) => {

    const device = getDeviceInfo(req.headers["user-agent"]);

    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket?.remoteAddress ||
        "unknown";

    // 🧠 1. check if session already exists for same device
    const existingSession = await Session.findOne({
        userId,
        deviceType: device.deviceType,
        ip,
    });

    // 🧠 2. if exists → update instead of create
    if (existingSession) {
        existingSession.refreshToken = refreshToken;
        existingSession.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await existingSession.save();
        return existingSession;
    }

    // 🆕 3. create new session
    const session = await Session.create({
        userId,
        refreshToken,

        deviceInfo: device.deviceInfo,
        deviceType: device.deviceType,

        ip,
        location: "unknown",
        loginMethod,

        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return session;
};