const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./dbConnection');
const { signUpSchema, logInSchema } = require('./schema');

const validateSignUpForm = (req, res, next) => {
  const { error: validationError } = signUpSchema.validate(req.body);

  // no error returns an undefined, so !validationError is truthy
  if (!validationError) {
    next();
  } else {
    const error = new Error('Error with user input');
    error.status = 400;
    next(error);
  }
};

const validateLogInForm = (req, res, next) => {
  const { error: validationError } = logInSchema.validate(req.body);

  // no error returns an undefined, so !validationError is truthy
  if (!validationError) {
    next();
  } else {
    const error = new Error('Error with user input');
    error.status = 400;
    next(error);
  }
};

const checkUserExists = (req, res, next) => {
  const { email } = req.body;
  
  pool.query(
    `SELECT Email, Password FROM subscribers WHERE Email='${email}'`,
    (userExistsError, results) => {
      if (userExistsError) next(new Error('Error encountered when looking up user'));

      // if user doesn't exist, results[0] is undefined
      req.locals = { userExists: results[0] };
      next();
    },
  );
};

const validatePassword = (req, res, next) => {
  if (req.locals.userExists) {
    const { Email, Password } = req.locals.userExists;

    // check password provided matches password stored in db,
    // then, create a token
    if (bcrypt.compareSync(req.body.password, Password)) {
      const payload = {
        Email,
      };
      req.locals.token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: '1d' });
      next();
    } else {
      const error = new Error('Error with email or password');
      error.status = 400;
      next(error);
    }
  } else {
    const error = new Error('User does not exist');
    error.status = 400;
    next(error);
  }
};

const validateToken = (req, res, next) => {
  // validate token with jwt
  next();
};

module.exports = {
  validateSignUpForm, validateLogInForm, validatePassword, validateToken, checkUserExists,
};
