import React, { useRef, useState } from "react";
import "./mainPageSearch.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SongContainer from "./components/SongContainer/SongContainer"; // SongContainer is not in use. Delete(?)
import * as mainAxios from "../../mainAxios";
import { SongCard } from "./components/SongCard/SongCard";
import { useDispatch, useSelector } from "react-redux";
import { setSearchResults } from "../../../../slices/search/searchResultsSlice";

const MainPageSearch = () => {
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.searchResults);
  const sortSongAsc = useRef(true);
  const sortAuthorAsc = useRef(true);
  const pagination = useRef({
    page: "1",
    pageSize: "4",
  });

  const updateSearch = function (result) {
    if (result.data) dispatch(setSearchResults(result.data.data));
    else {
      pagination.current.page = 1;
      dispatch(setSearchResults({ searchResults: [], pageCount: 0 }));
    }
    window.location.hash = "nonExistantHashUsedForRefreshing";
    window.location.hash = "#card-container";
  };

  const sortByAuthor = function () {
    let tempSearchResults = structuredClone(searchResults.songs);
    // check author a > b, if equal, check songName a > b.
    if (sortAuthorAsc.current)
      tempSearchResults.sort((a, b) =>
        a.metadata.author > b.metadata.author
          ? 1
          : a.metadata.author === b.metadata.author
            ? a.metadata.songName > b.metadata.songName
              ? 1
              : -1
            : -1
      );
    else
      tempSearchResults.sort((a, b) =>
        a.metadata.author > b.metadata.author
          ? -1
          : a.metadata.author === b.metadata.author
            ? a.metadata.songName > b.metadata.songName
              ? -1
              : 1
            : 1
      );

    sortAuthorAsc.current = !sortAuthorAsc.current;
    dispatch(
      setSearchResults({
        searchResults: tempSearchResults,
        pageCount: searchResults.pageCount,
      })
    ); // invoke rerender
  };

  const sortBySong = function () {
    let tempSearchResults = structuredClone(searchResults.songs);
    // check author a > b, if equal, check songName a > b.
    if (sortSongAsc.current)
      tempSearchResults.sort((a, b) =>
        a.metadata.songName > b.metadata.songName
          ? 1
          : a.metadata.songName === b.metadata.songName
            ? a.metadata.author > b.metadata.author
              ? 1
              : -1
            : -1
      );
    else
      tempSearchResults.sort((a, b) =>
        a.metadata.songName > b.metadata.songName
          ? -1
          : a.metadata.songName === b.metadata.songName
            ? a.metadata.author > b.metadata.author
              ? -1
              : 1
            : 1
      );

    sortSongAsc.current = !sortSongAsc.current;
    dispatch(
      setSearchResults({
        searchResults: tempSearchResults,
        pageCount: searchResults.pageCount,
      })
    ); // invoke rerender
  };

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
          autoComplete="off"
          value={ searchText }
          onChange={ (event) => {
            setSearchText(event.target.value);
          } }
          placeholder="Search for your favorite songs"
          className="search-bar"
          incremental="true"
        />
        <button
          className="search-bar-button"
          onClick={ async () => {
            // set song list under the search bar and edit the redux state
            let result = await mainAxios.getAllFiles({
              "metadata.songName": searchText,
              page: pagination.current.page,
              pageSize: pagination.current.pageSize,
            });
            updateSearch(result);
          } }
          type="button"
        >
          <FontAwesomeIcon icon={ faMagnifyingGlass } className="search-icon" />
        </button>
      </form>
      <nav className="search-buttons-container">
        {/* <button className="search-buttons" type="button">
          All
        </button> */}
        <button
          className="search-buttons"
          type="button"
          onClick={ () => {
            sortByAuthor();
          } }
        >
          Artist
        </button>
        <button
          className="search-buttons"
          type="button"
          onClick={ () => {
            sortBySong();
          } }
        >
          Song
        </button>
        {/* <button className="search-buttons" type="button">
          Playlist
        </button> */}
      </nav>
      {/* <SongContainer /> */ }
      <SongCard source="SEARCH" />
      <div className="mainPage-button-container">
        <button
          id="previousPage"
          className="previousPage"
          style={ {
            display: pagination.current.page - 1 <= 0 ? "none" : null,
          } }
          onClick={ async () => {
            pagination.current.page--;
            let result = await mainAxios.getAllFiles({
              "metadata.songName": searchText,
              page: pagination.current.page,
              pageSize: pagination.current.pageSize,
            });
            updateSearch(result);
          } }
        >
          { Number(pagination.current.page) - 1 }
        </button>

        <button
          id="currentPage"
          className="currentPage"
          style={ {
            display:
              !searchResults.songs || searchResults.songs.length
                ? null
                : "none",
          } }
        >
          { pagination.current.page }
        </button>

        <button
          id="nextPage"
          className="nextPage"
          style={ {
            display:
              Number(pagination.current.page) + 1 > searchResults.pageCount
                ? "none"
                : null,
          } }
          onClick={ async () => {
            pagination.current.page++;
            let result = await mainAxios.getAllFiles({
              "metadata.songName": searchText,
              page: pagination.current.page,
              pageSize: pagination.current.pageSize,
            });
            updateSearch(result);
          } }
        >
          { Number(pagination.current.page) + 1 }
        </button>
      </div>
    </section>
  );
};

export default MainPageSearch;
