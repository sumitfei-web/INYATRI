import express from "express";
const router = express.Router();

import adminAuthRoute from "./auth.route.js";
import carBrandRoute from "./carBrand.route.js";
import carFeatureRoute from "./carFeature.route.js";
import stateRoute from "./state.route.js";
import carTypeRoute from "./carType.route.js";
import carRoute from "./car.route.js";

router.use("/auth", adminAuthRoute);
router.use("/car-brands", carBrandRoute);
router.use("/car-features", carFeatureRoute);
router.use("/states", stateRoute);
router.use("/car-types", carTypeRoute);
router.use("/cars", carRoute);

export default router;
