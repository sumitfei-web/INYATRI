import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import ENV from "../config/env.js";
import ApiError from "./ApiError.js";

const MD5_HEX_PATTERN = /^[a-f0-9]{32}$/i;

export const assertUserAuthConfig = () => {
  if (!ENV.JWT?.SECRET_USER?.trim()) {
    throw new ApiError(
      500,
      "User authentication is not configured (JWT_SECRET_USER missing)."
    );
  }

  if (!ENV.JWT?.EXPIRES_IN?.trim()) {
    throw new ApiError(
      500,
      "User authentication is not configured (JWT_EXPIRES_IN missing)."
    );
  }
};

export const signUserToken = (user) => {
  assertUserAuthConfig();

  return jwt.sign(
    {
      id: user.id,
      mobile: user.mobile,
      type: "user",
    },
    ENV.JWT.SECRET_USER,
    { expiresIn: ENV.JWT.EXPIRES_IN }
  );
};

export const signAdminToken = (admin) =>
  jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      login_type: admin.login_type,
      type: "admin",
    },
    ENV.JWT.SECRET_ADMIN,
    { expiresIn: ENV.JWT.EXPIRES_IN }
  );

export const splitFullName = (fullName = "") => {
  const trimmed = String(fullName).trim();
  if (!trimmed) {
    return { firstname: "", lastname: "" };
  }

  const parts = trimmed.split(/\s+/);
  const firstname = parts.shift() || "";
  const lastname = parts.join(" ");
  return { firstname, lastname };
};

export const formatUserResponse = (user) => {
  const data = user.toJSON ? user.toJSON() : user;
  delete data.password;
  delete data.token;

  data.full_name = [data.firstname, data.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

  data.requires_profile =
    !data.full_name && !data.email && !data.agreed_to_terms;

  return data;
};

export const formatAdminResponse = (admin) => {
  const data = admin.toJSON ? admin.toJSON() : admin;
  delete data.password;
  delete data.pass_view;
  return data;
};

export const verifyAdminPassword = async (plainPassword, storedPassword) => {
  if (!storedPassword) {
    return false;
  }

  const stored = String(storedPassword);

  if (stored.startsWith("$2")) {
    return bcrypt.compare(plainPassword, stored);
  }

  // Legacy PHP admin passwords stored as MD5 hex digest
  if (MD5_HEX_PATTERN.test(stored)) {
    const md5Hash = crypto
      .createHash("md5")
      .update(String(plainPassword))
      .digest("hex");
    return md5Hash === stored.toLowerCase();
  }

  return plainPassword === stored;
};

export const normalizeMobile = (mobile) =>
  String(mobile).replace(/\s/g, "").replace(/^0+/, "");

export const normalizeCountryCode = (countryCode = "+91") => {
  const trimmed = String(countryCode).trim();
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
};
