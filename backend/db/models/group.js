'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {

      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: 'groupId'
      });

      Group.hasMany(models.Membership, {
        foreignKey: 'groupId',
        as: 'groupMemberIds'
      });

      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',
        allowNull: false,
        as: "Organizer"
      });

      Group.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Group'
        },
        as: 'GroupImages'
      });
    
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      });
    
      Group.hasMany(models.Event, {
        foreignKey: 'groupId'
      })

    };

      

  }

  Group.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    organizerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM({
        values: ["In person", "Online"]
      }),
      allowNull: false,
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Group',
    scopes: {
      defaultScope: {
        attributes: {
          exclude: ["organizerId"]
        }
      },
      searchScope: {}, 
      eventRoute: {
        attributes: ['id', 'name', 'private', 'city', 'state']
      },
      eventIdRoute: {
        attributes: ['id', 'name', 'city', 'state']
      },
    }
  });

  return Group;
};
