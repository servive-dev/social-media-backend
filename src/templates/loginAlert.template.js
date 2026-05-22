
export const loginAlertTemplate = ({
    username,
    email,
    deviceInfo,
    deviceType,
    loginMethod,
    location,
    ip,
    ...fields
}) => {
    return `
    <div style="
        margin:0;
        padding:0;
        background:#f4f4f5;
        font-family:Arial,Helvetica,sans-serif;
    ">

        <div style="
            max-width:600px;
            margin:40px auto;
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
            box-shadow:0 4px 12px rgba(0,0,0,0.08);
        ">

            <!-- Header -->
            <div style="
                background:#111827;
                padding:24px;
                text-align:center;
                color:#ffffff;
            ">
                <h1 style="
                    margin:0;
                    font-size:24px;
                    font-weight:700;
                ">
                    Instagram Clone Security
                </h1>
            </div>

            <!-- Body -->
            <div style="padding:32px;">

                <h2 style="
                    margin-top:0;
                    color:#111827;
                    font-size:22px;
                ">
                    New Login Detected 👀
                </h2>

                <p style="
                    font-size:16px;
                    color:#374151;
                    line-height:1.7;
                ">
                    Hello <strong>${username}</strong>,
                </p>

                <p style="
                    font-size:16px;
                    color:#374151;
                    line-height:1.7;
                ">
                    We detected a new login to your account.
                    Below are the details of this session:
                </p>

                <!-- Session Details -->
                <div style="
                    background:#f9fafb;
                    border:1px solid #e5e7eb;
                    border-radius:10px;
                    padding:20px;
                    margin:24px 0;
                ">

                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="padding:8px 0;color:#6b7280;">
                                Email
                            </td>

                            <td style="
                                padding:8px 0;
                                text-align:right;
                                color:#111827;
                                font-weight:600;
                            ">
                                ${email || "N/A"}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:8px 0;color:#6b7280;">
                                Device
                            </td>

                            <td style="
                                padding:8px 0;
                                text-align:right;
                                color:#111827;
                                font-weight:600;
                            ">
                                ${deviceInfo || "Unknown Device"}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:8px 0;color:#6b7280;">
                                Device Type
                            </td>

                            <td style="
                                padding:8px 0;
                                text-align:right;
                                color:#111827;
                                font-weight:600;
                            ">
                                ${deviceType || "Unknown"}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:8px 0;color:#6b7280;">
                                Login Method
                            </td>

                            <td style="
                                padding:8px 0;
                                text-align:right;
                                color:#111827;
                                font-weight:600;
                            ">
                                ${loginMethod || "Email & Password"}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:8px 0;color:#6b7280;">
                                Location
                            </td>

                            <td style="
                                padding:8px 0;
                                text-align:right;
                                color:#111827;
                                font-weight:600;
                            ">
                                ${location || "Unknown"}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:8px 0;color:#6b7280;">
                                IP Address
                            </td>

                            <td style="
                                padding:8px 0;
                                text-align:right;
                                color:#111827;
                                font-weight:600;
                            ">
                                ${ip || "Unavailable"}
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Warning Box -->
                <div style="
                    background:#fef2f2;
                    border:1px solid #fecaca;
                    padding:18px;
                    border-radius:10px;
                    margin-top:24px;
                ">
                    <p style="
                        margin:0;
                        color:#991b1b;
                        font-size:15px;
                        line-height:1.6;
                    ">
                        If this login wasn't you, we strongly recommend
                        changing your password immediately and reviewing
                        your active sessions.
                    </p>
                </div>

                <!-- CTA -->
                <div style="
                    text-align:center;
                    margin-top:32px;
                ">
                    <a href="http://localhost:5173/security"
                        style="
                            display:inline-block;
                            background:#111827;
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 24px;
                            border-radius:8px;
                            font-weight:600;
                            font-size:15px;
                        ">
                        Secure My Account
                    </a>
                </div>

            </div>

            <!-- Footer -->
            <div style="
                background:#f9fafb;
                padding:20px;
                text-align:center;
                border-top:1px solid #e5e7eb;
            ">
                <p style="
                    margin:0;
                    color:#6b7280;
                    font-size:13px;
                    line-height:1.6;
                ">
                    This is an automated security alert from Instagram Clone.
                </p>

                <p style="
                    margin-top:8px;
                    color:#9ca3af;
                    font-size:12px;
                ">
                    © ${new Date().getFullYear()} Instagram Clone. All rights reserved.
                </p>
            </div>

        </div>

    </div>
    `;
};

