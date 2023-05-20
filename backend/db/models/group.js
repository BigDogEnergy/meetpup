'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {

      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: "groupId"
      });

      Group.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Group'
        }
      });

      Group.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      });
    
      Group.hasMany(models.Membership, {
        foreignKey: 'groupId',
      });

    };

      

  }

  Group.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
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
      type: DataTypes.STRING,
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
    previewImage: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Group',
  });

  return Group;
};
