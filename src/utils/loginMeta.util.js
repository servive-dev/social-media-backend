import { UAParser } from "ua-parser-js";

export const getLoginMeta = (req) => {
    const ua = req.headers["user-agent"] || "";

    const parser = new UAParser(ua);
    const result = parser.getResult();

    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket?.remoteAddress ||
        "unknown";

    const deviceTypeRaw = result.device.type;

    const deviceType = (() => {
        if (!deviceTypeRaw) return "desktop";

        if (deviceTypeRaw === "mobile") return "mobile";
        if (deviceTypeRaw === "tablet") return "tablet";

        return "desktop";
    })();

    const deviceInfo = `${result.browser.name || "Postman"} on ${
        result.os.name || "Unknown OS"
    }`;

    return {
        deviceType,
        deviceInfo,
        ip,
        location: "unknown",
    };
};
