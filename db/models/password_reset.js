'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class password_reset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  password_reset.init({
    password_reset_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'password_reset',
  });
  return password_reset;
};