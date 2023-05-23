// backend/routes/api/groups.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Event, Venue, Membership, Attendance, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//GET all groups
router.get('/', async (req, res, next) => {
    let allGroups = await Group.findAll({
        include: {
            model: User,
            as: 'Organizer',
            attributes: ['id']
        }
    });

    for (let i = 0; i < allGroups.length; i++) {
        let numMembers = await Membership.count({
            where: {
                groupId: allGroups[i].dataValues.id
            }
        });
    }

    allGroups[i].dataValues.numMembers = numMembers

    res.json({
        "Groups": allGroups
    })
});

module.exports = router;