"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("comments", {
      comment_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      comment_post_ref: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "posts",
          key: "post_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      comment_user_ref: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      comment_content: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      comment_created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      comment_updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("comments");
  },
};
