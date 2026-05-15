const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate follow
followSchema.index({ follower: 1, following: 1 }, { unique: true });

export const Follow = mongoose.model("Follow", followSchema);