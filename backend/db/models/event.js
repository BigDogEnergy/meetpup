'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Event.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Event'
        }
      });
      
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId',
        allowNull: true
      });

      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: "eventId"
      });

      Event.belongsTo(models.Group, {
        foreignKey: "groupId"
      });

    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 50]
      }
    },
    type: {
      type: DataTypes.ENUM({
        values: ['Online', 'In person']
      }),
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterToday(value) {
          if (value < new Date()) {
            throw new Error('Start date cannot be before today.');
          }
        },
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStartDate(value) {
          if (value && value < this.startDate) {
            throw new Error('End date cannot be before start date.');
          }
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};