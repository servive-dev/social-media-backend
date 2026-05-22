import {UAParser} from "ua-parser-js";

const mapDeviceType = (device) => {
  if (!device?.type) return "desktop";

  if (device.type === "mobile") return "mobile";
  if (device.type === "tablet") return "tablet";

  return "desktop";
};

export const getDeviceInfo = (userAgent = "") => {
  const parser = new UAParser(userAgent);

  const browser = parser.getBrowser() || {};
  const os = parser.getOS() || {};
  const device = parser.getDevice() || {};

  const isPostman = userAgent.toLowerCase().includes("postman");

  if (isPostman) {
    return {
      deviceType: "api-client",
      deviceInfo: "Postman API Client",
      browser: "Postman",
      os: "Unknown",
    };
  }

  return {
    deviceType: mapDeviceType(device),

    deviceInfo: `${browser.name || "Unknown"} on ${os.name || "Unknown"}`,

    browser: browser.name || "Unknown",
    os: os.name || "Unknown",
  };
};