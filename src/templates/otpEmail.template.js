import { OTP_META } from "../constants/email.constant.js"

export const otpEmailTemplate = ({
  username,
  purpose = "REGISTER",
  otp,
  type ,
  expiryMinutes = 5,
}) => {
  const data = OTP_META[purpose] || OTP_META.REGISTER;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>${data.title}</title>
  </head>

  <body style="margin:0; padding:0; background:#f6f9fc; font-family:Arial,sans-serif;">

    <div style="max-width:600px; margin:40px auto; background:#ffffff; padding:30px; border-radius:10px;">
      
      <h1 style="text-align:center; font-size:30px; color:#111827; ">
        Instagram Cone 
      </h1>

      <h2 style="text-align:center; font-size:18px; color:#111827;">
        ${data.title}
      </h2>

      <p style="font-size:15px; color:#4b5563;">
        Hi <b>${username}</b>,
      </p>

      <p style="font-size:15px; color:#4b5563;">
        ${data.description}
      </p>

      <div style="
        text-align:center;
        font-size:32px;
        letter-spacing:8px;
        font-weight:bold;
        color:${data.color};
        background:#f3f4f6;
        padding:15px;
        border-radius:8px;
        margin:20px 0;
      ">
        ${otp}
      </div>

      <p style="font-size:14px; color:#dc2626;">
        ⚠️ OTP valid for ${expiryMinutes} minutes
      </p>

      <p style="font-size:14px; color:#6b7280;">
        ${data.note}
      </p>

      <div style="margin-top:30px; font-size:12px; text-align:center; color:#9ca3af;">
        © ${new Date().getFullYear()} Your App
      </div>

    </div>

  </body>
  </html>
  `;
};