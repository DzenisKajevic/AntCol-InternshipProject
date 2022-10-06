import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GenreCard from "./components/GenreCard";
import * as mainAxios from "../../mainAxios";
import "./mainPageHome.css";
import { setGenres, setReloadGenres } from "../../../../slices/genres/genresSlice";

const MainPageHome = () => {
  useEffect(() => {
    if (reloadGenres) {
      const fetchPlaylists = async function () {
        let result = await mainAxios.getAllGenres(pagination.current);
        dispatch(setGenres(result.data.data));
        dispatch(setReloadGenres(false)); // never returned to true since multiple API calls would yield the same result
      }
      fetchPlaylists()
        .catch(console.error);
    }
  }, []);

  const genreCardsRef = useRef(null);
  const genres = useSelector((state) => state.genres);
  const reloadGenres = useSelector((state) => state.genres.reloadGenres);
  const dispatch = useDispatch();
  const pagination = useRef({
    'page': '1',
    'pageSize': '8'
  });

  return (
    <section>
      <h1 className="main-page-home-title">Find your favorite genres</h1>
      {/* old cards */ }
      <div className="card-container" id="card-container" ref={ genreCardsRef }>
        {/*         <GenreCard title="Pop" />
        <GenreCard title="Hip-Hop" />
        <GenreCard title="Rock" />
        <GenreCard title="Metal" />
        <GenreCard title="Classical" />
        <GenreCard title="Blue" />
        <GenreCard title="Funk" />
        <GenreCard title="K-Pop" /> */}
        <GenreCard />
      </div>
      <button id="previousPage" style={ { backgroundColor: '#4CAF50', display: pagination.current.page - 1 <= 0 ? 'none' : null } } onClick={ async () => {
        pagination.current.page--;
        let result = await mainAxios.getAllGenres(pagination.current);
        dispatch(setGenres(result.data.data));
        window.location.hash = "nonExistantHashUsedForRefreshing";
        window.location.hash = "#card-container";
      } }>{ Number(pagination.current.page) - 1 }
      </button>

      <button id="currentPage" style={ { backgroundColor: '#FF0000' } }>{ pagination.current.page }</button>

      <button id="nextPage" style={ { backgroundColor: '#4CAF50', display: Number(pagination.current.page) + 1 > genres.pageCount ? 'none' : null } } onClick={ async () => {
        pagination.current.page++;
        let result = await mainAxios.getAllGenres(pagination.current);
        dispatch(setGenres(result.data.data));
        window.location.hash = "nonExistantHashUsedForRefreshing";
        window.location.hash = "#card-container";
      } }>{ Number(pagination.current.page) + 1 }</button>

      {/* new cards  */ }
      {/* <div class="container">
        <div class="box">
          <span></span>
          <div class="content">
            <h2>Card one</h2>
          </div>
        </div>
        <div class="box">
          <span></span>
          <div class="content">
            <h2>Card two</h2>
          </div>
        </div>
        <div class="box">
          <span></span>
          <div class="content">
            <h2>Card Three</h2>
          </div>
        </div>
      </div> */}
    </section >
  );
};

export default MainPageHome;
