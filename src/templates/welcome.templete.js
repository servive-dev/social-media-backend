export const welcomeTemplate = ({ username }) => {
  return `
  <div style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

    <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background:#4f46e5;padding:20px;text-align:center;color:#fff;">
        <h1 style="margin:0;font-size:24px;">Instagram Clone 🚀</h1>
      </div>

      <!-- Body -->
      <div style="padding:30px;color:#333;">

        <h2 style="margin-top:0;">Welcome, ${username} 👋</h2>

        <p style="font-size:16px;line-height:1.6;">
          Your account has been successfully created and is ready to use.
        </p>

        <p style="font-size:16px;line-height:1.6;">
          You can now explore posts, connect with friends, and enjoy the platform.
        </p>

        <!-- CTA Button -->
        <div style="text-align:center;margin:30px 0;">
          <a href="http://localhost:5001/api/v1/auth/login" 
             style="
              background:#4f46e5;
              color:#fff;
              padding:12px 24px;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
              display:inline-block;
             ">
            Go to Dashboard
          </a>
        </div>

        <p style="font-size:14px;color:#777;">
          If you didn’t create this account, you can safely ignore this email.
        </p>

      </div>

      <!-- Footer -->
      <div style="background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#888;">
        © ${new Date().getFullYear()} Instagram Clone. All rights reserved.
      </div>

    </div>

  </div>
  `;
};