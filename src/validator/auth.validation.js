import { z } from "zod";

// Validation schema for user registration
export const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must be at most 30 characters")
            .regex(
                /^[a-zA-Z][a-zA-Z0-9_]*$/,
                "Username must start with a letter and can only contain letters, numbers, and underscore"
            ),

        fullName: z
            .string()
            .min(3, "Full name must be at least 3 characters long")
            .max(100, "Full name cannot exceed 100 characters"),

        // Optional email
        email: z
            .string()
            .email("Invalid email address")
            .transform((email) => email.toLowerCase().trim())
            .optional(),

        // Optional phone
        phone: z
            .string()
            .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
            .optional(),

        // DOB validation
        dob: z.coerce.date().refine(
            (date) => {
                const age =
                    (Date.now() - date.getTime()) /
                    (1000 * 60 * 60 * 24 * 365);

                return age >= 15;
            },
            {
                message: "You must be at least 15 years old",
            }
        ),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters long")
            .max(100, "Password cannot exceed 100 characters"),
    })

    // Custom validation
    .refine(
        (data) => data.email || data.phone,
        {
            message: "Either email or phone number is required",
            path: ["email"], // error kis field par show karna hai
        }
    );

export const loginSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(
            /^[a-zA-Z][a-zA-Z0-9_]*$/,
            "Username must start with a letter and can only contain letters, numbers, and underscore"
        ),

    email: z
        .string()
        .email("Invalid email address")
        .transform((email) => email.toLowerCase().trim())
        .optional(),

    phone: z
        .string()
        .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
        .optional(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password cannot exceed 100 characters"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(10, "Invalid refresh token"),
});

// 🔐 VERIFY OTP
export const verifyOtpSchema = z.object({
   userId: z
      .string({ required_error: "userId is required" })
      .min(1, "userId cannot be empty"),

   otp: z
      .string({ required_error: "OTP is required" })
      .length(6, "OTP must be 6 digits"),

   type: z.enum([
      "REGISTER",
      "FORGET_PASSWORD",
      "EMAIL_CHANGE",
      "PHONE_CHANGE",
    ], {
      required_error: "OTP type is required",
    }),
});

export const registerOtpSchema = z.object({
   email: z
        .string()
        .email("Invalid email address")
        .transform((email) => email.toLowerCase().trim()),

   type: z.enum([
      "REGISTER",
      "FORGOT_PASSWORD",
      "EMAIL_CHANGE",
      "PHONE_CHANGE",
    ], {
      required_error: "OTP type is required",
    }),
});

export const resendOtpSchema = z.object({
   userId: z
      .string({ required_error: "userId is required" })
      .min(1, "userId cannot be empty"),

   type: z.enum([
      "REGISTER",
      "FORGOT_PASSWORD",
      "EMAIL_CHANGE",
      "PHONE_CHANGE",
    ], {
      required_error: "OTP type is required",
    }),
});

export const renewTokenSchema = z.object({
   refreshToken: z
      .string({ required_error: "refreshToken is required" })
      .min(20, "Invalid refresh token"),
});

export const forgetPasswordSchema = z.object({
   email: z
      .string()
      .email("Invalid email")
      .optional(),

   phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
      .optional(),
}).refine((data) => data.email || data.phone, {
   message: "Either email or phone is required",
});

export const resetPasswordSchema = z.object({
   resetToken: z
      .string({ required_error: "resetToken is required" })
      .min(20, "Invalid reset token"),

   newPassword: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password too long"),
});

export const changePasswordSchema = z.object({

   newPassword: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password too long"),

   confirmPassword: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password too long"),
}).refine((data) => data.newPassword === data.confirmPassword, {
   message: "Password don not match ",
});