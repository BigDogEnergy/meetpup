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
    .isLength({ min: 1, max: 40})
    .withMessage('Name must be more than 1 character and less than 40'),
  
  check('about')
    .exists({checkFalsy: true})
    .notEmpty()
    .isLength({ min: 10, max: 1000})
    .withMessage('About must be between 10 and 1000 characters'),

  check('type')
    .exists({checkFalsy: true})
    .isIn(['In person', 'Online'])
    .withMessage('Type mut be "In person" or "Online"'),

  check('private')
    .exists()
    .isBoolean()
    .withMessage('Private must be True or False'),

  check('city')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage('Please enter a city'),

  check('state')
    .exists({checkFalsy: true})
    .notEmpty()
    .withMessage('Please enter a state'),
  
  handleValidationErrors
  
];


module.exports = {
  handleValidationErrors, 
  validateCreateGroup
};