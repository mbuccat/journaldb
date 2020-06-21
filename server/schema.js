const Joi = require('@hapi/joi');

const schema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .trim()
    .min(8)
    .max(20)
    .pattern(/^[\S]*$/)
    .required(),
});

module.exports = schema;
