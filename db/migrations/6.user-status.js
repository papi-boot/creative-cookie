"use strict";
const { DataTypes, QueryTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_status", {
      status_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status_user_ref: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status_is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      status_socket_id: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      status_created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      status_updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_status");
  },
};
