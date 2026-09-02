import twilio from "twilio";
import ApiError from "../ApiError.js";

/**
 * Normalize phone to E.164. If missing leading +, prepend TWILIO_DEFAULT_CALLING_CODE (digits only, no +).
 */
export const normalizePhoneE164 = (phone) => {
  const trimmed = String(phone).replace(/\s/g, "");
  if (trimmed.startsWith("+")) {
    return trimmed;
  }
  const cc = process.env.TWILIO_DEFAULT_CALLING_CODE?.replace(/^\+/, "").trim();
  if (!cc) {
    throw new ApiError(
      400,
      "Phone number must include country code (e.g. +14155552671), or set TWILIO_DEFAULT_CALLING_CODE in .env",
    );
  }
  const digits = trimmed.replace(/^0+/, "");
  return `+${cc}${digits}`;
};

/**
 * @param {Object} params
 * @param {string} params.to - Phone (E.164 or local with TWILIO_DEFAULT_CALLING_CODE)
 * @param {string} params.code - OTP digits
 * @param {string} params.purposeLabel - Human-readable purpose for SMS body
 */
export const sendOtpSms = async ({ to, code, purposeLabel }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) {
    throw new ApiError(
      503,
      "SMS is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.",
    );
  }

  const client = twilio(accountSid, authToken);
  const e164 = normalizePhoneE164(to);
  const body = `Your Mate verification code is ${code}. Use it to ${purposeLabel}. Do not share this code.`;

  await client.messages.create({
    to: e164,
    from,
    body,
  });
};

/**
 * Send a non-OTP transactional SMS (e.g. account notices).
 * Fails softly: logs and does not throw if Twilio is misconfigured.
 */
export const sendTransactionalSms = async ({ to, body }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!to || !String(body || "").trim()) return;
  if (!accountSid || !authToken || !from) {
    return;
  }
  try {
    const client = twilio(accountSid, authToken);
    const e164 = normalizePhoneE164(to);
    await client.messages.create({
      to: e164,
      from,
      body: String(body).trim(),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("sendTransactionalSms failed:", e?.message || e);
  }
};
