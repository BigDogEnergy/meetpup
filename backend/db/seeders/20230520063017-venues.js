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
        address: "test address",
        city: "test city",
        state: "test state",
        lat: 33.3333333,
        lng: 22.2222222,
      },
      {
        groupId: 2,
        address: "Happy Nuclear Family Ln",
        city: "Fake City",
        state: "Fake State",
        lat: 77.7777777,
        lng: 17.7777777,
      },
      {
        groupId: 3,
        address: "Sad Day Way",
        city: "Fake City 2",
        state: "Fake State 2",
        lat: 33.4444444,
        lng: 22.8888888,
      },
      {
        groupId: 4,
        address: "1998 28th St",
        city: "San Diego",
        state: "CA",
        lat: 66.6666666,
        lng: 55.5555555,
      },
      {
        groupId: 5,
        address: "2245 Midvale Dr",
        city: "San Diego",
        state: "CA",
        lat: 32.1234567,
        lng: 23.7654321,
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
