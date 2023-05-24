// backend/routes/api/groups.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Membership, Attendance, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateCreateGroup } = require('../../utils/validation');

const router = express.Router();



//GET all Groups joined or organized by the Current User
router.get('/current', requireAuth, async (req, res, next) => {

    const userGroups = await Group.findAll({
        where: {
            organizerId: req.user.id
        }
    });

    const userMemberships = await Group.findAll({
        include: {
            model: Membership,
            as: "groupMemberIds",
            where: {
                userId: req.user.id
            }
        }
    });

    const aggregatedData = [...userGroups, ...userMemberships]

    for (let i=0; i < aggregatedData.length; i++) {
        
        let numMembers = await Membership.count({
            where: {
                groupId: aggregatedData[i].id
            }
        });
        
        let previewImage = await Image.findOne({
            where: {
              imageableType: 'Group',
              imageableId: aggregatedData[i].id
            }
        })
        
        aggregatedData[i].dataValues.numMembers = numMembers +1;
    
        if (previewImage) {
            aggregatedData[i].dataValues.previewImage = previewImage.dataValues.image
        } else {
            aggregatedData[i].dataValues.previewImage = null;
        }

    }


    res.json( { Groups: aggregatedData} )

})


//GET details of a Group from an id

router.get('/:groupId', async (req, res, next) => {

    const { groupId } = req.params

    const group = await Group.findOne({
        where: {
            id: groupId
        },
        include: [
            { model: User.scope('organizer'), as: "Organizer" },
            { model: Image,
               as: 'groupImages',
               where: {
                  imageableId: groupId,
                  imageableType: 'Group',
                      },
                      attributes: ['id', ['image', 'url'], 'preview']
            },
            { model: Venue,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
                ],

    })

    res.json(group)

})

//POST a new group
router.post('/', requireAuth, validateCreateGroup, async (req, res, next) => {
    
    const { name, about, type, private, city, state } = req.body;

    const newGroup = await Group.create({
        organizerId: req.user.id,
        name,
        about,
        type,
        private,
        city,
        state
    })

    const createdGroup = await Group.findByPk(newGroup.id, {
        attributes: {
            exclude: ['id', 'organizerId', 'updatedAt', 'createdAt']
        }
    });

    res.status(201);
    res.json(createdGroup)

})


//GET all groups
router.get('/', async (req, res, next) => {
    let allGroups = await Group.findAll(
    //    
    // --Eager Loading attempted but postgreSQL did not work with it
    // {
    //     include: [
    //         {
    //         model: User,
    //         as: 'organizerId',
    //         attributes: ['id'],
    //         },
    //         {
    //         model: Image,
    //         as: 'previewImage',
    //         where: {
    //           imageableType: 'Group',
    //         },
    //         attributes: ['image'],
    //         },
    //     ]
    // }
    );

    for (let i = 0; i < allGroups.length; i++) {
        let numMembers = await Membership.count({
            where: {
                groupId: allGroups[i].dataValues.id
            }
        });

        let previewImage = await Image.findOne({
            where: {
              imageableType: 'Group',
              imageableId: allGroups[i].dataValues.id
            },
    })

        allGroups[i].dataValues.numMembers = numMembers;
    
        if (previewImage) {
            allGroups[i].dataValues.previewImage = previewImage.dataValues.image
        } else {
            allGroups[i].dataValues.previewImage = null;
        }
    
    }


    res.json({
        "Groups": allGroups
    });
});


module.exports = router;