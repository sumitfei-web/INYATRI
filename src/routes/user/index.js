import express from "express";
const router = express.Router();
import userAuthRoute from "./auth.route.js";

router.use("/auth", userAuthRoute);

export default router;
