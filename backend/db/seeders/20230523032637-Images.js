'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Images';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert(options, [
      {
        image: 'https://cdn.pixabay.com/photo/2016/10/15/12/01/dog-1742295_640.jpg',
        imageableId: 1,
        imageableType: 'Group'
       },
    ], options);


  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Images', {
      id: {
        [Op.between]: [0, 100]
      }
    }, options)

  }
};
