// const jwt = require('jsonwebtoken');

const schema = require('./schema');

const validateFormInput = (req, res, next) => {
  const { error: validationError } = schema.validate(req.body);

  // no error returns an undefined, so !validationError is truthy
  if (!validationError) {
    next();
  } else {
    const error = new Error('Error with email or password');
    error.status = 400;
    next(error);
  }
};

const checkUniqueUser = (req, res, next) => {
  // check database
  next();
};

const checkUserExists = (req, res, next) => {
  // check database
  next();
};

const validatePassword = (req, res, next) => {
  // hash provided password and compare to database
  next();
};

const validateToken = (req, res, next) => {
  // validate token with jwt
  next();
};

module.exports = {
  validateFormInput, validatePassword, validateToken, checkUserExists, checkUniqueUser,
};
