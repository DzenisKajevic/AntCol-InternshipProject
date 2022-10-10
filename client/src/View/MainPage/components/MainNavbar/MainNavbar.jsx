import React, { useEffect, useState } from "react";
import "./mainNavbar.css";
import { Buffer } from "buffer";
import "../../../../variables.css";
import { Link } from "react-router-dom";
import logo from "./navbarImages/music-app-logo.png";
import * as mainAxios from "../../mainAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as mainNavbarAxios from "./mainNavbarAxios";
import {
  faEllipsisVertical,
  faPlus,
  faRightFromBracket,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import UploadImgPopup from "./components/UploadImgPopup";

const MainNavbar = () => {
  const [profilePic, setProfilePic] = useState(null);

  // Converts any given blob into a base64 encoded string.
  function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
  useEffect(() => {
    const setProfilePicture = async function () {
      const response = await mainNavbarAxios.getFile({
        userId: JSON.parse(window.localStorage.user)["_id"],
      });
      const src = await convertBlobToBase64(response);
      setProfilePic(src);
    };
    setProfilePicture();
  }, []);

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
        <p className="mainNavbar-username">
          {JSON.parse(window.localStorage.user).username}
        </p>
        <div className="username-img-container">
          <img src={`${profilePic}`} width="50px" alt="" />
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
