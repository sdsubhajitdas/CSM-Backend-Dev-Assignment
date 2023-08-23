import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().required("Password required"),
});

const registerSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string()
    .min(8, "Password cannot be less than 8 characters long")
    .max(20, "Password cannot be more than 20 characters long")
    .required("Password required"),
  confirmPassword: Yup.string()
    .required("Please re-enter your password")
    .oneOf([Yup.ref("password")], "Your passwords do not match"),
});

export { loginSchema, registerSchema };
