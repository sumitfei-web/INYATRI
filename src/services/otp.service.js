import redis from "../config/redis.js";
import { generateOtpForFlow } from "../utils/otp.util.js";

const OTP_TTL_SECONDS = 60;
const MAX_FAILED_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 600;

const otpKey = (countryCode, mobile) =>
  `inyatri:otp:${countryCode}${mobile}`;

const cooldownKey = (countryCode, mobile) =>
  `inyatri:otp:cooldown:${countryCode}${mobile}`;

export const getOtpCooldown = async (countryCode, mobile) => {
  const ttl = await redis.ttl(cooldownKey(countryCode, mobile));
  if (ttl > 0) {
    return { blocked: true, cooldownSeconds: ttl };
  }
  return { blocked: false, cooldownSeconds: 0 };
};

export const storeOtp = async (countryCode, mobile) => {
  const code = generateOtpForFlow({ includesPhone: true });
  const payload = JSON.stringify({ code, attempts: 0 });

  await redis.set(otpKey(countryCode, mobile), payload, "EX", OTP_TTL_SECONDS);

  return {
    code,
    expiresIn: OTP_TTL_SECONDS,
  };
};

export const verifyStoredOtp = async (countryCode, mobile, otp) => {
  const cooldown = await getOtpCooldown(countryCode, mobile);
  if (cooldown.blocked) {
    return {
      valid: false,
      blocked: true,
      cooldownSeconds: cooldown.cooldownSeconds,
      message: "Too many failed attempts. Try again in 10 minutes.",
    };
  }

  const raw = await redis.get(otpKey(countryCode, mobile));
  if (!raw) {
    return {
      valid: false,
      expired: true,
      message: "OTP expired or not found. Please request a new OTP.",
    };
  }

  const data = JSON.parse(raw);

  if (data.code !== otp) {
    data.attempts += 1;

    if (data.attempts >= MAX_FAILED_ATTEMPTS) {
      await redis.set(
        cooldownKey(countryCode, mobile),
        "1",
        "EX",
        COOLDOWN_SECONDS
      );
      await redis.del(otpKey(countryCode, mobile));

      return {
        valid: false,
        blocked: true,
        cooldownSeconds: COOLDOWN_SECONDS,
        attemptsRemaining: 0,
        message: "Too many failed attempts. Try again in 10 minutes.",
      };
    }

    await redis.set(
      otpKey(countryCode, mobile),
      JSON.stringify(data),
      "EX",
      OTP_TTL_SECONDS
    );

    return {
      valid: false,
      attemptsRemaining: MAX_FAILED_ATTEMPTS - data.attempts,
      message: "Invalid OTP. Please try again.",
    };
  }

  // OTP matched — do not delete here; caller removes after auth completes successfully
  return { valid: true };
};

export const consumeOtp = async (countryCode, mobile) => {
  await redis.del(otpKey(countryCode, mobile));
};
