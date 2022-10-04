import React, { useState } from "react";
import "./mainPageSearch.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SongContainer from "./components/SongContainer/SongContainer";
import * as mainAxios from "../../mainAxios";
import SongCard from "./components/SongCard/SongCard";
import { useDispatch, useSelector } from "react-redux";
import { setSearchResults } from "../../../../slices/search/searchResultsSlice";
import { useEffect } from "react";

const MainPageSearch = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.searchResults);
  let songIndex = 0;

  return (
    <section>
      <h1 className="main-page-search-title">
        Find your favorite songs and artists
      </h1>
      <form
        className="search-form"
        onSubmit={ (e) => {
          e.preventDefault();
        } }
      >
        <input
          type="search"
          id="search-bar"
          name="search-bar"
          value={ searchText }
          onChange={ (event) => { setSearchText(event.target.value); } }
          placeholder="Search for your favorite songs"
          className="search-bar"
          incremental="true"
        />
        <button className="search-bar-button" onClick={ async () => { // set song list under the search bar and edit the redux state
          let result = await mainAxios.getAllFiles({ 'metadata.songName': searchText });
          result['playedFrom'] = 'SEARCH';
          result['index'] = songIndex;
          dispatch(setSearchResults(result.data));
          songIndex = 0;
        } } type="button">
          <FontAwesomeIcon icon={ faMagnifyingGlass } className="search-icon" />
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
      {/* <SongContainer /> */ }
      <SongCard></SongCard>
    </section>
  );
};

export default MainPageSearch;
