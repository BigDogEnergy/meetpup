'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      // Image.belongsTo(models.User, {
      //   foreignKey: 'imageableId',
      //   constraints: false,
      // });

      Image.belongsTo(models.Group, {
        foreignKey: 'imageableId',
        constraints: false,
        as: 'previewImage'
      });

      Image.belongsTo(models.Venue, {
        foreignKey: 'imageableId',
        constraints: false,
      });

      Image.belongsTo(models.Event, {
        foreignKey: 'imageableId',
        constraints: false,
      });

    }
  }
  Image.init({
    image: {
      allowNull: false,
      type: DataTypes.STRING
    },
    imageableId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    imageableType: {
      allowNull: false,
      type: DataTypes.ENUM({
        values: ['User', 'Event', 'Group', 'Venue']
      })},
      preview: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};