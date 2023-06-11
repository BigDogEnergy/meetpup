'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {

    static associate(models) {
      Attendance.belongsTo(models.User, {
        foreignKey: "userId",
        as: "Attendance"
      });
    }

  }
  
  Attendance.init({
    eventId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    status: DataTypes.ENUM({
      values: ['pending', 'member', 'waitlist', 'attending']
    })
  }, {
    sequelize,
    modelName: 'Attendance',
    scopes: {
      eventAttendees: {
        attributes: ['status']
      }
    }
  });
  return Attendance;
};