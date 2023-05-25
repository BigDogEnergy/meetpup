const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Event, Attendance, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateCreateVenue } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {

    const events = await Event.findall({
        include: {
            model: Group.scope('eventRoute')
        }
    })

})

module.exports = router

