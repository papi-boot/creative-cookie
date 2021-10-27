const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'
    ),
      await queryInterface.createTable("users", {
        user_id: {
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.literal("uuid_generate_v4()"),
          type: DataTypes.UUID,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        user_full_name: {
          allowNull: false,
          type: DataTypes.TEXT,
        },
        user_email: {
          allowNull: false,
          unique: true,
          type: DataTypes.STRING(100),
        },
        user_password: {
          allowNull: false,
          unique: true,
          type: DataTypes.TEXT,
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
