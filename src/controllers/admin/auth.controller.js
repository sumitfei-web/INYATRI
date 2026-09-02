import { Admin, sequelize } from "../../models/index.js";
import {
  formatAdminResponse,
  signAdminToken,
  verifyAdminPassword,
} from "../../utils/auth.util.js";
import {
  successResponse,
  unauthorizedResponse,
  badRequestError,
  errorResponse,
} from "../../utils/response.js";
import logger from "../../utils/logger.js";

const adminLoginHandler = async (req, res) => {
  try {
    const email = String(req.body.email).trim().toLowerCase();
    const password = req.body.password;

    const admin = await Admin.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("email")),
        email
      ),
    });

    if (!admin) {
      return unauthorizedResponse("Invalid email or password", res);
    }

    if (admin.status !== 1) {
      return badRequestError(
        "Account is inactive. Please contact the super admin.",
        res
      );
    }

    const passwordValid = await verifyAdminPassword(password, admin.password);

    if (!passwordValid) {
      return unauthorizedResponse("Invalid email or password", res);
    }

    const token = signAdminToken(admin);

    return successResponse(
      {
        token,
        admin: formatAdminResponse(admin),
      },
      "Admin logged in successfully",
      res
    );
  } catch (error) {
    logger.error("adminLogin error:", error);
    return errorResponse(error, res);
  }
};

export { adminLoginHandler };
