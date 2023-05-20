'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Events';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {

    // return queryInterface.bulkInsert(options, [
    //   {
    //     groupId: 1,
    //     venueId: 1,
    //     name: "Test name for Event",
    //     type: "Online",
    //     startDate: "2023-06-01 07:00:00",
    //     endDate: "2023-07-01 07:00:00",
    //   },
    // ], options);

  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Events', {
      id: {
        [Op.between]: [0, 100]
      }
    }, options)

  }
};
