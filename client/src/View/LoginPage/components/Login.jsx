import React from "react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./login.css";
import "../../../variables.css";
import * as loginAxios from "../loginAxios";
import * as userAuth from "../../../api/auth/userAuth";

const LOGIN_URL = "http://localhost:3001/api/v1/auth/login";

const Login = () => {
  const navigate = useNavigate();

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pass]);

  const submitHandler = async (e) => {
    const user = {};
    e.preventDefault();
    user.email = email;
    user.password = pass;
    const result = await loginAxios.login(user);

    if (result.data) {
      setSuccess("Successfuly Logged in!");

      setTimeout(() => {
        navigate("/main-page");
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <>
      {success ? (
        <section className="success-login-page">
          <h1 className="success-login-title">Successfuly Logged in!</h1>
        </section>
      ) : (
        <section className="loginpage-container">
          <div className="login-bg-color-wrapper">
            <form onSubmit={submitHandler} className="login-form">
              <h1 className="login-title">Log in to your account</h1>
              <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
                {errMsg}
              </p>
              <label htmlFor="email" className="login-label">
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
                className="login-input"
                placeholder="Type in your e-mail address"
              />

              <label htmlFor="password" className="login-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                className="login-input"
                placeholder="Type in your password"
              />

              <button type="submit" className="loginpage-button shine">
                Log in
              </button>
              <fieldset className="paragraph-fieldset">
                <label className="login-label2">Remember me</label>
                <input className="checkbox-input" type="checkbox" />
                <p className="pw-link-paragraph">
                  Forgot your <a href="">password?</a>
                </p>
              </fieldset>
              <Link to="/">
                <img
                  className="loginpage-icon"
                  src="./assets/app-images/music-app-logo.png"
                  alt="music app logo"
                />
              </Link>
              <p className="signup-link-paragraph">
                Don't have an account? <Link to="/registration">Sign up</Link>
              </p>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Login;
