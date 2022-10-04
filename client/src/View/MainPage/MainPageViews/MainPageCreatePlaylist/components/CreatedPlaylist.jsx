import React from "react";
import "./createdPlaylist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const CreatedPlaylist = ({ userImage, playlistName }) => {
  return (
    <div className="created-playlist-container">
      <img src={userImage} alt="user image" className="user-image" />
      <h1 className="playlist-name-title">{playlistName}</h1>
      <div className="edit-delete-playlist">
        <FontAwesomeIcon icon={faPen} className="edit-playlist" />
        <FontAwesomeIcon icon={faTrash} className="delete-playlist" />
      </div>
    </div>
  );
};

export default CreatedPlaylist;
