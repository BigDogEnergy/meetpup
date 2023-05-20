'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Memberships';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        userId: 1,
        status: 'member'   
      },
      // {
      //   groupId: 2,
      //   userId: 1,
      //   status: 'member'   
      // },
      // {
      //   groupId: 3,
      //   userId: 1,
      //   status: 'member'   
      // },
    ], options);
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Memberships', null, options);

  }
};
