// backend/routes/api/groups.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Membership, Attendance, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateCreateGroup, validateCreateVenue } = require('../../utils/validation');

const router = express.Router();

//GET All Venues for a Group specified by its id

router.get('/:groupId/venues', requireAuth, async (req, res, next) => {

    const { groupId } = req.params;
    
    const venues = await Venue.findAll({
        where: {
            groupId: groupId
        },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    })

    if (!venues.length) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found";
        return next(err);
    }

    res.json({
        Venues: venues
    })

})

//POST Create a new Venue for a Group specified by its id

router.post('/:groupId/venues', requireAuth, validateCreateVenue, async (req, res, next) => {

    const { groupId } = req.params;
    const { address, city, state, lat, lng } = req.body;

    const group = await Group.findOne({
        where: {
            id: groupId
        },
    })

    if (!group.length) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found";
        return next(err);
    }

    if (group.organizerId != req.user.id) {
        const err = new Error("Action could not be performed");
        err.status = 401
        err.message = "Action could not be performed"
        return next(err);
    }

    const venue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat: parseFloat(lat),
        lng: parseFloat(lng)
    })

    const final = {};
    final.id = venue.dataValues.id;
    final.groupId = venue.dataValues.groupId;
    final.address = venue.dataValues.address;
    final.city = venue.dataValues.city;
    final.state = venue.dataValues.state;
    final.lat = venue.dataValues.lat;
    final.lng = venue.dataValues.lng;


    res.json(final)

})

//POST an image to a group based on the group's id

router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    
    const { groupId } = req.params;
    const { url, preview } = req.body;
    

    const group = await Group.scope('searchScope').findOne({
        where: {
            id: groupId
        }
    })

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found";
        return next(err);
    } 

    if (group.organizerId != req.user.id) {
        const err = new Error("Action could not be performed");
        err.status = 401
        err.message = "Action could not be performed"
        return next(err);
    }

    const upload = await Image.create({
        image: url,
        imageableId: groupId,
        imageableType: 'Group',
        preview: preview
    })

    res.json({
        id: upload.id,
        url: upload.image,
        preview: upload.preview
    })

})

//DELETE groups by groupId

router.delete('/:groupId', requireAuth, async (req, res, next) => {

    const { groupId } = req.params;

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })

    if (!group) {
        const err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found";
        return next(err);
    }

    if (group.organizerId != req.user.id) {
        const err = new Error("Action could not be performed");
        err.status = 401
        err.message = "Action could not be performed"
        return next(err);
    }  

    await group.destroy();

    res.json( {
        "message": "Successfully deleted"
    })

}

)



//PUT updates and returns an existing group.
router.put('/:groupId', requireAuth, validateCreateGroup, async (req, res, next) => {

    const { name, about, type, private, city, state } = req.body;

    const { groupId } = req.params;

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })

    if (!group) {
        const err = new Error("Group couldn't be ground");
        err.status = 404;
        err.message = "Group couldn't be ground";
        return next(err);
    }

    if (group.organizerId != req.user.id) {
        const err = new Error("Action could not be performed");
        err.status = 401
        err.message = "Action could not be performed"
        return next(err);
    }

    const updates = await group.update({
        name,
        about,
        type,
        private,
        city,
        state
    })

    res.json({
        id: group.id,
        organizerId: group.organizerId,
        name: updates.name,
        about: updates.about,
        type: updates.type,
        private: updates.private,
        city: updates.city,
        state: updates.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt

    })

})


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
               as: 'GroupImages',
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

    if (!group) {
        const err = new Error("No group found");
        err.status = 404;
        err.message = "No group found";
        return next(err);
    }

    let numMembers = await Membership.count({
        where: {
            groupId: groupId
        }
    })

    group.dataValues.numMembers = numMembers;



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

    const createdGroup = await Group.findByPk(newGroup.id);

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