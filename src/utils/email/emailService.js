import transporter from "../../config/nodemailer.js";
import Mustache from "mustache";
import ENV from "../../config/env.js";
import userTemplate from "./user/template.user.js";
import adminTemplate from "./admin/template.admin.js";
import logger from "../logger.js";
import template from "./user/template.user.js";

/**
 * Send Contact Support Email to Admin
 * @param {Object} params - Email parameters
 * @param {string} params.userEmail - User's email address
 * @param {string} params.query - User's support query/description
 * @returns {Promise<void>}
 */
export const sendContactSupportEmail = async ({ userEmail, query }) => {
  const logo =
    process.env.LOGO_URL ||
    "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const adminEmail =
    process.env.ADMIN_EMAIL || ENV.EMAIL?.MAIL_FROM || process.env.MAIL_FROM;

  const data = {
    logo,
    userEmail,
    query,
    timestamp,
  };

  const mailOptions = {
    from:
      process.env.MAIL_FROM || ENV.EMAIL?.MAIL_FROM || "noreply@charivote.com",
    to: adminEmail,
    subject: adminTemplate.contactSupport.subject,
    html: Mustache.render(adminTemplate.contactSupport.html, data),
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send Contact Support Confirmation Email to User
 * @param {Object} params - Email parameters
 * @param {string} params.to - User's email address
 * @param {string} params.query - User's support query/description
 * @returns {Promise<void>}
 */
export const sendContactSupportConfirmationEmail = async ({ to, query }) => {
  const logo =
    process.env.LOGO_URL ||
    "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

  const data = {
    logo,
    query,
  };

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to,
    subject: userTemplate.contactSupportConfirmation.subject,
    html: Mustache.render(userTemplate.contactSupportConfirmation.html, data),
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send Campaign Approval Email to Advertiser
 * @param {Object} params - Email parameters
 * @param {string} params.to - Advertiser's email address
 * @param {string} params.advertiserName - Advertiser's name
 * @param {string} params.campaignTitle - Campaign title
 * @returns {Promise<void>}
 */
export const sendCampaignApprovalEmail = async ({
  to,
  advertiserName,
  campaignTitle,
}) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      advertiserName,
      campaignTitle,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: Mustache.render(
        advertiserTemplate.campaignApproval.subject,
        data,
      ),
      html: Mustache.render(advertiserTemplate.campaignApproval.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending campaign approval email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

/**
 * Send Campaign Rejection Email to Advertiser
 * @param {Object} params - Email parameters
 * @param {string} params.to - Advertiser's email address
 * @param {string} params.advertiserName - Advertiser's name
 * @param {string} params.campaignTitle - Campaign title
 * @param {string} params.rejectionReason - Reason for rejection
 * @returns {Promise<void>}
 */
export const sendCampaignRejectionEmail = async ({
  to,
  advertiserName,
  campaignTitle,
  rejectionReason,
}) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      advertiserName,
      campaignTitle,
      rejectionReason,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: Mustache.render(
        advertiserTemplate.campaignRejection.subject,
        data,
      ),
      html: Mustache.render(advertiserTemplate.campaignRejection.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending campaign rejection email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

/**
 * Send Campaign Paused Email to Advertiser
 * @param {Object} params - Email parameters
 * @param {string} params.to - Advertiser's email address
 * @param {string} params.advertiserName - Advertiser's name
 * @param {string} params.campaignTitle - Campaign title
 * @returns {Promise<void>}
 */
export const sendCampaignPausedEmail = async ({
  to,
  advertiserName,
  campaignTitle,
}) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      advertiserName,
      campaignTitle,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: Mustache.render(advertiserTemplate.campaignPaused.subject, data),
      html: Mustache.render(advertiserTemplate.campaignPaused.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending campaign paused email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

/**
 * Send Campaign Resumed Email to Advertiser
 * @param {Object} params - Email parameters
 * @param {string} params.to - Advertiser's email address
 * @param {string} params.advertiserName - Advertiser's name
 * @param {string} params.campaignTitle - Campaign title
 * @returns {Promise<void>}
 */
export const sendCampaignResumedEmail = async ({
  to,
  advertiserName,
  campaignTitle,
}) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      advertiserName,
      campaignTitle,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: Mustache.render(
        advertiserTemplate.campaignResumed.subject,
        data,
      ),
      html: Mustache.render(advertiserTemplate.campaignResumed.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending campaign resumed email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

/**
 * Send Campaign Deleted Email to Advertiser
 * @param {Object} params - Email parameters
 * @param {string} params.to - Advertiser's email address
 * @param {string} params.advertiserName - Advertiser's name
 * @param {string} params.campaignTitle - Campaign title
 * @returns {Promise<void>}
 */
export const sendCampaignDeletedEmail = async ({
  to,
  advertiserName,
  campaignTitle,
}) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      advertiserName,
      campaignTitle,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: Mustache.render(
        advertiserTemplate.campaignDeleted.subject,
        data,
      ),
      html: Mustache.render(advertiserTemplate.campaignDeleted.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending campaign deleted email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

/**
 * Send User Signup Completion Email
 * @param {Object} params - Email parameters
 * @param {string} params.to - User's email address
 * @param {string} params.userName - User's full name
 * @returns {Promise<void>}
 */
export const sendUserSignupCompletionEmail = async ({ to, userName }) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      userName,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: userTemplate.signup.subject,
      html: Mustache.render(userTemplate.signup.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending user signup completion email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

/**
 * Send Advertiser Account Approval Email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Advertiser's email address
 * @param {string} params.advertiserName - Advertiser's name
 * @returns {Promise<void>}
 */
export const sendAdvertiserApprovalEmail = async ({ to, advertiserName }) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      advertiserName,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: advertiserTemplate.accountApproval.subject,
      html: Mustache.render(advertiserTemplate.accountApproval.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending advertiser approval email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

/**
 * Send Advertiser Account Blocked Email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Advertiser's email address
 * @param {string} params.advertiserName - Advertiser's name
 * @returns {Promise<void>}
 */
export const sendAdvertiserBlockEmail = async ({ to, advertiserName }) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      advertiserName,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: advertiserTemplate.accountBlocked.subject,
      html: Mustache.render(advertiserTemplate.accountBlocked.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending advertiser block email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

/**
 * Send Advertiser Account Unblocked Email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Advertiser's email address
 * @param {string} params.advertiserName - Advertiser's name
 * @returns {Promise<void>}
 */
export const sendAdvertiserUnblockEmail = async ({ to, advertiserName }) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      advertiserName,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: advertiserTemplate.accountUnblocked.subject,
      html: Mustache.render(advertiserTemplate.accountUnblocked.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending advertiser unblock email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

/**
 * Send Advertiser Account Deleted Email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Advertiser's email address
 * @param {string} params.advertiserName - Advertiser's name
 * @returns {Promise<void>}
 */
export const sendAdvertiserDeleteEmail = async ({ to, advertiserName }) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      advertiserName,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: advertiserTemplate.accountDeleted.subject,
      html: Mustache.render(advertiserTemplate.accountDeleted.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending advertiser delete email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

/**
 * Send Advertiser Signup Completion Email (Pending Admin Approval)
 * @param {Object} params - Email parameters
 * @param {string} params.to - Advertiser's email address
 * @param {string} params.advertiserName - Advertiser's name
 * @returns {Promise<void>}
 */
export const sendAdvertiserSignupCompletionEmail = async ({
  to,
  advertiserName,
}) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";

    const data = {
      logo,
      advertiserName,
    };

    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to,
      subject: advertiserTemplate.signupCompletion.subject,
      html: Mustache.render(advertiserTemplate.signupCompletion.html, data),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("Error sending advertiser signup completion email:", error);
    // Don't throw - email failures shouldn't break the main flow
  }
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Mate Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    logger.error("Email sending failed:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * From MAIL_FROM / env: accept plain email or RFC "Name <email@host>".
 * Avoids nesting like `"Mate" <Mate <user@gmail.com>>` which breaks clients (e.g. "Mate>").
 */
const extractEnvelopeAddress = (raw) => {
  if (raw == null) return "";
  let s = String(raw).trim();
  const inner = s.match(/<([^>]+)>/);
  if (inner) return inner[1].trim();
  s = s.replace(/^<+/, "").replace(/>+$/, "").trim();
  return s;
};

/**
 * @param {Object} params
 * @param {string} params.to
 * @param {string} params.code
 * @param {string} params.purposeLabel
 * @param {number} params.expiryMinutes
 */
export const sendOtpEmail = async ({
  to,
  code,
  purposeLabel,
  expiryMinutes,
}) => {
  const rawFrom =
    process.env.MAIL_FROM || ENV.EMAIL?.MAIL_FROM || process.env.SMTP_USER;
  const address =
    extractEnvelopeAddress(rawFrom) ||
    extractEnvelopeAddress(process.env.SMTP_USER) ||
    String(process.env.SMTP_USER || "").trim();
  const from =
    address !== ""
      ? { name: "Mate", address }
      : {
          name: "Mate Support",
          address:
            extractEnvelopeAddress(process.env.SMTP_USER) ||
            String(process.env.SMTP_USER || "").trim(),
        };
  const subject = "Your verification code";
  const html = `
    <p>Your verification code is <strong>${code}</strong>.</p>
    <p>Use it to ${purposeLabel}.</p>
    <p>This code expires in ${expiryMinutes} minutes.</p>
    <p>If you did not request this, you can ignore this email.</p>
  `;
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  } catch (error) {
    logger.error("OTP email failed:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * Notify admin by email when a user deletes their own account.
 */
export const sendUserSelfDeletedAdminEmail = async ({
  userId,
  userName,
  userEmail,
  userPhone,
}) => {
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";
    const adminEmail =
      process.env.ADMIN_EMAIL || ENV.EMAIL?.MAIL_FROM || process.env.MAIL_FROM;
    const timestamp = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
    const data = {
      logo,
      userId: String(userId ?? ""),
      userName: userName || "—",
      userEmail: userEmail || "—",
      userPhone: userPhone || "—",
      timestamp,
    };
    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to: adminEmail,
      subject: adminTemplate.userSelfDeletedAlert.subject,
      html: Mustache.render(adminTemplate.userSelfDeletedAlert.html, data),
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("sendUserSelfDeletedAdminEmail failed:", error);
  }
};

/**
 * Notify the user by email when an admin deletes their account.
 */
export const sendAccountDeletedByAdminUserEmail = async ({ to, userName }) => {
  if (!to || !String(to).trim()) return;
  try {
    const logo =
      process.env.LOGO_URL ||
      "https://s3-noi.aces3.ai/charivotebuck/profile/1769162687328-Component%2023.png";
    const data = { logo, userName: userName || "there" };
    const mailOptions = {
      from:
        process.env.MAIL_FROM ||
        ENV.EMAIL?.MAIL_FROM ||
        "noreply@charivote.com",
      to: String(to).trim(),
      subject: userTemplate.accountDeletedByAdmin.subject,
      html: Mustache.render(userTemplate.accountDeletedByAdmin.html, data),
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error("sendAccountDeletedByAdminUserEmail failed:", error);
  }
};

export const sendVaccinationProofStatusEmail = async ({
  to,
  userName,
  petName,
  status,
  rejectReason = "",
}) => {
  const approved = status === "approved";

  let html = template.vaccinationProofStatus.html;

  html = html.replace(
    "{{title}}",
    approved ? "Vaccination Proof Approved 🎉" : "Vaccination Proof Rejected",
  );

  html = html.replace("{{userName}}", userName);

  html = html.replace("{{petName}}", petName);

  html = html.replace("{{status}}", approved ? "Approved" : "Rejected");

  html = html.replace("{{statusColor}}", approved ? "green" : "red");

  html = html.replace(
    "{{message}}",
    approved
      ? "Congratulations! Your vaccination proof has been approved. Your pet profile has been updated successfully."
      : "Unfortunately, we couldn't approve your vaccination proof. Please upload a valid vaccination document and we'll review it again.",
  );

  html = html.replace(
    "{{reason}}",
    approved
      ? ""
      : `
      <p>
        <strong>Reason:</strong><br/>
        ${rejectReason || "No reason provided."}
      </p>
      `,
  );

  await sendEmail({
    to,
    subject: approved
      ? "Vaccination Proof Approved"
      : "Vaccination Proof Rejected",
    html,
  });
};

// Export templates for potential future use
export { userTemplate, adminTemplate };
