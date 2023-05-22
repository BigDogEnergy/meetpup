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
        status: "waitlist",
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
