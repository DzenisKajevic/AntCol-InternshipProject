import React, { useEffect, useState } from "react";
import "./mainNavbar.css";
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

  // opening and closing upload img popup
  const [visibility, setVisibility] = useState(false);

  const [menuVisibility, setMenuVisibility] = useState(false);

  const toggleMenuVisibility = () => {
    setMenuVisibility((prevState) => !prevState);
  };

  const popupCloseHandler = () => {
    setVisibility(false);
  };

  const closeDropdownMenu = (e) => { };
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

  useEffect(() => {/* 
    console.log(visibility, "vidljivost"); */
  }, [visibility]);

  return (
    <>
      <nav className="mainNavbar">
        <Link to="/main-page/home">
          <img
            className="mainNavbar-app-logo"
            src={ logo }
            alt="application logo"
          />
        </Link>
        <div className="user-info-container">
          <p className="mainNavbar-username">
            { JSON.parse(window.localStorage.user).username }
          </p>
          <div className="username-img-container">
            <img src={ `${profilePic}` } width="50px" style={ { borderRadius: "50%" } } alt="" />
          </div>
          <div className="dropdown">
            <button className="dropdown-button" onClick={ toggleMenuVisibility }>
              <FontAwesomeIcon
                icon={ faEllipsisVertical }
                className="three-dots-icon"
              />
            </button>
            { menuVisibility && (
              <div className="dropdown-menu">
                <button
                  onClick={ (event) => {
                    event.stopPropagation();
                    setVisibility(!visibility);
                    console.log("usao sam");
                  } }
                >
                  Change picture{ " " }
                  <FontAwesomeIcon icon={ faPlus } className="dropdown-icons" />
                  { visibility && (
                    <UploadImgPopup
                      onClick={ popupCloseHandler }
                      show={ visibility }
                      title="Upload an image"
                    >
                      {/* <input type="file" /> */ }
                    </UploadImgPopup>
                  ) }
                </button>
                <div className="dropdown-breakline"></div>
                <p>
                  Change username{ " " }
                  <FontAwesomeIcon icon={ faPen } className="dropdown-icons" />
                </p>
                <div className="dropdown-breakline"></div>
                <button
                  onClick={ () => {
                    mainAxios.logout();
                  } }
                >
                  Log out{ " " }
                  <FontAwesomeIcon
                    icon={ faRightFromBracket }
                    className="dropdown-icons"
                  />
                </button>
              </div>
            ) }
          </div>
        </div>
        <div className="mainNavbar-button-container">
          <button className="sub-button shine">Subscribe</button>
          <div className="v-breakline-main"></div>
          <button
            className="logout-button shine"
            onClick={ () => {
              mainAxios.logout();
            } }
          >
            Log out
          </button>
        </div>
      </nav>
    </>
  );
};

export default MainNavbar;
