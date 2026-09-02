/**
 * TODO (Database Migrations):
 * Currently schema changes are managed via Sequelize models.
 * Before production deployments, recommend adopting migration-based schema management (e.g. Sequelize CLI migrations)
 * for reliable and reproducible database schema evolutions.
 */
import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

// Database configuration
const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'mysql',
  dialectModule: mysql2,
  logging: process.env.NODE_ENV === 'localhost' ? console.log : false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  dialectOptions: {
    charset: 'utf8mb4',
  },
};

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

export { sequelize, config };