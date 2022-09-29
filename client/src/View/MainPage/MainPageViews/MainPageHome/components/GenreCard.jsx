import React from "react";
import "./genreCard.css";

const GenreCard = ({ title }) => {
  return (
    <div className="genre-card">
      <h4 className="card-title">{title}</h4>
    </div>
  );
};

export default GenreCard;
