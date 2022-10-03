import React from "react";
import "./mainNavbar.css";
import "../../../../variables.css";
import { Link } from "react-router-dom";
import * as mainAxios from "../../mainAxios";

const MainNavbar = () => {
  return (
    <nav className="mainNavbar">
      <Link to="/main-page">
        <img
          className="mainNavbar-app-logo"
          src="./assets/app-images/music-app-logo.png"
          alt="application logo"
        />
      </Link>
      <div className="mainNavbar-button-container">
        <button className="sub-button shine">Subscribe</button>
        <div className="v-breakline-main"></div>
        <button className="logout-button shine" onClick={() => { mainAxios.logout(); }}>Log out</button>
      </div>
    </nav>
  );
};

export default MainNavbar;
