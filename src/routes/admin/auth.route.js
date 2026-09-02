import express from "express";
const router = express.Router();

import * as authController from "../../controllers/admin/auth.controller.js";
import validate from "../../middlewares/validation.js";
import schema from "../../middlewares/joiValidation/admin/auth.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

router.post(
  "/admin-login",
  authLimiter,
  validate({ body: schema.adminLogin }),
  authController.adminLoginHandler
);

export default router;
