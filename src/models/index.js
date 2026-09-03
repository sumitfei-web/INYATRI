import { sequelize } from "../config/dbConfig.js";
import User from "./User.js";
import Admin from "./Admin.js";
import CarBrand from "./CarBrand.js";
import CarFeature from "./CarFeature.js";
import State from "./State.js";
import City from "./City.js";
import CarType from "./CarType.js";
import Car from "./Car.js";
import CarAdditionalImage from "./CarAdditionalImage.js";
import CarFeatureMap from "./CarFeatureMap.js";

Car.belongsTo(CarBrand, { foreignKey: "brand_id", as: "brand" });
CarBrand.hasMany(Car, { foreignKey: "brand_id", as: "cars" });

Car.belongsTo(City, { foreignKey: "city_id", as: "city" });
City.hasMany(Car, { foreignKey: "city_id", as: "cars" });

Car.belongsTo(CarType, { foreignKey: "car_type_id", as: "carType" });
CarType.hasMany(Car, { foreignKey: "car_type_id", as: "cars" });

Car.belongsToMany(CarFeature, {
  through: CarFeatureMap,
  foreignKey: "car_id",
  otherKey: "feature_id",
  as: "features",
});
CarFeature.belongsToMany(Car, {
  through: CarFeatureMap,
  foreignKey: "feature_id",
  otherKey: "car_id",
  as: "cars",
});

Car.hasMany(CarAdditionalImage, {
  foreignKey: "car_id",
  as: "additionalImages",
});
CarAdditionalImage.belongsTo(Car, { foreignKey: "car_id", as: "car" });

export {
  sequelize,
  User,
  Admin,
  CarBrand,
  CarFeature,
  State,
  City,
  CarType,
  Car,
  CarAdditionalImage,
  CarFeatureMap,
};
