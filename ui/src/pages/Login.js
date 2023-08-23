import { Formik, Field, Form } from "formik";
import { Link } from "react-router-dom";
import { loginSchema } from "../utils/validation";

export default function Login() {
  return (
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
          console.log(values);
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
            />
            {errors.password && touched.password ? (
              <span className="text-sm text-red-500">{errors.password}</span>
            ) : null}

            {/* Submit button */}
            <button
              type="submit"
              className="p-2 text-lg text-white bg-green-500 rounded"
            >
              Submit
            </button>
            <Link className="text-center hover:underline" to="/register">
              Create a new account?
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
}
