const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Event, Attendance, Image, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateCreateVenue } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

//DELETE an attendance to an event specified by id.

router.delete('/:eventId/attendance', requireAuth, async (req, res, next) => {

    const { eventId } = req.params;
    const { userId } = req.body;

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
            userId: userId,
            eventId
        },
        attributes: ['id', 'eventId', 'userId', 'status']
    });

    if (!attendance) {
        const err = new Error("Attendance between the user and the event does not exist");
        err.status = 404;
        err.message = "Attendance between the user and the event does not exist";
        return next(err)
    };

    if (event.Group.Organizer.id === req.user.id || attendance.userId === req.user.id) {

        attendance.destroy();
    
        res.json({
            "message": "Successfully deleted attendance from event"
          });

    } else { 
        const err = new Error("Only the User or organizer may delete an Attendance");
        err.status = 403;
        err.message = "Only the User or organizer may delete an Attendance";
        return next(err)
    };

});

//PUT Change the status of an attendance for an event specified by id.

router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {

    const { eventId } = req.params;
    const { userId, status } = req.body;

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
        },
        attributes: ['id', 'eventId', 'userId', 'status']
    });

    if (!attendance) {
        const err = new Error("Attendance between the user and the event does not exist");
        err.status = 404;
        err.message = "Attendance between the user and the event does not exist";
        return next(err)
    };

    if (status === 'pending') {
        const err = new Error("Cannot change an attendance status to pending");
        err.status = 400;
        err.message = "Cannot change an attendance status to pending";
        return next(err)
    };

    const membership = await Membership.findOne({
        where: {
            groupId: event.groupId,
            userId: req.user.id,
            status: 'co-host'
        }
    });

    if (event.Group.Organizer.id === req.user.id || membership) {

        const confirmation = await attendance.update({
            eventId,
            userId,
            status
        });    

        const response = {
            id: confirmation.dataValues.id,
            eventId: confirmation.dataValues.eventId,
            userId: confirmation.dataValues.userId,
            status: confirmation.dataValues.status
        };
    
        res.json(response);

    } else { 
        const err = new Error("Forbidden");
        err.status = 403;
        err.message = "Forbidden";
        return next(err)
    };

});

//POST Request attendance for an event specified by id.

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

    const membership = await Membership.findOne({
        where: {
          groupId: event.groupId,
          userId: req.user.id,
          status: 'co-host'
        }
      });

    if (event.Group.Organizer.id === req.user.id || membership) {

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
        });
    
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
            response.push(attendee);
        };
    
        res.json({
            "Attendees": response
        });

    } else {

        const attendees = await User.scope("attendance").findAll({
            include: [{
                model: Event,
                as: "Attendances",
                where: {
                    id: eventId,
                },
                attributes: []
            }, { model: Attendance.scope("eventAttendees"), 
                    as: "Attendance",
                    where: {
                        status: {
                            [Op.ne]: 'pending'
                        }
                    }
                }]
        });
    
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
            response.push(attendee);
        };
    
        res.json({
            "Attendees": response
        });
    }
    

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

    const membership = await Membership.findOne({
        where: {
          groupId: event.groupId,
          userId: req.user.id,
          status: 'co-host'
        }
      });

    if (event.Group.Organizer.id === req.user.id || membership) {
 
        await event.destroy();
        
        res.json({
            "message": "Succesfully deleted"
        });


    } else {
        const err = new Error("Forbidden");
        err.status = 403;
        err.message = "Forbidden";
        return next(err)
    };

});

//POST Add an image to a event based on the event's id

router.post('/:eventId/images', async (req, res, next) => {

    const { eventId } = req.params;
    const { url, preview } = req.body;

    const event = await Event.findByPk(eventId, {
        include: {
            model: Group,
            attributes: ['organizerId']
        }
    });

    if (!event) {
        const err = new Error("Event couldn't be found");
        err.status = 404;
        err.message = "Event couldn't be found";
        return next(err)
    };

    const attendance = await Attendance.findOne({
        where: {
          eventId: eventId,
          userId: req.user.id,
          status: 'attending'
        }
      });
    
      const membership = await Membership.findOne({
        where: {
          groupId: event.groupId,
          userId: req.user.id,
          status: 'co-host'
        }
      });

    if (attendance || event.Group.organizerId === req.user.id || membership) {
        
        const upload = await Image.create({
            image: url,
            imageableId: eventId,
            imageableUser: req.user.id,
            imageableType: 'Event',
            preview: preview
        });

        res.json({
            id: upload.id,
            eventId: upload.imageableId,
            url: upload.image,
            preview: upload.preview
        });
    } else {
        const err = new Error("Forbidden");
        err.status = 403;
        err.message = "Forbidden";
        return next(err);
    };

});

//PUT edit an event based on eventId

router.put('/:eventId', async (req, res, next) => {

    const { eventId } = req.params;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const event = await Event.findByPk(eventId, {
        include: {
            model: Group,
            attributes: ['organizerId']
        }
    })
    const venue = await Venue.findByPk(venueId)

    const membership = await Membership.findOne({
        where: {
          groupId: event.groupId,
          userId: req.user.id,
          status: 'co-host'
        }
      });

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

    if (event.Group.organizerId === req.user.id || membership) {
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
    
        const response = {
            id: updatedEvent.id,
            groupId: event.groupId,
            venueId: updatedEvent.venueId,
            name: updatedEvent.name,
            capacity: updatedEvent.capacity,
            price: updatedEvent.price,
            description: updatedEvent.description,
            startDate: updatedEvent.startDate,
            endDate: updatedEvent.endDate
          };
    
        res.json(response);
    } else {
        const err = new Error("Forbidden");
        err.status = 403;
        err.message = "Forbidden";
        return next(err);
    }




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

    let eventImages = await Image.findAll({
        where: {
            imageableId: event.dataValues.id,
            imageableType: 'Event'
        }
    });

    let numAttending = await Attendance.count({
        where: {
            eventId: event.dataValues.id
        }
    });

    const imageObjects = eventImages.map(image => ({
        id: image.id,
        url: image.image,
        preview: image.preview,
      }));

    const eventDetails = {
        ...event.toJSON(),
        numAttending: numAttending,
        eventImages: imageObjects
      };
    
      res.json(eventDetails);

});

//GET Returns all the events.

router.get('/', async (req, res, next) => {
    const events = await Event.findAll({
      include: [
        { model: Group.scope('eventRoute') },
        { model: Venue.scope('eventRoute') }
      ],
      attributes: { exclude: ['startDate', 'endDate', 'createdAt', 'updatedAt', 'capacity', 'price'] }
    });
  
    for (let i = 0; i < events.length; i++) {
      let numAttending = await Attendance.count({
        where: {
          eventId: events[i].id
        }
      });
  
      let eventImage = await Image.findOne({
        where: {
          imageableId: events[i].id,
          imageableType: 'Event'
        }
      });
  
      events[i] = {
        ...events[i].toJSON()
      };

      if (eventImage) {
        events[i].numAttending = numAttending;
        events[i].previewImage = eventImage.image;
      } else {
        events[i].numAttending = numAttending;
        events[i].previewImage = null;
      }
    }
  
    res.json({ "Events": events });
  });
  
  
  

module.exports = router

