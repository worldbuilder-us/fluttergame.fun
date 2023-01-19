'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Score.init({
    play_id: DataTypes.STRING,
    playerId: DataTypes.STRING,
    leaderboardId: DataTypes.STRING,
    result: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Score',
  });
  return Score;
};
