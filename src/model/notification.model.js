const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["LIKE", "COMMENT", "FOLLOW"],
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ receiverId: 1, createdAt: -1 });

export const Notification = mongoose.model(
  "Notification",
  notificationSchema
);