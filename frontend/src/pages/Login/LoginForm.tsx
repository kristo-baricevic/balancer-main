import { useFormik } from "formik";
// import { Link, useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login, AppDispatch } from "../../services/actions/auth";
import { connect, useDispatch } from "react-redux";
import { RootState } from "../../services/actions/types";
import { useState, useEffect } from "react";
import ErrorMessage from "../../components/ErrorMessage";

//April 23, 2024: changed "id" in email input field from "login-email" 
//to "email" so that it matches the value in htmlFor - Kristo

interface LoginFormProps {
  isAuthenticated: boolean;
  loginError?: string | null; // Align this with the mapped state
}

function LoginForm({ isAuthenticated, loginError }: LoginFormProps) {
  // const { isAuthenticated } = props;
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  useEffect(() => {
    if (loginError) {
      setErrors([loginError]);
    }
  }, [loginError]);
  const { handleChange, handleSubmit, values } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(login(values.email, values.password));
        // Login successful, navigate or do something here
      } catch (error) {
        // Assuming the error is an object with a message property
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setErrors([errorMessage]);
      } finally {
        setSubmitting(false); // Ensures form can be submitted again
      }
    },
  });

  return (
    <>
      <section className=" mx-auto mt-24 w-[20rem] md:mt-48 md:w-[32rem]">
        <form
          onSubmit={handleSubmit}
          className="mb-4 rounded-md  bg-white px-3 pb-12 pt-6 shadow-md ring-1 md:px-12"
        >
          <div className="flex items-center justify-center">
            {/* {errorMessage && <div className="text-red-500">{errorMessage}</div>} */}
            <h2 className="blue_gradient mb-6 font-satoshi text-3xl font-bold text-gray-600">
              Welcome
            </h2>
          </div>
          <ErrorMessage errors={errors} />
          <div className="mb-4 mt-5">
            <label
              htmlFor="email"
              className="mb-2 block text-lg font-bold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              value={values.email}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-lg font-bold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              value={values.password}
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            {/* <Link to="/resetpassword">
              <button className="btnGray" type="submit">
                Forgot Password?
              </button>
            </Link> */}
            <button className="btnBlue w-full text-lg" type="submit">
              Sign In
            </button>
          </div>
        </form>
      </section>
      {/* <p>
        Don't have an account?{" "}
        <Link to="/register" className="font-bold hover:text-blue-600">
          {" "}
          Register here
        </Link>
        .
      </p> */}
    </>
  );
}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loginError: state.auth.error, // Ensure your reducer is setting this
});

// Assign the connected component to a named constant
const ConnectedLoginForm = connect(mapStateToProps)(LoginForm);

// Export the named constant
export default ConnectedLoginForm;
