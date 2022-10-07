import React, { useEffect, useState } from "react";
import "./mainNavbar.css";
import { Buffer } from "buffer";
import "../../../../variables.css";
import { Link } from "react-router-dom";
import logo from "./navbarImages/music-app-logo.png";
import * as mainAxios from "../../mainAxios";
import * as mainNavbarAxios from "./mainNavbarAxios"

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
      const response = await mainNavbarAxios.getFile({ userId: JSON.parse(window.localStorage.user)['_id'] });
      const src = await convertBlobToBase64(response);
      setProfilePic(src);
    }
    setProfilePicture();
  }, []);

  return (
    <nav className="mainNavbar">
      <Link to="/main-page/home">
        <img
          className="mainNavbar-app-logo"
          src={ logo }
          alt="application logo"
        />
      </Link>
      <div className="mainNavbar-button-container">
        <img style={ { width: '75px', height: '75px', borderRadius: '50%' } } src={ `${profilePic}` } alt=":)" />
        <button className="sub-button shine">{ JSON.parse(window.localStorage.user).username }</button>
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
  );
};

export default MainNavbar;
