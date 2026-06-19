import { Session } from "../model/session.model.js";
import { getLoginMeta } from "../utils/loginMeta.util.js";

export const createSession = async ({
    userId,
    refreshToken,
    req,
    loginMethod = "username_password",
}) => {
    try {
        const meta = getLoginMeta(req) || {};

        // SAFE NORMALIZATION
        const deviceType = ["desktop", "mobile", "tablet"].includes(
            meta.deviceType
        )
            ? meta.deviceType
            : "unknown";

        const deviceInfo =
            typeof meta.deviceInfo === "string"
                ? meta.deviceInfo
                : "unknown_device";

        const ip = meta.ip || "unknown";
        const location = meta.location || "unknown";

        // CHECK EXISTING SESSION
        const existingSession = await Session.findOne({
            userId,
            deviceInfo,
        });

        if (existingSession) {
            existingSession.refreshToken = refreshToken;
            existingSession.ip = ip;
            existingSession.location = location;
            existingSession.lastActiveAt = new Date();
            existingSession.expiresAt = new Date(
                Date.now() + 15 * 24 * 60 * 60 * 1000
            );

            await existingSession.save();
            return existingSession;
        }

        // CREATE NEW SESSION
        const session = await Session.create({
            userId,
            refreshToken,
            deviceInfo,
            deviceType,
            ip,
            location,
            loginMethod,
            lastActiveAt: new Date(),
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        });

        return session;
    } catch (err) {
        console.error("SESSION ERROR:", err);
        throw err;
    }
};
