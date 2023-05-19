'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Membership.belongsTo(models.User, {
        foreignKey: "userId",
      });

      Membership.belongsTo(models.Group, {
        foreignKey: "groupId",
      });

    }
  }
  Membership.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groupId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM({
        values: ["member", "pending", "co-host"]
      })
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};