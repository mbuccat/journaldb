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

const checkEmailAvailable = (req, res, next) => {
  const { email } = req.body;

  pool.query(
    `SELECT * FROM ${process.env.DB_SCHEMA}.check_email_available('${email}');`,
    (userExistsError, results) => {
      if (userExistsError) next(new Error('Error encountered when looking up user'));
      else {
        // if email is not yet taken, results.rows[0] is undefined
        req.locals = { userExists: results.rows[0] };
        next();
      }
    },
  );
};

const validatePassword = (req, res, next) => {
  if (req.locals.userExists) {
    const { SubscriberID, Email, Password } = req.locals.userExists;

    // check password provided matches password stored in db,
    // then, create a token
    if (bcrypt.compareSync(req.body.password, Password)) {
      const payload = {
        SubscriberID,
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
  const auth = req.get('authorization');

  // if a token was sent, verify it
  if (auth) {
    const token = auth.split(' ')[1];

    if (token) {
      // if token is invalid, jwt will throw an error and Express will catch
      const payload = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = payload;
      next();
    } else {
      const error = new Error('Unable to validate user');
      error.status = 400;
      next(error);
    }
  } else {
    next();
  }
};

const checkIsLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    const error = new Error('Unauthorized');
    error.status = 401;
    next(error);
  }
};

module.exports = {
  validateSignUpForm,
  validateLogInForm,
  validatePassword,
  validateToken,
  checkEmailAvailable,
  checkIsLoggedIn,
};
