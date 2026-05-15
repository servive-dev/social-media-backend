import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 150,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
      try {
         const salt = await bcrypt.genSalt(10);
         this.password = await bcrypt.hash(this.password, salt);
         next();
      } catch (err) {
         next(err);
      }
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate Access Token only
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
         { id: this._id, username: this.username },
         process.env.JWT_SECRET,
         { expiresIn: "15m" }
    );
};

// Method to generate Refresh Token only
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
         { id: this._id },
         process.env.JWT_REFRESH_SECRET,
         { expiresIn: "7d" }
    );
};

export const User = mongoose.model("User", userSchema);
