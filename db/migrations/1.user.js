"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'
    ),
      await queryInterface.createTable("users", {
        user_id: {
          allowNull: false,
          unique: true,
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: Sequelize.literal("uuid_generate_v4()"),
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        user_full_name: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        user_email: {
          type: DataTypes.STRING(200),
          allowNull: false,
          unique: true,
        },
        user_password: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        user_created_at: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        user_updated_at: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
