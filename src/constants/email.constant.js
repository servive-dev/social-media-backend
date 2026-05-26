export const EMAIL_TYPES = {
   WELCOME: "WELCOME",
   REGISTER: "REGISTER",
   LOGIN_ALERT: "LOGIN_ALERT",
   NEW_DEVICE_LOGIN: "NEW_DEVICE_LOGIN",
   PASSWORD_CHANGED: "PASSWORD_CHANGED",
   FORGET_PASSWORD: "FORGET_PASSWORD",
   EMAIL_CHANGED: "EMAIL_CHANGED",
   OTP_EMAIL: "OTP_EMAIL",
   PHONE_NUMBER_CHANGED: "PHONE_NUMBER_CHANGED",
   DOB_CHANGED: "DOB_CHANGED",
   VERIFY_OTP: "VERIFY_OTP",
   FOLLOW_NOTIFICATION: "FOLLOW_NOTIFICATION",
   POST_COMMENT_NOTIFICATION: "POST_COMMENT_NOTIFICATION"
}

export const OTP_TYPES = {
   REGISTER: "REGISTER",
   FORGET_PASSWORD: "FORGET_PASSWORD",
   NEW_PASSWORD: "NEW_PASSWORD",
   EMAIL_CHANGED: "EMAIL_CHANGED",
   PHONE_NUMBER_CHANGED: "PHONE_NUMBER_CHANGED"
 }

export const OTP_EXPIRY = 300; // 5 min
export const OTP_ATTEMPT_LIMIT = 5;
export const OTP_RESEND_COOLDOWN = 60; // 1 min

export const OTP_META = {
  REGISTER: {
    title: "Verify Your Account",
    description: "Please verify your account using the OTP below.",
    color: "#2563eb",
    note: "After verification your account will be activated.",
  },

  FORGET_PASSWORD: {
    title: "Reset Your Password",
    description: "Use the OTP below to reset your password.",
    color: "#dc2626",
    note: "If this was not you, ignore this email.",
  },

  EMAIL_CHANGE: {
    title: "Verify Email Change",
    description: "Confirm your email change using OTP.",
    color: "#f59e0b",
    note: "Secure your account if this wasn't you.",
  },

  PHONE_CHANGE: {
    title: "Verify Phone Change",
    description: "Confirm your phone number change.",
    color: "#10b981",
    note: "Do not share this OTP.",
  },
};