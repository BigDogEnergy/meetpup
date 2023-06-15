'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Groups';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    
  return queryInterface.bulkInsert(options, [
  {
    organizerId: 1,
    name: "Beau's Assisstants",
    about: "This is the first test group",
    type: "In person",
    private: true,
    city: "San Diego",
    state: "California",
  },
  {
    organizerId: 2,
    name: "Puppy Helper Patrol",
    about: "Something something.",
    type: "In person",
    private: false,
    city: "San Diego",
    state: "California",
  },
  {
    organizerId: 3,
    name: "Dog Park Pupper Posse",
    about: "The not-so-secret dog park happy-hour gang",
    type: "In person",
    private: false,
    city: "San Diego",
    state: "California",
  },
  {
    organizerId: 1,
    name: "Demo Group",
    about: "Dogtor Beau's personal group",
    type: "In person",
    private: true,
    city: "San Diego",
    state: "California",
  },
  {
    organizerId: 1,
    name: "The Runners",
    about: "For people and dogs that are trained to run away from our exestential...",
    type: "In person",
    private: false,
    city: "San Diego",
    state: "California",
  },
], options);
},

  async down (queryInterface, Sequelize) {
    
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Groups', {
      id: {
        [Op.between]: [0, 1000]
      }
    }, options)

  }
};
