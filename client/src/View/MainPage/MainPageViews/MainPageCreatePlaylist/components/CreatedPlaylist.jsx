import React from "react";
import "./createdPlaylist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faLock,
  faLockOpen,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import * as mainAxios from "../../../mainAxios";
import { setReloadPlaylists } from "../../../../../slices/audioVisualiser/songInfoSlice";
import { deletePlaylist } from "../../../../../slices/playlists/playlistsSlice";

const CreatedPlaylist = ({ userImage, playlistName }) => {
  const playlists = useSelector((state) => state.playlists.playlists);
  const dispatch = useDispatch();

  return (
    <div className="Some container idk">
      {playlists.map((playlist, index) => {
        return (
          <div className="created-playlist-container" key={playlist["_id"]}>
            {/* <img src={userImage} alt="user image" className="user-image" /> */}
            <h1 className="playlist-name-title">{playlist.playlistName}</h1>
            <FontAwesomeIcon icon={faAnglesRight} className="close-edit-menu" />
            {/* <FontAwesomeIcon icon={faAnglesLeft} className="open-edit-menu" /> */}
            <div className="edit-menu">
              <FontAwesomeIcon icon={faLock} className="lock-playlist" />
              <FontAwesomeIcon icon={faLockOpen} className="unlock-playlist" />
              <FontAwesomeIcon icon={faPen} className="edit-playlist" />
              <FontAwesomeIcon
                icon={faTrash}
                className="delete-playlist"
                onClick={async () => {
                  const result = await mainAxios.deletePlaylist(
                    playlist["_id"]
                  );
                  if (result.data) {
                    const index = playlists.indexOf(playlist);
                    console.log(index);
                    dispatch(deletePlaylist(index));
                    dispatch(setReloadPlaylists(true));
                  }
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

{
  /*       <img src={userImage} alt="user image" className="user-image" />
      <h1 className="playlist-name-title">{playlistName}</h1>
      <div className="edit-delete-playlist">
        <FontAwesomeIcon icon={faPen} className="edit-playlist" />
        <FontAwesomeIcon icon={faTrash} className="delete-playlist" />
      </div> */
}

export default CreatedPlaylist;
