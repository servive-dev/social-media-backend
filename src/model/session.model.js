import mongoose from 'mongoose'

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
      enum: ["web", "mobile", "tablet", "desktop", "unknown"],
      default: "mobile",
    },

    ip: {
      type: String,
    },

    location: {
      type: String,
    },

    loginMethod: {
      type: String,
      enum: ["email", "google", "phone", "unknown"],
      default: "email",
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
      timestamps: true 
   }
);

// Index to automatically remove expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index({ userId: 1 });
sessionSchema.index({ refreshToken: 1 });

export const Session = mongoose.model("Session", sessionSchema);