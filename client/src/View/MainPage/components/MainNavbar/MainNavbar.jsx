import React from "react";
import "./mainNavbar.css";
import "../../../../variables.css";
import { Link } from "react-router-dom";
import logo from "./navbarImages/music-app-logo.png";
import * as mainAxios from "../../mainAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPlus,
  faRightFromBracket,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import UploadImgPopup from "./components/UploadImgPopup";

const MainNavbar = () => {
  return (
    <nav className="mainNavbar">
      <Link to="/main-page/home">
        <img
          className="mainNavbar-app-logo"
          src={logo}
          alt="application logo"
        />
      </Link>
      <div className="user-info-container">
        <p className="mainNavbar-username">username</p>
        <div className="username-img-container">
          <img src={logo} width="50px" alt="" />
        </div>
        <div className="dropdown">
          <button className="dropdown-button">
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="three-dots-icon"
            />
          </button>
          <div className="dropdown-menu">
            <button onClick={<UploadImgPopup trigger={true} />}>
              Change picture{" "}
              <FontAwesomeIcon icon={faPlus} className="dropdown-icons" />
            </button>
            <div className="dropdown-breakline"></div>
            <p>
              Change username{" "}
              <FontAwesomeIcon icon={faPen} className="dropdown-icons" />
            </p>
            <div className="dropdown-breakline"></div>
            <p>
              Log out{" "}
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="dropdown-icons"
              />
            </p>
          </div>
        </div>
      </div>
      <div className="mainNavbar-button-container">
        <button className="sub-button shine">Subscribe</button>
        <div className="v-breakline-main"></div>
        <button
          className="logout-button shine"
          onClick={() => {
            mainAxios.logout();
          }}
        >
          Log out
        </button>
      </div>
    </nav>
  );
};

export default MainNavbar;
