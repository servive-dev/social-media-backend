import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { ApiError } from "../utils/ApiError.js"

if(!process.env.EMAIL_USER || !process.env.EMAIL_PASS){
   throw new ApiError(
      400,
      "Email credentials missing in environment variables"
   )
}

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  pool: true,
  maxConnections: 5,
  rateDelta: 20000,
  rateLimit: 5
});

export const sendEmail = async ({ to, subject, html }) => {

  if (!to || !subject) {
    throw new ApiError(400, "Missing email fields");
  }

  const mailOptions = {
    from: `"Instagram Clone" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Email error:", error.message);

    // important: rethrow for queue retry
    throw error;
  }
};