const Joi = require('@hapi/joi');

const signUpSchema = Joi.object({
  email: Joi.string()
    .email()
    .max(45)
    .required(),

  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(/^[\S]*$/)
    .required(),

  fname: Joi.string()
    .min(2)
    .max(45)
    .required(),

  lname: Joi.string()
    .min(2)
    .max(45)
    .required(),
});

const logInSchema = Joi.object({
  email: Joi.string()
    .email()
    .max(45)
    .required(),

  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(/^[\S]*$/)
    .required(),
});

module.exports = { signUpSchema, logInSchema };
