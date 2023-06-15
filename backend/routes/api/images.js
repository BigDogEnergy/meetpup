const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Group, Venue, Event, Attendance, Image } = require('../../db/models');
const { check } = require('express-validator');
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

    console.log(image.dataValues.imageableUser)

    if (image.dataValues.imageableUser !== req.user.id) {

        res.status(403)
        res.json(    {
            "message": "Forbidden"
          })
    } else {

        await image.destroy();

            res.status(200);
            res.json( {
                "Message": "Successfully deleted"
        });

    };

});


//DELETE Event image by imageId

router.delete('/event-images/:imageId', requireAuth, async (req, res, next) => {

    const { imageId } = req.params;
    const image = await Image.findOne({
        where: {
            imageableId: imageId,
            imageableType: 'Event'
        }
    });

    if (!image) {
        const err = new Error("Event Image couldn't be found");
        err.status = 404;
        err.message = "Event Image couldn't be found"
        return next(err)
    };

    image.destroy();

    res.status(200);
    res.json( {
        "Message": "Successfully deleted"
    });

});


module.exports = router;