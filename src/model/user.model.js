import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        // ================== Basic Info ==================
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            minlength: 3,
            maxlength: 30,
            index: true
            },

        fullName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Invalid email"],
            unique: true,
            index: true
        },

        phone: {
            type: String,
            unique: true,
            sparse: true, // allow multiple null values
            trim:true,
            default: undefined
        },

        dob: {
            type: Date,
            required: true,
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 100,
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
            validate: {
                validator: function (v) {
                    return (
                        v === "" ||
                        validator.isURL(v, { require_protocol: true })
                    );
                },
                message: "Invalid URL. Must include http:// or https://",
            },
        },

        // ================== Account Settings ==================

        isPrivate: {
            type: Boolean,
            default: false,
        },

        // isVerified: {
        //     type: Boolean,
        //     default: false,
        // },

        status: {
            type: String,
            enum: ["active", "banned", "deleted", "inactive"],
            default: "inactive",
        },

        // ================== Activity Tracking ==================
        lastSeen: {
            type: Date,
            default: null,
        },

        lastLogin: {
            type: Date,
            default: null,
        },

        loginCount: { 
            type: Number,
            default: 0,
        },

        // ================== Relations counters ==================
        followersCount: {
            type: Number,
            default: 0,
        },

        followingCount: {
            type: Number,
            default: 0,
        },

        postsCount: {
            type: Number,
            default: 0,
        },

        // ================== Security & Permissions ==================
        passwordChangedAt: {
            type: Date,
            default: null,
        },

        usernameChangedAt: {
            type: Date,
            default: null,
        },

        emailChangedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

userSchema.index({ status: 1 });

// Hash the password before saving the user
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);

    this.passwordChangedAt = new Date();

});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate Access Token only
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            username: this.username,
            status: this.status,
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRED }
    );
};

// Method to generate Refresh Token only
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRED }
    );
};

// Remove deleted and banned users from all find queries
// userSchema.pre(/^find/, function (next) {
//     this.find({
//         status: { $nin: ["deleted", "banned"] },
//     });
//     next();
// });

export const User = mongoose.model("User", userSchema);
