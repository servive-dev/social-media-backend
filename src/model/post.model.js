const postSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    caption: {
      type: String,
      default: "",
    },

    media: [
      {
        type: String, // image/video URLs
      },
    ],

    location: String,

    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.index({ owner: 1, createdAt: -1 });

export const Post = mongoose.model("Post", postSchema);