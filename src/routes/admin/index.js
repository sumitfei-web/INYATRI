import express from "express";
const router = express.Router();
import adminAuthRoute from "./auth.route.js";

router.use("/auth", adminAuthRoute);

export default router;
