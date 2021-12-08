"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("password_resets", {
      password_reset_id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      password_reset_email_ref: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true,
      },
      password_reset_expiration_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      password_reset_created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      password_reset_updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("password_resets");
  },
};
