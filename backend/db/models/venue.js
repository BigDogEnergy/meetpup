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
        allowNull: true,
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
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING(256)
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING(256)
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING(256)
    },
    lat: {
      type: DataTypes.DECIMAL(9, 7),
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7)
    },
  }, {
    sequelize,
    modelName: 'Venue',
    scopes: {
      allStandard: {
        attribtues: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
      }
    }
  });
  return Venue;
};