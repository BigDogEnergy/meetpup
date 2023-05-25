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
      {
        image: 'https://cdn.pixabay.com/photo/2015/03/14/05/14/boerboel-672749_1280.jpg',
        imageableId: 1,
        imageableType: 'Event'
      },
      {
        image: 'https://cdn.pixabay.com/photo/2020/10/03/11/08/girl-5623231_1280.jpg',
        imageableId: 2,
        imageableType: 'Event'
      },
      {
        image: 'https://cdn.pixabay.com/photo/2019/07/23/13/51/shepherd-dog-4357790_1280.jpg',
        imageableId: 3,
        imageableType: 'Event'
      },
      {
        image: 'https://cdn.pixabay.com/photo/2018/09/16/07/13/three-generations-of-service-dogs-3680824_1280.jpg',
        imageableId: 4,
        imageableType: 'Event'
      },
      {
        image: 'https://cdn.pixabay.com/photo/2021/01/17/07/35/dog-5924174_1280.jpg',
        imageableId: 5,
        imageableType: 'Event'
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
