import * as yup from 'yup';

export const pathParam = yup
  .number()
  .required()
  .positive()
  .integer();

export const logInSchema = yup.object({
  email: yup.string()
    .email()
    .max(45)
    .required(),

  password: yup.string()
    .min(8)
    .max(20)
    .matches(/^[\S]*$/)
    .required(),
});

export const signUpSchema = yup.object({
  email: yup.string()
    .email()
    .max(45)
    .required(),

  password: yup.string()
    .min(8)
    .max(20)
    .matches(/^[\S]*$/)
    .required(),

  fname: yup.string()
    .min(2)
    .max(45)
    .required(),

  lname: yup.string()
    .min(2)
    .max(45)
    .required(),
});
