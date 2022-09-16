import React from "react";
import "./login.css";
import "../../../variables.css";

const Login = () => {
  return (
    <section className="loginpage-container">
      <div className="login-bg-color-wrapper">
        <form action="post" className="login-form">
          <h1 className="login-title">Log in to your account</h1>

          <label className="login-label">Username:</label>
          <input
            type="text"
            className="login-input"
            placeholder="Type in your username"
          />

          <label className="login-label">Password:</label>
          <input
            type="password"
            className="login-input"
            placeholder="Type in your password"
          />

          <button className="loginpage-button shine">Log in</button>
          <fieldset className="paragraph-fieldset">
            <label className="login-label2">Remember me</label>
            <input className="checkbox-input" type="checkbox" />
            <p className="pw-link-paragraph">
              Forgot your <a href="">password?</a>
            </p>
          </fieldset>
          <img
            className="loginpage-icon"
            src="./assets/app-images/music-app-logo.png"
            alt="music app logo"
          />
          <p className="signup-link-paragraph">
            Don't have an account? <a href="">Sign up</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
