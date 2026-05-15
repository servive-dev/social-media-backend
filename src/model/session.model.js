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
    },

    deviceInfo: String,

    ip: String,
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);