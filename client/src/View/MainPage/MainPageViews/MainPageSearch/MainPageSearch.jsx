import React from "react";
import "./mainPageSearch.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SongContainer from "./components/SongContainer/SongContainer";

const MainPageSearch = () => {
  return (
    <section>
      <h1 className="main-page-search-title">
        Find your favorite songs and artists
      </h1>
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="search"
          id="search-bar"
          name="search-bar"
          placeholder="Search for your favorite songs"
          className="search-bar"
          incremental="true"
          autoComplete="off"
        />
        <button className="search-bar-button" type="button">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        </button>
      </form>
      <nav className="search-buttons-container">
        <button className="search-buttons" type="button">
          All
        </button>
        <button className="search-buttons" type="button">
          Artist
        </button>
        <button className="search-buttons" type="button">
          Song
        </button>
        {/* <button className="search-buttons" type="button">
          Playlist
        </button> */}
      </nav>
      <SongContainer />
    </section>
  );
};

export default MainPageSearch;
