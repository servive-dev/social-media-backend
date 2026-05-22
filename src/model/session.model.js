import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        refreshToken: {
            type: String,
            required: true,
            select: false,
        },

        deviceInfo: {
            type: String,
            default: "Unknown Device",
        },

deviceType: {
    type: String,
    enum: ["desktop", "mobile", "tablet", "api_client", "unknown"],
    default: "unknown",
},

        ip: {
            type: String,
        },

        location: {
            type: String,
        },

        loginMethod: {
            type: String,
            enum: [
                "username_password",
                "email_otp",
                "phone_otp",
                "google_oauth",
                "github_oauth",
                "apple_oauth",
                "unknown",
            ],
            default: "username_password",
        },

        isValid: {
            type: Boolean,
            default: true,
        },

        lastActiveAt: {
            type: Date,
            default: Date.now,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },

    {
        timestamps: true,
    }
);

// Index to automatically remove expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1 });
sessionSchema.index({ refreshToken: 1 });

export const Session = mongoose.model("Session", sessionSchema);
