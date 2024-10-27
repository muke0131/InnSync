const { validationResult } = require('express-validator');

exports.validationMiddleware = (validations) => {
    return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Validation error',
        errors: errors.array()
      });
    };
  };