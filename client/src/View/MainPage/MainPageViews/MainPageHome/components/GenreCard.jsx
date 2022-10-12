import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./genreCard.css";
import * as mainAxios from "../../../mainAxios";
import { setGenreSongs } from "../../../../../slices/genres/genresSlice";

const GenreCard = () => {
  const genres = useSelector((state) => state.genres.genres);
  const dispatch = useDispatch();

  const pagination = useRef({
    page: "1",
    pageSize: "4",
  });

  const updateGenreSongs = function (result) {
    if (result.data) dispatch(setGenreSongs(result.data.data));
    else {
      pagination.current.page = 1;
      dispatch(setGenreSongs({ searchResults: [], genresPageCount: 0 }));
    }
    /*     window.location.hash = "nonExistantHashUsedForRefreshing";
        window.location.hash = "#card-container"; */
  };



  return (
    genres.map((genre, index) => {
      return (
        <div className="genre-card" key={ genre } onClick={ async () => {
          let result = await mainAxios.getAllFiles({
            "metadata.genre": genre,
            page: pagination.current.page,
            pageSize: pagination.current.pageSize,
          });
          result.data.data.currentGenre = genre;
          updateGenreSongs(result);
        } }>
          <h4 className="card-title" >{ genre }</h4>
        </div>
      );
    })
  );
};

export default GenreCard;
