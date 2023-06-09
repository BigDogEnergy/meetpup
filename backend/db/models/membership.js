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
        key: 'id',
        as: "Membership"
      });

      // Membership.belongsTo(models.Group, {
      //   foreignKey: "groupId",
      //   key: 'id'
      // });

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
    },
  }, {
    sequelize,
    modelName: 'Membership',
    scopes: {
      userMembership: {
        attributes: ['status']
      },
      joinRequest: {
        attributes: [['userId', 'memberId'], 'groupId', 'status']
      },
    }
  });
  return Membership;
};