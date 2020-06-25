const { Router } = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../dbConnection');
const {
  validateSignUpForm, validateLogInForm, validatePassword, checkUserExists,
} = require('../middlewares');

const router = Router();

router.post('/signup', validateSignUpForm, checkUserExists, async (req, res, next) => {
  // if user doesn't exist, req.locals.userExists is set to
  // undefined by checkUserExists
  if (!req.locals.userExists) {
    const {
      email, password, fname, lname,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    pool.query(
      `INSERT INTO subscribers
      (Email, Password, FName, LName)
      VALUES ('${email}', '${hashedPassword}', '${fname}', '${lname}')`,
      (error) => {
        if (error) next(new Error('Unable to sign user up'));
        else {
          res.status(200).json({
            message: 'User created',
            email,
          });
        }
      },
    );
  } else {
    const error = new Error('Email taken');
    error.status = 400;
    next(error);
  }
});

router.post('/login', validateLogInForm, checkUserExists, validatePassword, (req, res) => {
  res.status(200).json({
    message: 'User logged in',
    token: req.locals.token,
  });
});

module.exports = router;
