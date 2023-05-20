'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Venues';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: "test",
        city: "test",
        state: "test",
        lat: 33.3333333,
        lng: 22.2222222,
      },
    ], options);

  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Venues', {
      id: {
        [Op.between]: [0, 100]
      }
    }, options)

  }
};
