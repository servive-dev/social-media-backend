export const loginAlertTemplate = ({
    username,
    email,
    deviceInfo,
    deviceType,
    loginMethod,
    location,
    ip,
}) => {
    return `
    <div>
      <h2>Hello ${username}!!</h2>

      <p>
        Your account was logged in successfully.
      </p>

      <ul>
        <li><strong>email:</strong> ${email}</li>
        <li><strong>DeviceInfo:</strong> ${deviceInfo}</li>
        <li><strong>deviceType:</strong> ${deviceType}</li>
        <li><strong>location:</strong> ${location}</li>
        <li><strong>loginMethod:</strong> ${loginMethod}</li>
        <li><strong>IP:</strong> ${ip}</li>
      </ul>

      <p>
        If this wasn't you, secure your account immediately.
      </p>
    </div>
  `;
};
