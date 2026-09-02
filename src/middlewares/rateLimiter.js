import rateLimit from 'express-rate-limit';

/**
 * Dedicated rate limiter for general authentication endpoints
 * (e.g., Login, Social Login, Forgot Password, Reset Password)
 */
export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 60 * 1000, // Default 1 minute
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS, 10) || 10, // Default 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts from this IP, please try again later.',
  },
});

/**
 * Dedicated rate limiter for OTP-sensitive endpoints
 * (e.g., Send OTP, Verify OTP, Resend OTP)
 */
export const otpLimiter = rateLimit({
  windowMs: parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MS, 10) || 60 * 1000, // Default 1 minute
  max: parseInt(process.env.OTP_RATE_LIMIT_MAX_REQUESTS, 10) || 5, // Default 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many OTP requests from this IP, please try again later.',
  },
});
