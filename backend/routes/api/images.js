const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Event, Attendance, Image, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { Op } = require('sequelize')
const { handleValidationErrors, validateCreateVenue } = require('../../utils/validation');

const router = express.Router();

//DELETE Group image by imageId

router.delete('/group-images/:imageId', requireAuth, async (req, res, next) => {

    const { imageId } = req.params;

    const image = await Image.findOne({
        where: {
            imageableId: imageId,
            imageableType: 'Group'
        }
    });

    if (!image) {
        const err = new Error("Group Image couldn't be found");
        err.status = 404;
        err.message = "Group Image couldn't be found"
        return next(err)
    };

    const group = await Group.findOne({
        where: {
          organizerId: req.user.id,
          id: image.dataValues.imageableUser
        }
    });

    const membership = await Membership.findOne({
        where: {
            userId: req.user.id,
            status: 'co-host'
        }
    });

    if (group || membership) {

        await image.destroy();

            res.status(200);
            res.json( {
                "Message": "Successfully deleted"
        });

    } else {

        res.status(403)
        res.json(    {
            "message": "Forbidden"
          })

    };

});


//DELETE Event image by imageId

router.delete('/event-images/:imageId', requireAuth, async (req, res, next) => {

    const { imageId } = req.params;

    const image = await Image.findOne({
        where: {
            imageableType: 'Event',
            id: imageId
        }
    });

    if (!image) {
        const err = new Error("Event Image couldn't be found");
        err.status = 404;
        err.message = "Event Image couldn't be found"
        return next(err)
    };

    // console.log(image)

    const event = await Event.findOne({
        where: {
            id: image.dataValues.imageableId,
        },
        include: [
            {
                model: Group,
                as: 'Group',
            }
        ]
    });


    const membership = await Membership.findOne({
        where: {
            groupId: event.Group.id,
            userId: req.user.id,
            status: 'co-host'
        }
    });

    if (event.Group.organizerId === req.user.id || membership) {

        await image.destroy();

        res.status(200);
        res.json( {
            "Message": "Successfully deleted"
        });

    } else {

    const err = new Error("Forbidden");
    err.status = 403;
    err.message = "Forbidden";
    return next(err);
    }

});


module.exports = router;