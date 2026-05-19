export const loginAlertTemplate = ({
  username,
  device,
  browser,
  ipAddress,
}) => {
  return `
    <div>
      <h2>Hello ${username}</h2>

      <p>
        Your account was logged in successfully.
      </p>

      <ul>
        <li><strong>Device:</strong> ${device}</li>
        <li><strong>Browser:</strong> ${browser}</li>
        <li><strong>IP:</strong> ${ipAddress}</li>
      </ul>

      <p>
        If this wasn't you, secure your account immediately.
      </p>
    </div>
  `;
};