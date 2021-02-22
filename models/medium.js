'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medium extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.media.belongsToMany(models.category, {through: 'categoriesMedias'});
      models.medium.belongsToMany(models.category, {through: "categoriesMedia"});
      // models.category.belongsToMany(models.media, { through: "categoriesMedias"});
    }
  };
  medium.init({
    mediaName: DataTypes.STRING,
    mediaUrl: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'medium',
  });
  return medium;
};