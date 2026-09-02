import express from "express";
const router = express.Router();

import * as authController from "../../controllers/user/auth.controller.js";
import validate from "../../middlewares/validation.js";
import schema from "../../middlewares/joiValidation/user/auth.js";
import auth from "../../middlewares/userAuth.js";
import { otpLimiter } from "../../middlewares/rateLimiter.js";

router.post(
  "/send-otp",
  otpLimiter,
  validate({ body: schema.sendOtp }),
  authController.sendOtpHandler
);

router.post(
  "/verify-otp",
  otpLimiter,
  validate({ body: schema.verifyOtp }),
  authController.verifyOtpHandler
);

router.post(
  "/resend-otp",
  otpLimiter,
  validate({ body: schema.resendOtp }),
  authController.resendOtpHandler
);

router.post(
  "/complete-profile",
  auth.required,
  validate({ body: schema.completeProfile }),
  authController.completeProfileHandler
);

router.post("/logout", auth.required, authController.logoutHandler);

export default router;
