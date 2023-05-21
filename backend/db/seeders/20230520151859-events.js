'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Events';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        venueId: 1,
        name: "Test name for Event",
        type: "Online",
        startDate: "2023-06-01 07:00:00",
        endDate: "2023-07-01 07:00:00",
      },
      {
        groupId: 2,
        venueId: 2,
        name: "Group 2 / Venue 2 name",
        type: "Online",
        startDate: "2023-08-01 07:00:00",
        endDate: "2023-09-01 07:00:00",
      },
      {
        groupId: 3,
        venueId: 3,
        name: "Group 3 / Venue 3 name",
        type: "Online",
        startDate: "2023-09-01 07:00:00",
        endDate: "2023-10-01 07:00:00",
      },
      {
        groupId: 4,
        venueId: 4,
        name: "Group 4 / Venue 4 name",
        type: "Online",
        startDate: "2023-10-01 07:00:00",
        endDate: "2023-11-01 07:00:00",
      },
      {
        groupId: 5,
        venueId: 5,
        name: "Group 5 / Venue 5 name",
        type: "Online",
        startDate: "2023-11-01 07:00:00",
        endDate: "2023-12-01 07:00:00",
      },
    ], options);

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
