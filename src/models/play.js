'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Play extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Play.init({
    guid: DataTypes.STRING,
    gameId: DataTypes.STRING,
    playerId: DataTypes.STRING,
    leaderboardId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Play',
  });
  return Play;
};