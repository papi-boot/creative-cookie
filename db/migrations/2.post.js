"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("posts", {
      post_id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        type: DataTypes.UUID,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      post_created_by: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      post_content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      post_tag: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      post_created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      post_updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("posts");
  },
};
