import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import "../../variables.css";

const Navbar = () => {
  return (
    <header className="navbar-header">
      <nav className="navbar">
        <img
          className="music-app-logo"
          src="./assets/app-images/music-app-logo.png"
          alt="application logo"
        />
        <Link to="/log-in" className="links">
          <button className="login-button shine">Log in</button>
        </Link>
        <Link to="/registration" className="links">
          <button className="signup-button shine">Sign up</button>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
