"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("notifications", {
      notif_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      notif_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      notif_is_open: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      notif_post_ref: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "posts",
          key: "post_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      notif_user_ref: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      notif_created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      notif_updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("notifications");
  },
};
