import React from "react";
import "./songCard.css";

const SongCard = ({ img, author, genre, songName, album }) => {
  return (
    <div className="song-card">
      <img src={img} alt="author image" className="author-image" />
      <div className="song-card-text">
        <p className="author-name-p">{author}</p>
        <p className="song-name-p">{songName}</p>
        <p className="genre-p">{genre}</p>
      </div>
      <img src={album} alt="album image" className="album-image" />
    </div>
  );
};

export default SongCard;
