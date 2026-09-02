const template = {
  // Admin Contact Support Notification
  contactSupport: {
    subject: "New Contact Support Query",
    html: `
           <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #7257b1; border-radius: 10px;">
    
    <div style="text-align: center; margin-bottom: 25px;">
        <img src="{{logo}}" alt="Charivote Logo" style="max-width: 140px; margin-bottom: 10px;">
        <h2 style="color: #ffffff; margin: 0;">New Support Query Received</h2>
    </div>

    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 8px 0; color: #4b5563;">
            <strong>From:</strong>
            <a href="mailto:{{userEmail}}" style="color: #7c3aed; text-decoration: none;">
                {{userEmail}}
            </a>
        </p>
        <p style="margin: 8px 0; color: #6b7280;">
            <strong>Submitted at:</strong> {{timestamp}}
        </p>
    </div>

    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid #a78bfa;">
        <p style="margin-bottom: 12px; color: #111827; font-weight: 600;">
            Query Details
        </p>
        <p style="margin: 0; color: #4b5563; white-space: pre-wrap; line-height: 1.6;">
            {{query}}
        </p>
    </div>

    <div style="text-align: center; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.3);">
        <p style="font-size: 0.85em; color: #e5e7eb;">
            Reply directly to:
            <a href="mailto:{{userEmail}}" style="color: #ddd6fe; text-decoration: none;">
                {{userEmail}}
            </a>
        </p>
    </div>
</div>

        `,
  },

  forgotPassword: {
    subject: "Reset Your Password",
    html: `
  <div style="background-color:#f4f6fb; padding:40px 0; font-family:Arial, Helvetica, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <tr>
        <td style="background:#7257b1; padding:25px; text-align:center;">
          <h2 style="color:#ffffff; margin:0; font-size:22px;">
            Mate Admin Panel
          </h2>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px;">
          <h3 style="margin-top:0; color:#111827;">
            Password Reset Request
          </h3>

          <p style="color:#4b5563; font-size:14px; line-height:1.6;">
            Hello Admin,
          </p>

          <p style="color:#4b5563; font-size:14px; line-height:1.6;">
            We received a request to reset your account password. 
            Click the button below to set a new password.
          </p>

          <!-- Button -->
          <div style="text-align:center; margin:30px 0;">
            <a href="{{resetLink}}" 
               style="background-color:#7257b1;
                      color:#ffffff;
                      padding:12px 24px;
                      text-decoration:none;
                      border-radius:6px;
                      font-size:14px;
                      display:inline-block;">
              Reset Password
            </a>
          </div>

          <p style="color:#6b7280; font-size:13px; line-height:1.6;">
            This link will expire in <strong>5 minutes</strong>.
          </p>

          <p style="color:#9ca3af; font-size:12px; line-height:1.6;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#9ca3af;">
          © ${new Date().getFullYear()} Mate. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `,
  },

  userSelfDeletedAlert: {
    subject: "Mate: User deleted their own account",
    html: `
  <div style="background-color:#f4f6fb; padding:40px 0; font-family:Arial, Helvetica, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden;">
      <tr>
        <td style="background:#7257b1; padding:25px; text-align:center;">
          <h2 style="color:#ffffff; margin:0; font-size:20px;">Account deletion (self-service)</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:30px;">
          <p style="color:#4b5563; font-size:14px; line-height:1.6;">A user has deleted their own account via the app.</p>
          <table style="width:100%; border-collapse:collapse; font-size:14px; color:#111827;">
            <tr><td style="padding:8px 0; border-bottom:1px solid #e5e7eb;"><strong>User ID</strong></td><td style="padding:8px 0; border-bottom:1px solid #e5e7eb;">{{userId}}</td></tr>
            <tr><td style="padding:8px 0; border-bottom:1px solid #e5e7eb;"><strong>Name</strong></td><td style="padding:8px 0; border-bottom:1px solid #e5e7eb;">{{userName}}</td></tr>
            <tr><td style="padding:8px 0; border-bottom:1px solid #e5e7eb;"><strong>Email</strong></td><td style="padding:8px 0; border-bottom:1px solid #e5e7eb;">{{userEmail}}</td></tr>
            <tr><td style="padding:8px 0;"><strong>Phone</strong></td><td style="padding:8px 0;">{{userPhone}}</td></tr>
          </table>
          <p style="color:#6b7280; font-size:13px; margin-top:20px;">Time: {{timestamp}}</p>
        </td>
      </tr>
    </table>
  </div>
  `,
  },

  contactReply: {
    subject: "Response to Your Support Query",
    html: `
  <div style="background-color:#f4f6fb; padding:40px 0; font-family:Arial, Helvetica, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <tr>
        <td style="background:#7257b1; padding:25px; text-align:center;">
          <h2 style="color:#ffffff; margin:0; font-size:22px;">
            Mate Support Team
          </h2>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px;">
          <h3 style="margin-top:0; color:#111827;">
            Hello {{userName}},
          </h3>

          <p style="color:#4b5563; font-size:14px; line-height:1.6;">
            We have reviewed your query titled:
          </p>

          <p style="color:#111827; font-weight:600; margin:10px 0;">
            {{queryTitle}}
          </p>

          <p style="color:#4b5563; font-size:14px; line-height:1.6;">
            Our response:
          </p>

          <div style="background:#f9fafb; padding:15px; border-radius:6px; border-left:4px solid #7257b1; margin:15px 0;">
            <p style="margin:0; color:#374151; font-size:14px; line-height:1.6;">
              {{replyMessage}}
            </p>
          </div>

          <p style="color:#6b7280; font-size:13px; line-height:1.6;">
            If you have further questions, feel free to contact us again.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#9ca3af;">
          © ${new Date().getFullYear()} Mate. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `,
  },
};

export default template;
