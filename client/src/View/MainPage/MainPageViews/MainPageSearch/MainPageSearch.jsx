import React from "react";
import "./mainPageSearch.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MainPageSearch = () => {
  return (
    <section>
      <h1 className="main-page-search-title">
        Find your favorite songs and artists
      </h1>
      <form className="search-form">
        <input
          type="search"
          id="search-bar"
          name="search-bar"
          placeholder="Search for your favorite songs"
          className="search-bar"
          incremental="true"
        />
        <button className="search-bar-button" type="button">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        </button>
      </form>
      <nav className="search-buttons-container">
        <button className="search-buttons">All</button>
        <button className="search-buttons">Artist</button>
        <button className="search-buttons">Song</button>
        <button className="search-buttons">Playlist</button>
      </nav>
    </section>
  );
};

export default MainPageSearch;
