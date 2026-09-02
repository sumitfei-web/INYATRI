export const OTP_CONSTANTS = {
    EXPIRY_MINUTES: 5, // OTP expires after 5 minutes
    MAX_OTP_PER_HOUR: 5,
    RESEND_COOLDOWN_MS: 30 * 1000, // 30 seconds - resend enabled after 30 seconds
    OTP_PURPOSES: ['login', 'reset-password'],
    MAX_ATTEMPTS: 5, // Maximum allowed attempts before lockout
    LOCKOUT_DURATION_MS: 60 * 60 * 1000, // 1 hour lockout after max attempts
};
