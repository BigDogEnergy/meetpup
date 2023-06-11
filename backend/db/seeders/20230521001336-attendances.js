'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Attendances';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        userId: 1,
        status: "attending",
      },
      {
        eventId: 1,
        userId: 2,
        status: "pending",
      },
      {
        eventId: 1,
        userId: 3,
        status: "pending",
      },
      {
        eventId: 1,
        userId: 4,
        status: "waitlist",
      },
      {
        eventId: 1,
        userId: 5,
        status: "waitlist",
      },
      {
        eventId: 2,
        userId: 1,
        status: "attending",
      },
      {
        eventId: 3,
        userId: 1,
        status: "attending",
      },
      {
        eventId: 4,
        userId: 1,
        status: "attending",
      },
      {
        eventId: 5,
        userId: 1,
        status: "waitlist",
      },
      {
        eventId: 5,
        userId: 2,
        status: "waitlist",
      },
      {
        eventId: 5,
        userId: 3,
        status: "waitlist",
      },
      {
        eventId: 5,
        userId: 4,
        status: "attending",
      },

    ], options);


  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Attendances', {
      id: {
        [Op.between]: [0, 100]
      }
    }, options)

  }
};
