// backend/utils/validation.js
const { validationResult, check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {

    let errors = {};
    const err = Error("Bad request."); 
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg );

    
    err.errors = errors;
    err.status = 400;
    err.statusCode = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateCreateEvent = [

check('venueId')
  .exists({checkFalsy: true})
  .notEmpty()
  .withMessage("Venue does not exist"),

check('name')
  .exists({checkFalsy: true})
  .notEmpty()
  .isLength({ min: 5, max: 100 })
  .withMessage("Name must be at least 5 characters"),

check('type')
  .exists({checkFalsy: true})
  .notEmpty()
  .withMessage("Type must be Online or In person"),

check('capacity')
  .exists({checkFalsy: true})
  .notEmpty()
  .isNumeric()
  .withMessage("Capacity must be an integer"),

check('price')
  .exists({checkFalsy: true})
  .notEmpty()
  .withMessage("Price is invalid"),

check('description')
  .exists({checkFalsy: true})
  .notEmpty()
  .withMessage("Description is required"),

check('startDate')
  .notEmpty()
  .withMessage("Start date must be in the future"),
  
check('endDate')
  .notEmpty()
  .withMessage("End date is less than start date"),

  handleValidationErrors

];

const validateCreateGroup = [

  check('name')
    .exists({checkFalsy: true})
    .notEmpty()
    .isLength({ min: 1, max: 60})
    .withMessage("Name must be 60 characters or less"),
  
  check('about')
    .exists({checkFalsy: true})
    .notEmpty()
    .isLength({ min: 50, max: 1000})
    .withMessage("About must be 50 characters or more"),

  check('type')
    .exists({checkFalsy: true})
    .isIn(['In person', 'Online'])
    .withMessage("Type must be 'Online' or 'In person'"),

  check('private')
    .exists()
    .isBoolean()
    .withMessage("Private must be a boolean"),

  check('city')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("City is required"),

  check('state')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("State is required"),
  
  handleValidationErrors
  
];

const validateCreateVenue = [

  check('address')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("Street address is required"),
  
  check('city')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("City is required"),

  check('state')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("State is required"),

  check('lat')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("Latitude is not valid"),

  check('lng')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage("Longitude is not valid"),
  
  handleValidationErrors
  
];



module.exports = {
  handleValidationErrors, 
  validateCreateGroup,
  validateCreateVenue,
  validateCreateEvent
};