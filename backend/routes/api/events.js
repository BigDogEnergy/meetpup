const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Event, Attendance, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateCreateVenue } = require('../../utils/validation');

const router = express.Router();


//GET Returns the details of an event specified by its id

router.get('/:eventId', async (req, res, next) => {

    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
        include: [
            {   model: Group.scope('eventRoute')    },
            {   model: Venue.scope('eventRoute')    }
        ],
    })

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        err.message = "Event couldn't be found";
        return next(err)
    }



    res.json(event)

});

//GET Returns all the events.

router.get('/', async (req, res, next) => {

    const events = await Event.findAll({
        include: [
            {   model: Group.scope('eventRoute')    },
            {   model: Venue.scope('eventRoute')    }
        ],
        attributes: { exclude: ['capacity', 'price'] }
    })

    for (let i=0; i < events.length; i++) {
        let numAttending = await Attendance.count({
            where: {
                eventId: events[i].dataValues.id
            }
        });

        events[i].dataValues.numAttending = numAttending;

        let previewImage = await Image.findOne({
            where: {
                imageableId: events[i].dataValues.id,
                imageableType: 'Event'
            }
        })

        if (previewImage) {
            events[i].dataValues.previewImage = previewImage.url;
        } else {
            events[i].dataValues.previewImage = null;
        }


    }

    res.json(   {  "Events": events  }   )

});

module.exports = router

