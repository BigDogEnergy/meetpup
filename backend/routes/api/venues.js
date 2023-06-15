// backend/routes/api/venues.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Event, Attendance, Image, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateCreateVenue } = require('../../utils/validation');

const router = express.Router();

router.put('/:venueId', requireAuth, validateCreateVenue, async (req, res, next) => {

    const { venueId } = req.params;
    const { address, city, state, lat, lng } = req.body;

    const venue = await Venue.findByPk(venueId, {
        include: {
            model: Group,
            attributes: ['organizerId']
        }
    });

    if (!venue) {
        const err = new Error("Venue couldn't be found")
        err.status = 404;
        err.message = "Venue couldn't be found";
        return next(err);
    };

    const membershipCheck = await Membership.findOne({
        where: {
            groupId: venue.groupId,
            userId: req.user.id,
            status: 'co-host'
        }
    });


    if (venue.Group.organizerId === req.user.id || membershipCheck) {

        const updatedVenue = await venue.update({
            groupId: venue.groupId,
            address,
            city,
            state,
            lat,
            lng
        });
    
        const final = {
            id: venueId,
            groupId: updatedVenue.groupId,
            address: updatedVenue.address,
            city: updatedVenue.city,
            state: updatedVenue.state,
            lat: updatedVenue.lat,
            lng: updatedVenue.lng
          };
    
        res.json(final);

    } else {
        const err = new Error("Forbidden");
        err.status = 403;
        err.message = "Forbidden";
        return next(err);
    }

});


module.exports = router