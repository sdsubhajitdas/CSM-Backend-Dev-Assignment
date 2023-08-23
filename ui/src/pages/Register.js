import axios from "../api/axios";
import Alert from "../components/Alert";
import { Formik, Field, Form } from "formik";
import { Link, Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerSchema } from "../utils/validation";
import useAuthentication from "../hooks/useAuthentication";

export default function Register() {
  // Retrieving the authentication state of the application
  let {
    authentication: { isAuthenticated },
    setAuthentication,
  } = useAuthentication();

  const { error, isError, isLoading, mutate } = useMutation({
    mutationFn: (registerFormData) => {
      return axios.post("api/authentication/register", registerFormData);
    },
    onSuccess: (data) => {
      setAuthentication((previous) => ({
        ...previous,
        isAuthenticated: true,
        user: data.data,
      }));
    },
    onError: () => {
      setAuthentication((previous) => ({
        ...previous,
        isAuthenticated: false,
        user: null,
      }));
    },
  });

  return isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <div className="container p-3 mx-auto">
      <h1 className="mt-24 text-5xl text-center">CSM Backend Assignment</h1>
      <h2 className="my-5 text-3xl text-center">Register as a new user</h2>
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={registerSchema}
        onSubmit={(values) => {
          mutate(values);
        }}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col max-w-xl gap-3 p-5 mx-auto border border-black rounded">
            {/* Full name block */}
            <label htmlFor="fullName" className="text-sm text-gray-700">
              Full Name
            </label>
            <Field
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              type="text"
              className="p-2 border border-black rounded"
              disabled={isLoading}
            />
            {errors.fullName && touched.fullName ? (
              <span className="text-sm text-red-500">{errors.fullName}</span>
            ) : null}

            {/* Email block */}
            <label htmlFor="email" className="text-sm text-gray-700">
              Email
            </label>
            <Field
              id="email"
              name="email"
              placeholder="your@email.com"
              type="text"
              className="p-2 border border-black rounded"
              disabled={isLoading}
            />
            {errors.email && touched.email ? (
              <span className="text-sm text-red-500">{errors.email}</span>
            ) : null}

            {/* Password block */}
            <label htmlFor="password" className="text-sm text-gray-700">
              Password
            </label>
            <Field
              id="password"
              name="password"
              type="password"
              className="p-2 border border-black rounded"
              disabled={isLoading}
            />
            {errors.password && touched.password ? (
              <span className="text-sm text-red-500">{errors.password}</span>
            ) : null}

            {/* Confirm password block */}
            <label htmlFor="confirmPassword" className="text-sm text-gray-700">
              Confirm Password
            </label>
            <Field
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="p-2 border border-black rounded"
              disabled={isLoading}
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <span className="text-sm text-red-500">
                {errors.confirmPassword}
              </span>
            ) : null}

            {/* Submit button */}
            <button
              type="submit"
              className="p-2 text-lg text-white bg-green-500 rounded disabled:bg-gray-500"
              disabled={isLoading}
            >
              Submit
            </button>

            <Link className="text-center hover:underline" to="/login">
              Already have an account?
            </Link>

            {isError ? (
              <Alert variant="error" message={error.response.data.message} />
            ) : null}
          </Form>
        )}
      </Formik>
    </div>
  );
}
