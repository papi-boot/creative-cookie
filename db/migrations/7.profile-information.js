"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("profile_informations", {
      prof_info_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      prof_info_user_ref: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "CASCADE",
        OnUpdate: "CASCADE",
      },
      prof_info_image_link: {
        allowNull: true,
        defaultValue: "",
        type: DataTypes.TEXT,
      },
      prof_info_about_me: {
        allowNull: true,
        defaultValue: "",
        type: DataTypes.TEXT,
      },
      prof_info_social_link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profile_info_created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      profile_info_updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("profile_informations");
  },
};
