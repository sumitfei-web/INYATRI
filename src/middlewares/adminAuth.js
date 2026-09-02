import jwt from "jsonwebtoken";
import { Admin } from "../models/index.js";
import { unauthorizedResponse } from "../utils/response.js";

/************************* Authentication (ADMIN) **************************/
const auth = {
  required: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      // Header check
      if (!authHeader) {
        return unauthorizedResponse("Authorization header missing", res);
      }

      // Bearer format validation
      const parts = authHeader.split(" ");

      if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        return unauthorizedResponse("Invalid authorization format", res);
      }

      const token = parts[1];
      if (!token) {
        return unauthorizedResponse("Token not provided", res);
      }
      let decoded;
      try {        
        decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return unauthorizedResponse("Token expired", res);
        }

        if (error.name === "JsonWebTokenError") {
          return unauthorizedResponse("Invalid token", res);
        }

        return unauthorizedResponse("Authentication failed", res);
      }
      // Admin existence check
      const adminData = await Admin.findOne({
        where: {
          id: decoded.id,
          // is_deleted: false,
          // is_blocked: false,
        },
      });

      if (!adminData) {
        return unauthorizedResponse("Admin not found", res);
      }
      req.payload = decoded; // JWT payload attached to request for downstream use
      next();
    } catch (error) {
      return unauthorizedResponse("Unauthorized request", res);
    }
  },
};

export default auth;