import { User, sequelize } from "../../models/index.js";
import {
  assertUserAuthConfig,
  formatUserResponse,
  normalizeCountryCode,
  normalizeMobile,
  signUserToken,
  splitFullName,
} from "../../utils/auth.util.js";
import {
  consumeOtp,
  getOtpCooldown,
  storeOtp,
  verifyStoredOtp,
} from "../../services/otp.service.js";
import { sendOtpSms } from "../../utils/sms/twilioService.js";
import { shouldUseStaticPhoneOtp } from "../../utils/otp.util.js";
import ApiError from "../../utils/ApiError.js";
import {
  successResponse,
  tooManyRequestResponse,
  badRequestError,
  errorResponse,
} from "../../utils/response.js";
import logger from "../../utils/logger.js";

const findUserByMobile = async (mobile, options = {}) =>
  User.findOne({ where: { mobile }, ...options });

const sendOtpHandler = async (req, res) => {
  try {
    const countryCode = normalizeCountryCode(req.body.country_code);
    const mobile = normalizeMobile(req.body.mobile);

    const cooldown = await getOtpCooldown(countryCode, mobile);
    if (cooldown.blocked) {
      return tooManyRequestResponse(
        "Too many failed attempts. Try again in 10 minutes.",
        res,
        { cooldownSeconds: cooldown.cooldownSeconds }
      );
    }

    const existingUser = await findUserByMobile(mobile);
    if (existingUser && existingUser.status !== User.STATUS.ACTIVE) {
      return badRequestError(
        "Account is currently deactivated. Please contact the admin.",
        res
      );
    }

    const { code, expiresIn } = await storeOtp(countryCode, mobile);

    if (!shouldUseStaticPhoneOtp()) {
      try {
        await sendOtpSms({
          to: `${countryCode}${mobile}`,
          code,
          purposeLabel: "InYatri verification",
        });
      } catch (smsError) {
        logger.error("Failed to send OTP SMS:", smsError);
        return errorResponse(smsError, res);
      }
    }

    return successResponse(
      {
        isExistingUser: Boolean(existingUser),
        expiresIn,
      },
      "OTP sent successfully",
      res
    );
  } catch (error) {
    logger.error("sendOtp error:", error);
    return errorResponse(error, res);
  }
};

const verifyOtpHandler = async (req, res) => {
  const countryCode = normalizeCountryCode(req.body.country_code);
  const mobile = normalizeMobile(req.body.mobile);
  const otp = String(req.body.otp).trim();

  try {
    const cooldown = await getOtpCooldown(countryCode, mobile);
    if (cooldown.blocked) {
      return tooManyRequestResponse(
        "Too many failed attempts. Try again in 10 minutes.",
        res,
        { cooldownSeconds: cooldown.cooldownSeconds }
      );
    }

    const existingUser = await findUserByMobile(mobile);
    if (existingUser && existingUser.status !== User.STATUS.ACTIVE) {
      return badRequestError(
        "Account is currently deactivated. Please contact the admin.",
        res
      );
    }

    try {
      assertUserAuthConfig();
    } catch (configError) {
      return errorResponse(configError, res);
    }

    const verification = await verifyStoredOtp(countryCode, mobile, otp);

    if (!verification.valid) {
      if (verification.blocked) {
        return tooManyRequestResponse(verification.message, res, {
          cooldownSeconds: verification.cooldownSeconds,
        });
      }

      return badRequestError(verification.message, res);
    }

    const transaction = await sequelize.transaction();
    let user;
    let isNewUser = false;

    try {
      user = await User.findOne({
        where: { mobile },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (user && user.status !== User.STATUS.ACTIVE) {
        await transaction.rollback();
        return badRequestError(
          "Account is currently deactivated. Please contact the admin.",
          res
        );
      }

      if (!user) {
        isNewUser = true;
        user = await User.create(
          {
            mobile,
            country_code: countryCode,
            firstname: "",
            lastname: "",
            email: "",
            city: "",
            address: "",
            password: "",
            is_google_user: User.USER_TYPES.NORMAL,
            status: User.STATUS.ACTIVE,
          },
          { transaction }
        );
      }

      const token = signUserToken(user);
      await user.update({ token }, { transaction });

      await transaction.commit();
    } catch (dbError) {
      await transaction.rollback();
      throw dbError;
    }

    try {
      await consumeOtp(countryCode, mobile);
    } catch (consumeError) {
      logger.warn("OTP consumed in DB but failed to clear from Redis:", consumeError);
    }

    await user.reload();

    const userResponse = formatUserResponse(user);

    return successResponse(
      {
        isNewUser,
        isExistingUser: !isNewUser,
        requiresProfile: userResponse.requires_profile,
        token: user.token,
        user: userResponse,
      },
      "OTP verified successfully",
      res
    );
  } catch (error) {
    logger.error("verifyOtp error:", error);

    if (error instanceof ApiError) {
      return errorResponse(error, res);
    }

    return errorResponse(
      new ApiError(500, "Unable to complete login. Please try again."),
      res
    );
  }
};

const resendOtpHandler = async (req, res) => {
  return sendOtpHandler(req, res);
};

const completeProfileHandler = async (req, res) => {
  try {
    const user = req.user;
    const updates = {};

    if (req.body.full_name !== undefined) {
      const { firstname, lastname } = splitFullName(req.body.full_name);
      updates.firstname = firstname;
      updates.lastname = lastname;
    }

    if (req.body.email !== undefined && req.body.email !== "") {
      updates.email = req.body.email;
    }

    if (req.body.dob !== undefined && req.body.dob !== "") {
      updates.dob = req.body.dob;
    }

    if (req.body.referral_code !== undefined && req.body.referral_code !== "") {
      updates.referral_code = req.body.referral_code;
    }

    if (req.body.agreed_to_terms !== undefined) {
      updates.agreed_to_terms = req.body.agreed_to_terms ? 1 : 0;
    }

    if (req.body.marketing_opt_in !== undefined) {
      updates.marketing_opt_in = req.body.marketing_opt_in ? 1 : 0;
    }

    if (Object.keys(updates).length === 0) {
      return successResponse(
        formatUserResponse(user),
        "No profile changes provided",
        res
      );
    }

    await user.update(updates);
    await user.reload();

    return successResponse(
      formatUserResponse(user),
      "Profile updated successfully",
      res
    );
  } catch (error) {
    logger.error("completeProfile error:", error);
    return errorResponse(error, res);
  }
};

const logoutHandler = async (req, res) => {
  try {
    await req.user.update({ token: null });
    return successResponse([], "Logged out successfully", res);
  } catch (error) {
    logger.error("logout error:", error);
    return errorResponse(error, res);
  }
};

export {
  sendOtpHandler,
  verifyOtpHandler,
  resendOtpHandler,
  completeProfileHandler,
  logoutHandler,
};
