export const otpEmailTemplate = ({ username, otp, expiryMinutes = 1 }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>OTP Verification</title>
  </head>

  <body style="margin:0; padding:0; background:#f6f9fc; font-family:Arial,sans-serif;">

    <div style="max-width:600px; margin:40px auto; background:#ffffff; padding:30px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

      <!-- Header -->
      <h2 style="text-align:center; color:#111827;">
        🔐 Verification Code
      </h2>

      <!-- Body -->
      <p style="font-size:15px; color:#4b5563;">
        Hi <b>${username}</b>,
      </p>

      <p style="font-size:15px; color:#4b5563;">
        Use the OTP below to verify your account:
      </p>

      <!-- OTP Box -->
      <div style="
        text-align:center;
        font-size:32px;
        letter-spacing:8px;
        font-weight:bold;
        color:#2563eb;
        background:#eff6ff;
        padding:15px;
        border-radius:8px;
        margin:20px 0;
      ">
        ${otp}
      </div>

      <p style="font-size:14px; color:#dc2626;">
        ⚠️ This OTP is valid for ${expiryMinutes} minutes. Do not share it with anyone.
      </p>

      <p style="font-size:14px; color:#6b7280;">
        If you did not request this, you can ignore this email.
      </p>

      <!-- Footer -->
      <div style="margin-top:30px; font-size:12px; text-align:center; color:#9ca3af;">
        © ${new Date().getFullYear()} Your App. All rights reserved.
      </div>

    </div>

  </body>
  </html>
  `;
};