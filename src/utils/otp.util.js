import { randomInt } from "crypto";

/**
 * Cryptographically secure 6-digit numeric OTP (000000–999999).
 */
export const generateSixDigitOtp = () =>
  String(randomInt(0, 1_000_000)).padStart(6, "0");

/**
 * For development / SMS-sandbox cases (e.g., Twilio trial),
 * allow forcing a static OTP for phone flows from a single env switch.
 *
 * Set:
 * - PHONE_OTP_MODE=static
 * - PHONE_STATIC_OTP=123456 (optional; defaults to 123456)
 */
export const getPhoneStaticOtp = () =>
  String(process.env.PHONE_STATIC_OTP || "123456").padStart(6, "0");

/**
 * Determines whether static phone OTP should be used.
 * NOTE: Currently deferred during testing/UAT phase — static OTP is allowed via PHONE_OTP_MODE=static
 * in all environments including production. This should be locked down to disallow static OTP in
 * production prior to final production go-live.
 */
export const shouldUseStaticPhoneOtp = () => {
  const mode = String(process.env.PHONE_OTP_MODE || "").toLowerCase();

  // Explicit override
  if (mode === "static") {
    return true;
  }
  if (mode === "provider") {
    return false;
  }

  // Safe default for local/dev until provider is ready/recharged
  const nodeEnv = String(process.env.NODE_ENV || "").toLowerCase();
  return nodeEnv === "development" || nodeEnv === "localhost";
};

/**
 * Generate OTP for a flow. If the flow includes phone delivery and static mode is enabled,
 * returns the static OTP; otherwise returns a secure random OTP.
 */
export const generateOtpForFlow = ({ includesPhone = false } = {}) => {
  if (includesPhone && shouldUseStaticPhoneOtp()) {
    return getPhoneStaticOtp();
  }
  return generateSixDigitOtp();
};
