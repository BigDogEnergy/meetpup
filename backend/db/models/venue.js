'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     
      Venue.belongsTo(models.Group, {
        foreignKey: "groupId"
      });

      Venue.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Venue'
        }
      })

    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.DECIMAL(9, 7),
      allowNull: false
    },
    lng: DataTypes.DECIMAL(10, 7),
    allowNull: false
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};