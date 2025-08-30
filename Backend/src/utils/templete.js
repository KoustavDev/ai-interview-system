export const emailVarificationTemplete = (token) => {
  return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color:#f9fafb; margin:0; padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.05); padding:40px;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h2 style="color:#111827; margin:0; font-size:22px; font-weight:600;">
                  AI Interview System
                </h2>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="color:#374151; font-size:16px; line-height:24px; padding-bottom:20px;">
                Hello,  
                <br><br>
                We received a request to reset your password for your <b>AI Interview System</b> account.  
              </td>
            </tr>

            <!-- Call to Action -->
            <tr>
              <td align="center" style="padding:20px 0;">
                <a href=${process.env.PASSWORD_VARIFICATION_REDIRECT_URL}/${token}
                   style="background-color:#2563eb; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:8px; font-size:16px; font-weight:500; display:inline-block;">
                  Reset Password
                </a>
              </td>
            </tr>

            <!-- Info -->
            <tr>
              <td style="color:#6b7280; font-size:14px; line-height:22px; padding-top:20px;">
                This link will expire in <b>15 minutes</b> and can only be used once.  
                <br><br>
                If you didnt request a password reset, you can safely ignore this email.  
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding-top:30px; font-size:13px; color:#9ca3af;">
                © 2025 AI Interview System · All rights reserved  
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

    `;
};
