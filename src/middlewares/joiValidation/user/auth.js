import Joi from "joi";

const schema = {
  sendOtp: Joi.object({
    country_code: Joi.string()
      .pattern(/^\+\d{1,4}$/)
      .default("+91")
      .messages({
        "string.pattern.base": "Country code must start with + followed by digits",
      }),
    mobile: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "any.required": "Mobile number is required",
        "string.pattern.base": "Mobile number must be exactly 10 digits",
      }),
  }),

  verifyOtp: Joi.object({
    country_code: Joi.string()
      .pattern(/^\+\d{1,4}$/)
      .default("+91")
      .messages({
        "string.pattern.base": "Country code must start with + followed by digits",
      }),
    mobile: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "any.required": "Mobile number is required",
        "string.pattern.base": "Mobile number must be exactly 10 digits",
      }),
    otp: Joi.string()
      .length(6)
      .pattern(/^\d+$/)
      .required()
      .messages({
        "any.required": "OTP is required",
        "string.length": "OTP must be exactly 6 digits",
        "string.pattern.base": "OTP must be 6 digits",
      }),
  }),

  resendOtp: Joi.object({
    country_code: Joi.string()
      .pattern(/^\+\d{1,4}$/)
      .default("+91"),
    mobile: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "any.required": "Mobile number is required",
        "string.pattern.base": "Mobile number must be exactly 10 digits",
      }),
  }),

  completeProfile: Joi.object({
    full_name: Joi.string().max(80).optional().allow("", null),
    email: Joi.string().email().max(60).optional().allow("", null),
    dob: Joi.date().iso().optional().allow("", null),
    referral_code: Joi.string().max(50).optional().allow("", null),
    agreed_to_terms: Joi.boolean().optional(),
    marketing_opt_in: Joi.boolean().optional(),
  }),
};

export default schema;
