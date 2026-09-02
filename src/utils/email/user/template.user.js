const template = {
  // User Contact Support Confirmation
  contactSupportConfirmation: {
    subject: "We Received Your Support Query",
    html: `
      <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #7257b1; border-radius: 10px;">
        
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="{{logo}}" alt="Charivote Logo" style="max-width: 140px; margin-bottom: 10px;">
          <h2 style="color: #ffffff; margin: 0;">Thank You for Contacting Us!</h2>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="font-size: 1em; color: #4b5563; line-height: 1.6; margin-top: 0;">
            Hello,
          </p>
          <p style="font-size: 1em; color: #4b5563; line-height: 1.6;">
            We've received your support query and our team will review it shortly.
          </p>
          <p style="font-size: 1em; color: #4b5563; line-height: 1.6;">
            We typically respond within <strong>24 hours</strong>. If your query is urgent, please contact us directly.
          </p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid #a78bfa;">
          <p style="margin-bottom: 10px; color: #111827; font-weight: 600;">
            Your Query
          </p>
          <p style="margin: 0; color: #4b5563; white-space: pre-wrap; line-height: 1.6;">
            {{query}}
          </p>
        </div>

        <div style="text-align: center; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.3);">
          <p style="font-size: 0.85em; color: #e5e7eb;">
            Best regards,<br>
            <strong>Charivote Support Team</strong>
          </p>
        </div>
      </div>
    `,
  },

  // User Signup Completion
  signup: {
    subject: "Welcome to Charivote - Signup Successful!",
    html: `
      <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #7257b1; border-radius: 10px;">
        
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="{{logo}}" alt="Charivote Logo" style="max-width: 140px; margin-bottom: 10px;">
          <h2 style="color: #ffffff; margin: 0;">Welcome to Charivote!</h2>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
          <p style="font-size: 1em; color: #4b5563; line-height: 1.6;">
            Hello {{userName}},
          </p>
          <p style="font-size: 1em; color: #4b5563; line-height: 1.6;">
            Congratulations! Your account has been successfully verified and activated.
          </p>
          <p style="font-size: 1em; color: #4b5563; line-height: 1.6;">
            You can now log in and start participating in campaigns, earning rewards, and making a difference. Explore exciting campaigns and start earning points today!
          </p>
          <p style="font-size: 1em; color: #4b5563; line-height: 1.6;">
            If you need any assistance, feel free to reach out to our support team.
          </p>
        </div>

        <div style="text-align: center; padding-top: 15px; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.3);">
          <p style="font-size: 0.85em; color: #e5e7eb;">
            Best regards,<br>
            <strong>Charivote Team</strong>
          </p>
        </div>
      </div>
    `,
  },

  accountDeletedByAdmin: {
    subject: "Your Mate account has been deleted",
    html: `
      <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #7257b1; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="{{logo}}" alt="Mate" style="max-width: 140px; margin-bottom: 10px;">
          <h2 style="color: #ffffff; margin: 0;">Account removed</h2>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
          <p style="font-size: 1em; color: #4b5563; line-height: 1.6;">Hello {{userName}},</p>
          <p style="font-size: 1em; color: #4b5563; line-height: 1.6;">
            Your Mate account has been deleted by an administrator. You will no longer be able to sign in with this account.
          </p>
          <p style="font-size: 1em; color: #4b5563; line-height: 1.6;">
            If you believe this was a mistake, please contact support.
          </p>
        </div>
        <div style="text-align: center; padding-top: 15px; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.3);">
          <p style="font-size: 0.85em; color: #e5e7eb;">Mate</p>
        </div>
      </div>
    `,
  },

  vaccinationProofStatus: {
    subject: "{{subject}}",
    html: `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
      
      <h2 style="color:#6C63FF;">{{title}}</h2>

      <p>Hi <strong>{{userName}}</strong>,</p>

      <p>
        We have reviewed the vaccination proof submitted for your pet
        <strong>{{petName}}</strong>.
      </p>

      <p>
        <strong>Status:</strong>
        <span style="color:{{statusColor}};">{{status}}</span>
      </p>

      {{reason}}

      <p>{{message}}</p>

      <br>

      <p>Regards,</p>
      <p><strong>Mate Team</strong></p>

    </div>
  `,
  },
};

export default template;
