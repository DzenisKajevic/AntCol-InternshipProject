import React from "react";
import "./sideBar.css";
import "../../../../variables.css";
import {
  faHouse,
  faMagnifyingGlass,
  faPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-content">
        <NavLink
          to="/main-page/home"
          className={({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          <span className="sidebar-navigation">
            <FontAwesomeIcon icon={faHouse} className="navigation-icons" />
            <h3 className="not-active-link">Home</h3>
          </span>
        </NavLink>
        <NavLink
          to="/main-page/search"
          className={({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          <span className="sidebar-navigation">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="navigation-icons"
            />
            <h3 className="not-active-link">Search</h3>
          </span>
        </NavLink>
        <div className="breakline"></div>
        <NavLink
          to="/main-page/create-playlist"
          className={({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          <span className="sidebar-navigation">
            <FontAwesomeIcon icon={faPlus} className="navigation-icons" />
            <h3 className="not-active-link">Create playlist</h3>
          </span>
        </NavLink>
        {/* some of users playlists render if they exist */}
        <NavLink
          to="/main-page/favorites"
          className={({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          <span className="sidebar-navigation">
            <FontAwesomeIcon icon={faStar} className="navigation-icons" />
            <h3 className="not-active-link">Favorites</h3>
          </span>
        </NavLink>

        {/* after this maybe add some footer links or some other links */}
        {/* this side bar will have sticky position  */}
      </nav>
      <div className="animated-logo">
        <h1 className="animated-logo-title">AntCol Music App</h1>
      </div>
      <a className="sidebar-links" href="#">
        About
      </a>
      <a className="sidebar-links" href="#">
        Contact
      </a>
      <a className="sidebar-links" href="#">
        Partners
      </a>
      <p className="copyright-p-main">2022 &copy; AntCol Music App</p>
    </aside>
  );
};

export default SideBar;