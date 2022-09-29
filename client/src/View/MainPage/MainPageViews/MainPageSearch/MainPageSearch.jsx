import React from "react";
import "./mainPageSearch.css";

const MainPageSearch = () => {
  return (
    <section>
      <form>
        <input type="search" />
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
