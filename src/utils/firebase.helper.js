import admin from "../config/firebaseConfig.js";
import ApiError from "./ApiError.js";
import logger from "./logger.js";

/**
 * Send notification to single device
 */
export const sendToSingleUser = async (token, title, body, data = {}) => {
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data, // optional custom payload
    };

    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    logger.error("🔥 Firebase Single Send Error:", error);
    throw error;
  }
};

/**
 * Send notification to multiple devices
 */
export const sendToMultipleUsers = async (tokens, title, body, data = {}) => {
  try {
    if (!tokens || !tokens.length) {
      throw new ApiError(400, "No FCM tokens provided");
    }

    const message = {
      tokens,
      notification: {
        title,
        body,
      },
      data,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    return response;
  } catch (error) {
    logger.error("🔥 Firebase Multicast Send Error:", error);
    throw error;
  }
};


