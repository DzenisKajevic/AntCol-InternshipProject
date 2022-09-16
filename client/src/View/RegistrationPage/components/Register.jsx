import React from "react";
import "./register.css";
import "../../../variables.css";
import * as registerAxios from "../registerAxios";

const Register = () => {
  return (
    <section className="registrationpage-container">
      <div className="register-bg-color-wrapper">
        <form action="post" className="register-form">
          <h1 className="register-title">Sign up for a new account</h1>

          <label className="register-label">Username:</label>
          <input
            type="text"
            className="register-input"
            placeholder="Choose a username"
            required
          />

          <label className="register-label">Email:</label>
          <input
            type="email"
            className="register-input"
            placeholder="Type in your e-mail address"
            required
          />

          <label className="register-label">Password:</label>
          <input
            type="password"
            className="register-input"
            placeholder="Choose a password"
            required
          />
          {/* change the onClick on the line below to test axios calls */}
          <button className="registrationpage-button shine" /* onClick={() => registerAxios.register("tempUser", "email@gmail.com", "pass123") }*/>Sign up</button >
          <img
            className="registerpage-icon"
            src="./assets/app-images/music-app-logo.png"
            alt="music app logo"
          />
          <p className="register-link-paragraph">
            Already have an account? <a href="">Log in</a>
          </p>
        </form>
      </div>
    </section >
  );
};


export default Register;
