// backend/routes/api/venues.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Event, Attendance, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateCreateVenue } = require('../../utils/validation');

const router = express.Router();

router.put('/:venueId', requireAuth, validateCreateVenue, async (req, res, next) => {

    const { venueId } = req.params;
    const { address, city, state, lat, lng } = req.body;

    const venue = await Venue.findByPk(venueId);

    if (!venue) {
        const err = new Error("Venue couldn't be found")
        err.status = 404;
        err.message = "Venue couldn't be found";
        return next(err);
    }


    const update = await venue.update({
        groupId: venue.groupId,
        address,
        city,
        state,
        lat,
        lng
    })



    const final = {};
    final.id = venueId
    final.groupId = update.groupId;
    final.address = update.address;
    final.city = update.city;
    final.state = update.state;
    final.lat = update.lat;
    final.lng = update.lng;

    res.json(final)    

})


module.exports = router