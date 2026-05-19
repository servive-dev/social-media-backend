import { z } from "zod";

// Validation schema for user registration
export const registerSchema = z.object({
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

    email: z
        .string()
        .email("Invalid email address")
        .transform((email) => email.toLowerCase().trim()),

    phone: z
        .string()
        .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
        .optional(),

    // Date of Birth validation with age check (at least 15 years old)     
    dob: z.coerce.date().refine(
        (date) => {
            const age =
                (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365);

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
});
