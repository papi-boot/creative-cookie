"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("post_like_records", {
      plr_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      plr_post_ref: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "posts",
          key: "post_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      plr_user_ref: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      plr_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      plr_created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      plr_updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("post_like_records");
  },
};
