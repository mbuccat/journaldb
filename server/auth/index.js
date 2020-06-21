const { Router } = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const {
  validateFormInput, validatePassword, checkUniqueUser, checkUserExists,
} = require('../middlewares');

const router = Router();

router.post('/signup', validateFormInput, checkUniqueUser, (req, res) => {
  const { email, password } = req.body;
  // const hashedPassword = await bcrypt.hash(password, 12);
  const userInfo = {
    email,
    // hashedPassword
  };

  // add user info to database with hashed password

  res.status(200).json({
    message: 'User created',
    userInfo
  });
});

router.post('/login', validateFormInput, checkUserExists, validatePassword, (req, res) => {
  // create a token and send it in the response

  res.status(200).json({
    message: 'User logged in',
    token: '',
  });
});

module.exports = router;
