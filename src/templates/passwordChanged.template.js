export const passwordChangedTemplate = ({ username, time, ip, device }) => {
   return `
   <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      border: 1px solid #eee;
      padding: 20px;
      border-radius: 10px;
   ">

      <h2 style="color: #111;">
         🔐 Password Changed Successfully
      </h2>

      <p>Hi <b>${username}</b>,</p>

      <p>
         Your account password was recently changed successfully.
      </p>

      <div style="
         background: #f6f6f6;
         padding: 12px;
         border-radius: 8px;
         margin: 15px 0;
      ">
         <p><b>Time:</b> ${time}</p>
         <p><b>IP Address:</b> ${ip}</p>
         <p><b>Device:</b> ${device}</p>
      </div>

      <p style="color: #555;">
         If this was you, you can safely ignore this email.
      </p>

      <p style="color: red;">
         ⚠️ If you did NOT change your password, immediately reset it and secure your account.
      </p>

      <hr />

      <p style="font-size: 12px; color: #999;">
         This is an automated security email. Do not reply.
      </p>

   </div>
   `;
};