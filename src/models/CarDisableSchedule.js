import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const CarDisableSchedule = sequelize.define(
  "CarDisableSchedule",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    car_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    disable_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    disable_to: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    disable_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "car_disable_schedules",
    freezeTableName: true,
    timestamps: false,
  }
);

export default CarDisableSchedule;
