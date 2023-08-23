const Yup = require("yup");

const loginSchema = Yup.object({
  email: Yup.string()
    .email("email id invalid")
    .required("email field is required"),
  password: Yup.string().required("password field is required"),
});

const registerSchema = Yup.object({
  fullName: Yup.string().required("fullName field is required"),
  email: Yup.string()
    .required("email field is required")
    .email("email id invalid"),
  password: Yup.string()
    .min(8, "password needs to be minimum 8 characters long")
    .max(20, "password cannot be more than 20 characters long")
    .required("password field is required"),
});

module.exports = { loginSchema, registerSchema };
