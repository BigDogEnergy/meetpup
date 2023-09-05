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
        capacity: 5,
        price: 1,
        name: "Test name for Event 1",
        type: "Online",
        description: "This is Event 1's description",
        startDate: "2023-09-01 07:00:00",
        endDate: "2023-09-01 08:00:00",
      },
      {
        groupId: 1,
        venueId: 2,
        capacity: 2,
        price: 2,
        name: "Test Event 2",
        type: "Online",
        description: "This is Event 2's description",
        startDate: "2023-08-01 04:00:00",
        endDate: "2023-08-01 09:00:00",
      },
      {
        groupId: 1,
        venueId: 3,
        capacity: 3,
        price: 3,
        name: "Test Event 3",
        type: "Online",
        description: "This is Event 3's description",
        startDate: "2023-09-01 07:00:00",
        endDate: "2023-09-02 07:00:00",
      },
      {
        groupId: 1,
        venueId: 4,
        capacity: 4,
        price: 4,
        name: "Test Event 4",
        type: "Online",
        description: "This is Event 4's description",
        startDate: "2023-10-01 07:00:00",
        endDate: "2023-10-01 10:00:00",
      },
      {
        groupId: 1,
        venueId: 5,
        capacity: 5,
        price: 5,
        name: "Test Event 5",
        type: "Online",
        description: "This is Event 5's description",
        startDate: "2023-12-01 07:00:00",
        endDate: "2023-12-01 08:00:00",
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
