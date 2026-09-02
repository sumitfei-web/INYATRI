import { OAuth2Client } from "google-auth-library";
import appleSignin from "apple-signin-auth";
import admin from "../config/firebaseConfig.js";
import ApiError from "./ApiError.js";
import logger from "./logger.js";

const googleClient = new OAuth2Client();

/**
 * Verifies a provider-issued or Firebase ID token server-side.
 * Returns trusted user profile data extracted from the token payload.
 *
 * @param {string} socialType - 'google', 'apple', or 'facebook'
 * @param {string} idToken - The ID token provided by client
 * @returns {Promise<{ social_id: string, email?: string, email_verified?: boolean, first_name?: string, last_name?: string }>}
 */


//need a discussion on this.
export const verifySocialIdToken = async (socialType, idToken) => {
  if (!idToken || typeof idToken !== "string") {
    throw new ApiError(401, "ID token is required and must be a string");
  }

  // 1. Google ID Token Verification
  if (socialType === "google") {
    // First try standard Google OAuth2 verification
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID || undefined,
      });
      const payload = ticket.getPayload();
      if (payload && payload.sub) {
        return {
          social_id: payload.sub,
          email: payload.email,
          email_verified: payload.email_verified,
          first_name:
            payload.given_name ||
            (payload.name ? payload.name.split(" ")[0] : undefined),
          last_name:
            payload.family_name ||
            (payload.name
              ? payload.name.split(" ").slice(1).join(" ")
              : undefined),
        };
      }
    } catch (googleErr) {
      logger.info(
        `Direct Google ID token verification failed, trying Firebase verification: ${googleErr.message}`,
      );
    }

    // Fallback: Check if token is a Firebase ID Token for Google sign-in
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return {
        social_id: decodedToken.sub || decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified,
        first_name: decodedToken.name
          ? decodedToken.name.split(" ")[0]
          : undefined,
        last_name: decodedToken.name
          ? decodedToken.name.split(" ").slice(1).join(" ")
          : undefined,
      };
    } catch (firebaseErr) {
      logger.error(`Google ID token verification failed: ${firebaseErr.message}`);
      throw new ApiError(401, "Invalid Google ID token");
    }
  }

  // 2. Apple Identity Token Verification
  if (socialType === "apple") {
    // First try Apple Sign-In verification
    try {
      const payload = await appleSignin.verifyIdToken(idToken, {
        audience: process.env.APPLE_CLIENT_ID
          ? process.env.APPLE_CLIENT_ID
          : undefined,
        ignoreExpiration: false,
      });
      if (payload && payload.sub) {
        return {
          social_id: payload.sub,
          email: payload.email,
          email_verified:
            payload.email_verified === "true" || payload.email_verified === true,
        };
      }
    } catch (appleErr) {
      logger.info(
        `Direct Apple ID token verification failed, trying Firebase verification: ${appleErr.message}`,
      );
    }

    // Fallback: Check if token is a Firebase ID Token for Apple sign-in
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return {
        social_id: decodedToken.sub || decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified,
        first_name: decodedToken.name
          ? decodedToken.name.split(" ")[0]
          : undefined,
        last_name: decodedToken.name
          ? decodedToken.name.split(" ").slice(1).join(" ")
          : undefined,
      };
    } catch (firebaseErr) {
      logger.error(`Apple ID token verification failed: ${firebaseErr.message}`);
      throw new ApiError(401, "Invalid Apple ID token");
    }
  }

  // 3. Facebook Verification
  if (socialType === "facebook") {
    // First try Firebase ID Token verification
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return {
        social_id: decodedToken.sub || decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified,
        first_name: decodedToken.name
          ? decodedToken.name.split(" ")[0]
          : undefined,
        last_name: decodedToken.name
          ? decodedToken.name.split(" ").slice(1).join(" ")
          : undefined,
      };
    } catch (fbFirebaseErr) {
      logger.info(
        `Firebase Facebook verification failed, trying direct Graph API verification: ${fbFirebaseErr.message}`,
      );
    }

    // Fallback: Direct Facebook Access/ID Token via Graph API
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,first_name,last_name&access_token=${encodeURIComponent(idToken)}`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          return {
            social_id: data.id,
            email: data.email,
            email_verified: !!data.email,
            first_name:
              data.first_name ||
              (data.name ? data.name.split(" ")[0] : undefined),
            last_name:
              data.last_name ||
              (data.name ? data.name.split(" ").slice(1).join(" ") : undefined),
          };
        }
      }
    } catch (graphErr) {
      logger.error(`Facebook Graph API verification failed: ${graphErr.message}`);
    }

    throw new ApiError(401, "Invalid Facebook token");
  }

  throw new ApiError(400, `Unsupported social_type: ${socialType}`);
};

export default {
  verifySocialIdToken,
};
