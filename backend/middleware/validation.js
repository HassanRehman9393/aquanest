const joi = require('joi');

// User registration validation
const validateRegister = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    phone: joi.string().pattern(/^\d{10,15}$/).required(),
    address: joi.object({
      street: joi.string().optional(),
      city: joi.string().optional(),
      state: joi.string().optional(),
      zipCode: joi.string().optional(),
      country: joi.string().optional()
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

// User login validation
const validateLogin = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

// Profile update validation
const validateProfileUpdate = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(2).max(50).optional(),
    phone: joi.string().pattern(/^\d{10,15}$/).optional(),
    address: joi.object({
      street: joi.string().optional(),
      city: joi.string().optional(),
      state: joi.string().optional(),
      zipCode: joi.string().optional(),
      country: joi.string().optional()
    }).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

// Password change validation
const validatePasswordChange = (req, res, next) => {
  const schema = joi.object({
    currentPassword: joi.string().required(),
    newPassword: joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
};
