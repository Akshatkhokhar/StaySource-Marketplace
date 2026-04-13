const { errorResponse } = require('../utils/response');
const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format error to extract just messages
    const formattedErrors = errors.array().map(err => err.msg);
    return errorResponse(res, 400, 'Validation Error', formattedErrors.join(', '));
  }
  next();
};

module.exports = { validateRequest };
