import axios from "../api/axios";
import Alert from "../components/Alert";
import { Formik, Field, Form } from "formik";
import { Link, Navigate } from "react-router-dom";
import { loginSchema } from "../utils/validation";
import { useMutation } from "@tanstack/react-query";
import useAuthentication from "../hooks/useAuthentication";

export default function Login() {
  // Retrieving the authentication state of the application
  let {
    authentication: { isAuthenticated },
    setAuthentication,
  } = useAuthentication();

  const { error, isError, isLoading, mutate } = useMutation({
    mutationFn: (loginFormData) => {
      return axios.post("api/authentication/login", loginFormData);
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
      <h2 className="my-5 text-3xl text-center">Welcome back</h2>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          mutate(values);
        }}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col max-w-xl gap-3 p-5 mx-auto border border-black rounded">
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

            {/* Submit button */}
            <button
              type="submit"
              className="p-2 text-lg text-white bg-green-500 rounded disabled:bg-gray-500"
              disabled={isLoading}
            >
              Submit
            </button>

            <Link className="text-center hover:underline" to="/register">
              Create a new account?
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
