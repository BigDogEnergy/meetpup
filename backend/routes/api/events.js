const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Event, Attendance, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateCreateVenue } = require('../../utils/validation');

const router = express.Router();

router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {


    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
        include: [{
            model: Group,
            as: 'Group',
            
            include: [{
                model: User,
                as: 'Organizer',
                attributes: ['id']
            }]
        }]
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        err.message = "Event couldn't be found";
        return next(err)
    };

    const attendance = await Attendance.findOne({
        where: {
            userId: req.user.id,
            eventId
        }
    });

    if (attendance) {
        const statusCheck = attendance.dataValues.status;

        if (statusCheck === 'pending') {
            const err = new Error("Attendance has already been requested");
            err.status = 400;
            err.message = "Attendance has already been requested";
            return next(err)
        };

        if (statusCheck === 'member') {
            const err = new Error("User is already an attendee of the event");
            err.status = 400;
            err.message = "User is already an attendee of the event";
            return next(err)
        };
    };

    const request = await Attendance.create({
        eventId,
        userId: req.user.id,
        status: "pending"
    });

    res.json({
        userId: request.userId,
        status: request.status
    });

});

//GET all attendees for an Event based on eventId

router.get('/:eventId/attendees', async (req, res, next) => {

    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
        include: [{
            model: Group,
            as: 'Group',
            
            include: [{
                model: User,
                as: 'Organizer',
                attributes: ['id']
            }]
        }]
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        err.message = "Event couldn't be found";
        return next(err)
    };

    const attendees = await User.scope("attendance").findAll({
        include: [{
            model: Event,
            as: "Attendances",
            where: {
                id: eventId,
            },
            attributes: []
        }, { model: Attendance.scope("eventAttendees"), as: "Attendance"
        }]
    })

    const response = []

    for (let i=0; i < attendees.length; i++) {
        const attendee = {
            id: attendees[i].id,
            firstName: attendees[i].firstName,
            lastName: attendees[i].lastName,
            Attendance: {
                "status": attendees[i].Attendance[0].dataValues.status
            }
        };
        response.push(attendee)
    };

    res.json({
        "Attendees": response
    })

});


//DELETE event by eventId

router.delete('/:eventId', requireAuth, async (req, res, next) => {
    
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
        include: [{
            model: Group,
            as: 'Group',
            
            include: [{
                model: User,
                as: 'Organizer',
                attributes: ['id']
            }]
        }]
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        err.message = "Event couldn't be found";
        return next(err)
    };

    if (event.Group.Organizer.id !== req.user.id) {
        const err = new Error("Forbidden");
        err.status = 403;
        err.message = "Forbidden";
        return next(err)
    };

    event.destroy();

    res.json({
        "message": "Succesfully deleted"
    });

});

//POST Add an image to a event based on the event's id

router.post('/:eventId/images', async (req, res, next) => {

    const { eventId } = req.params;
    const { url, preview } = req.body;

    const event = await Event.findByPk(eventId);

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        err.message = "Event couldn't be found";
        return next(err)
    };

    const upload = await Image.create({
        image: url,
        imageableId: eventId,
        imageableType: 'Event',
        preview: preview
    });
    
    res.json({
    id: upload.id,
    url: upload.image,
    preview: upload.preview
    });

});

router.put('/:eventId', async (req, res, next) => {

    const { eventId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const event = await Event.findByPk(eventId)
    const venue = await Venue.findByPk(venueId)

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        err.message = "Event couldn't be found";
        return next(err)
    };

    if (!venue) {
        const err = new Error("Venue couldn't be found")
        err.status = 404;
        err.message = "Venue couldn't be found";
        return next(err);
    };

    const updatedEvent = await event.update({
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

    const response = {};
    response.id = updatedEvent.id
    response.groupId = event.groupId
    response.venueId = updatedEvent.venueId
    response.name = updatedEvent.name
    response.capacity = updatedEvent.capacity
    response.price = updatedEvent.price
    response.description = updatedEvent.description
    response.startDate = updatedEvent.startDate
    response.endDate = updatedEvent.endDate

    res.json(response)

});


//GET Returns the details of an event specified by its id

router.get('/:eventId', async (req, res, next) => {

    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
        include: [
            {   model: Group.scope('eventRoute')    },
            {   model: Venue.scope('eventRoute')    }
        ],
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        err.message = "Event couldn't be found";
        return next(err)
    };



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

