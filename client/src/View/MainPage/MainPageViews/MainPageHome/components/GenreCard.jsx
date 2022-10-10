import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./genreCard.css";

const GenreCard = () => {
  const genres = useSelector((state) => state.genres.genres);
  const dispatch = useDispatch();

  return (
    genres.map((genre, index) => {
      return (
        <div className="genre-card" key={ genre }>
          <h4 className="card-title" >{ genre }</h4>
        </div>
      );
    })
  );
};

export default GenreCard;
