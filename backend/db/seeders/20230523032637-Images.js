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
       {
        image: 'https://cdn.pixabay.com/photo/2019/08/19/07/45/corgi-4415649_1280.jpg',
        imageableId: 2,
        imageableType: 'Group'
      },
      {
        image: 'https://cdn.pixabay.com/photo/2023/04/15/17/08/bernese-mountain-dog-7928156_1280.jpg',
        imageableId: 3,
        imageableType: 'Group'
      },
      {
        image: 'https://cdn.pixabay.com/photo/2020/11/24/17/54/dog-5773397_1280.jpg',
        imageableId: 4,
        imageableType: 'Group'
      },
      {
        image: 'https://cdn.pixabay.com/photo/2019/03/27/15/24/animal-4085255_1280.jpg',
        imageableId: 5,
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
