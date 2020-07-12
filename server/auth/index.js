const { Router } = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../dbConnection');
const {
  validateSignUpForm, validateLogInForm, validatePassword, checkEmailAvailable,
} = require('../middlewares');

const router = Router();

router.post('/signup', validateSignUpForm, checkEmailAvailable, async (req, res, next) => {
  // if user doesn't exist, req.locals.userExists is set to
  // undefined by checkUserExists
  if (!req.locals.userExists) {
    const {
      email, password, fname, lname,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    pool.query(
      `CALL insertSubscriberInfo('${email}', '${hashedPassword}', '${fname}', '${lname}')`,
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

router.post('/login', validateLogInForm, checkEmailAvailable, validatePassword, (req, res) => {
  res.status(200).json({
    message: 'User logged in',
    token: req.locals.token,
  });
});

module.exports = router;
