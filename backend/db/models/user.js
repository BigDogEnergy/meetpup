'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      User.belongsToMany(models.Group, {
        through: models.Membership,
        foreignKey: 'userId',
      });

      User.hasMany(models.Group, {
        foreignKey: 'organizerId'
      });

      User.hasMany(models.Membership, {
        foreignKey: 'userId',
        as: 'Membership'
      });

      User.belongsToMany(models.Event, {
        through: models.Attendance,
        foreignKey: 'userId',
        as: 'Attendances'
      });

      User.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'User'
        },
        as: 'Uploader'
      });

      User.hasMany(models.Attendance, {
        foreignKey: "userId",
        as: "Attendance"
      })


    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
      sequelize,
      timestamps: true,   
      modelName: 'User',
      scopes: {
        defaultScope: {
          attributes: {
            exclude: ["hashedPassword", "email", "createdAt", "updatedAt", "username"]
          }
        },
        organizer: {
          attributes: ['id', 'firstName', 'lastName']
        },
        userMembership: {
          attributes: ['id', 'firstName', 'lastName']
        },
        newUser: {
          attributes: ['id', 'firstName', 'lastName', 'username']          
        },
        attendance: {
          attributes: ['id', 'firstName', 'lastName']
        }
      }
    });
  return User;
};