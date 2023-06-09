'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}
options.tableName = 'Users'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
     
    
     
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true,
      },
      hashedPassword: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    },  options);

    // await queryInterface.addIndex('Users', ['username']);
    // await queryInterface.addIndex('Users', ['email']);

  },

  async down(queryInterface, Sequelize) {
  
  // await queryInterface.removeIndex('Users', ['username']);
  // await queryInterface.removeIndex('Users', ['email']);

  await queryInterface.dropTable('Users', options);
    
  }
};
