'use strict';

const bcrypt = require("bcryptjs");

let options = {};
options.tableName = 'Users';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    return queryInterface.bulkInsert(options, [
      {
        email: 'eztest@user.io',
        username: 'Test',
        firstName: 'First',
        lastName: 'Test',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName: 'Second',
        lastName: 'Experiment',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'Third',
        lastName: 'Variable',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        firstName: 'Fourth',
        lastName: 'Datapoint',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'user4@user.io',
        username: 'FakeUser4',
        firstName: 'Fifth',
        lastName: 'Necessity',
        hashedPassword: bcrypt.hashSync('password5')
      },
    ], options);
  },

  async down (queryInterface, Sequelize) {
    
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Demo', 'FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4'] }
    }, options);
  }
};
