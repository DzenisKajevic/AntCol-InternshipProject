import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./register.css";
import "../../../variables.css";
// import * as registerAxios from "../registerAxios";
import * as userAuth from "../../../api/auth/userAuth";

// username and password validation, shows what is a valid username and password
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{4,23}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

const Register = () => {
  // admins can't be registered through forms. They can only be added manually through the DB
  // onClick={() => register("tempUser", "email@gmail.com", "pass123")}
  async function register(username, email, pass) {
    const response = await userAuth.register(username, email, pass);
    if (response.error) {
      console.log(response.error); // response.error.response.data -> error message
    } else {
      console.log(response.data);
    }
  }

  // navigates to another page after successful register
  const navigate = useNavigate();

  // setting up focus on user input and error if accures
  const userRef = useRef();
  const errRef = useRef();

  // state for setting up username
  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  // state for setting up email
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  // state for setting up password
  const [pass, setPass] = useState("");
  const [validPass, setValidPass] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  // state for possible error message, or success message
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // setting up effect for focus when the component loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // setting up effect for the username, validating the username anytime it changes
  useEffect(() => {
    const result = USER_REGEX.test(username);
    console.log(result);
    console.log(username);
    setValidName(result);
  }, [username]);

  // setting up effeect for the email, validating the email
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
  }, [email]);

  // setting up effect for the password, validating the password
  useEffect(() => {
    const result = PWD_REGEX.test(pass);
    console.log(result);
    console.log(pass);
    setValidPass(result);
  }, [pass]);

  // setting up effect for possible erros message
  useEffect(() => {
    setErrMsg("");
  }, [username, pass]);

  // submit function, checking if all the input fields are valid then displaying either error or success message
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(username);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(pass);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid entry");
      return;
    }
    console.log(username, email, pass);
    setSuccess(true);
    navigate("/login");
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Successfuly Registered!</h1>
        </section>
      ) : (
        <section className="registrationpage-container">
          <p ref={errRef} className={errMsg ? "reg-errmsg" : "offscreen"}>
            {errMsg}
          </p>
          <div className="register-bg-color-wrapper">
            <form onSubmit={handleSubmit} className="register-form">
              <h1 className="register-title">Sign up for a new account</h1>

              <label htmlFor="username" className="register-label">
                Username:
                <span className={validName ? "reg-valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span
                  className={validName || !username ? "hide" : "reg-invalid"}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setUsernameFocus(true)}
                onBlur={() => setUsernameFocus(false)}
                className="register-input"
                placeholder="Choose a username"
                required
              />
              <p
                id="uidnote"
                className={
                  usernameFocus && username && !validName
                    ? "reg-instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                5 to 23 characters, <br />
                Must begin with a letter, <br />
                Letters, numbers, hyphens and underscores are allowed
              </p>

              <label htmlFor="email" className="register-label">
                Email:
                <span className={validEmail ? "reg-valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validEmail || !email ? "hide" : "reg-invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                className="register-input"
                placeholder="Type in your e-mail address"
                required
                autoComplete="off"
              />
              <p
                id="emailnote"
                className={
                  emailFocus && !validEmail ? "reg-instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Enter a valid e-mail address!
              </p>

              <label htmlFor="password" className="register-label">
                Password:
                <span className={validPass ? "reg-valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validPass || !pass ? "hide" : "reg-invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPass(e.target.value)}
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
                className="register-input"
                placeholder="Choose a password"
                required
              />
              <p
                id="passnote"
                className={
                  passFocus && !validPass ? "reg-instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters, <br />
                Must include at least one uppercase letter, lowercase letter and
                a number.
              </p>
              {/* change the onClick on the line below to test axios calls */}
              <button
                className="registrationpage-button shine" /* onClick={() => registerAxios.register("tempUser", "email@gmail.com", "pass123") }*/
              >
                Sign up
              </button>
              <img
                className="registerpage-icon"
                src="./assets/app-images/music-app-logo.png"
                alt="music app logo"
              />
              <p className="register-link-paragraph">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Register;
