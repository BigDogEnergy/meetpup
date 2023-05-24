// backend/routes/api/groups.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Membership, Attendance, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateCreateGroup } = require('../../utils/validation');

const router = express.Router();



//POST a new group
router.post('/', requireAuth, validateCreateGroup, async (req, res, next) => {
    
    const { name, about, type, private, city, state } = req.body;

    const newGroup = await Group.create({
        // userId: req.user.id,
        name,
        about,
        type,
        private,
        city,
        state
    })
    res.status(201);
    res.json(newGroup)

} )


//GET all groups
router.get('/', async (req, res, next) => {
    let allGroups = await Group.findAll(
    //     {
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