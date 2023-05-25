// backend/utils/validation.js
const { validationResult, check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.statusCode = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

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


module.exports = {
  handleValidationErrors, 
  validateCreateGroup
};