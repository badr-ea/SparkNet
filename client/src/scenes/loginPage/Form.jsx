import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../../state/";
import "../../index.css";
import { useDispatch } from "react-redux";

const registerSchema = yup.object().shape({
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  year: yup.string().required("required"),
  month: yup.string().required("required"),
  day: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const intialValuesRegister = {
  username: "",
  email: "",
  password: "",
  year: "",
  month: "",
  day: "",
};

const intialLoginValues = {
  email: "",
  password: "",
};

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const currentYear = new Date().getFullYear();
const startYear = 1903;

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    try {
      const birth = `${values.year}-${values.month}-${values.day}`;
      const { username, password, email } = values;
      const reqBody = { username, password, email, birth };
      console.log(reqBody);
      const savedUserResponse = await fetch(
        "http://localhost:3001/api/v1/auth/signup",
        {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const savedUser = await savedUserResponse.json();
      onSubmitProps.resetForm();

      if (savedUser) {
        setPageType("login");
      }
    } catch (error) {
      console.error("An error occurred during registration:", error.message);
    }
  };

  const testing = (values) => console.log(values);
  console.log("register: ", isRegister);
  console.log("login", isLogin);
  console.log(errorMessage);

  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await fetch(
        "http://localhost:3001/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      console.log(loggedInResponse);
      if (loggedInResponse.status == 401) {
        setErrorMessage("Invalid credentials");
      }

      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();

      if (loggedIn) {
        setErrorMessage("");
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
      }
      navigate("/home");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(values);
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      initialValues={isLogin ? intialLoginValues : intialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form
          className="form-wrapper"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div className="form-container">
            <div className="form-header desktop-headline-medium">
              {isRegister ? "Create your account" : "Login"}
            </div>

            {isRegister && (
              <>
                <div className="form-textfield">
                  <input
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input body-large ${
                      errors.username ? "form-input-error" : ""
                    }`}
                    value={values.username}
                    name="username"
                  />
                  <label
                    htmlFor="username"
                    className={`form-label ${
                      errors.username ? "form-label-error" : ""
                    }`}
                  >
                    Username
                  </label>
                </div>
              </>
            )}
            <div className="form-textfield">
              <input
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input body-large ${
                  errors.email && touched.email ? "form-input-error" : ""
                }`}
                value={values.email}
                name="email"
              />
              <label
                htmlFor="email"
                className={`form-label ${
                  errors.username ? "form-label-error" : ""
                }`}
              >
                Email
              </label>
            </div>
            <div className="form-textfield">
              <input
                type={`${isRegister ? "text" : "password"}`}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input body-large ${
                  errors.password && touched.password ? "form-input-error" : ""
                }`}
                value={values.password}
                name="password"
              />
              <label
                htmlFor="password"
                className={`form-label ${
                  errors.password ? "form-label-error" : ""
                }`}
              >
                Password
              </label>
            </div>
            {isRegister && (
              <>
                <section className="form-birth-section">
                  <span className="form-birth body-large">Birth date</span>
                  <div className="form-policy">
                    To ensure you're eligible to use our platform, please
                    provide your date of birth. Don't worry, your information
                    will be kept secure and confidential.
                  </div>
                  <div className="form-birth-container">
                    <div className="form-month">
                      <label htmlFor="month" className="form-select-label">
                        Month
                      </label>
                      <select
                        name="month"
                        onChange={(e) => {
                          const selectedMonth = e.target.value;
                          setFieldValue("month", selectedMonth);
                          // Reset day to 1 if it's greater than the number of days in the selected month
                          const days = daysInMonth(
                            parseInt(selectedMonth, 10),
                            currentYear
                          );
                          setFieldValue(
                            "day",
                            values.day <= days ? values.day : 1
                          );
                        }}
                        value={values.month}
                        className="month-select body-large"
                      >
                        <option value=""></option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-day">
                      <label htmlFor="day" className="form-select-label">
                        Day
                      </label>
                      <select
                        name="day"
                        value={values.day}
                        onChange={handleChange}
                        className="day-select body-large"
                      >
                        {console.log("Selected Month:", values.month)}
                        {values.month &&
                          Array.from({
                            length: daysInMonth(
                              parseInt(values.month, 10),
                              currentYear
                            ),
                          }).map((_, index) => (
                            <option key={index + 1} value={index + 1}>
                              {index + 1}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-year">
                      <label htmlFor="year" className="form-select-label">
                        Year
                      </label>
                      <select
                        name="year"
                        onChange={handleChange}
                        value={values.year}
                        className="year-select body-large"
                      >
                        <option value=""></option>
                        {Array.from(
                          { length: currentYear - startYear + 1 },
                          (_, index) => (
                            <option
                              key={currentYear - index}
                              value={currentYear - index}
                            >
                              {currentYear - index}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </section>
              </>
            )}
            <button type="submit" className="form-button  body-large">
              {isRegister ? "Sign up" : "Sign in"}
            </button>
            {errorMessage && (
              <p className="invalid-login body-medium">{errorMessage}</p>
            )}
            {console.log(values)}
            <span
              onClick={() => {
                setPageType(isRegister ? "login" : "register");
                resetForm();
              }}
              className="form-switch body-medium"
            >
              {isLogin
                ? "Don't have an account? Sign up here"
                : "Already have an account? Login here"}
            </span>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default Form;
