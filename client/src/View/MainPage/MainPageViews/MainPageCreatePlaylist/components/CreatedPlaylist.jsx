import React from "react";
import "./createdPlaylist.css";
import { useState } from "react";
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

const CreatedPlaylist = () => {
  const playlists = useSelector((state) => state.playlists.playlists);
  const dispatch = useDispatch();
  // state for opening and closing the edit menu
  const [isOpen, setIsOpen] = useState(true);

  // let array = [];

  // playlists.map((item) => {
  //   array.push({
  //     item,
  //     value: false,
  //   });
  // });

  return (
    <div className="playlistContainer">
      { playlists.map((playlist, index) => {
        return (
          <div className="created-playlist-container" key={ playlist["_id"] }>
            {/* <img src={""} alt="user image" className="user-image" /> */ }
            <h1 className="playlist-name-title">{ playlist.playlistName }</h1>
            <button
              className="expand-shrink-button"
              type="button"
              onClick={ () => setIsOpen(!isOpen) }
            >
              { isOpen ? (
                <FontAwesomeIcon
                  icon={ faAnglesLeft }
                  className="open-edit-menu"
                />
              ) : (
                <FontAwesomeIcon
                  icon={ faAnglesRight }
                  className="close-edit-menu"
                />
              ) }
            </button>
            <div
              className={ isOpen ? "edit-menu-closed" : "edit-menu" }
              onClick={ () => setIsOpen(false) }
            >
              <FontAwesomeIcon icon={ faLock } className="lock-playlist" onClick={ () => { mainAxios.updatePlaylistVisibility(playlist['_id'], "private"); } } />
              <FontAwesomeIcon icon={ faLockOpen } className="unlock-playlist" onClick={ () => { mainAxios.updatePlaylistVisibility(playlist['_id'], "public"); } } />
              <FontAwesomeIcon icon={ faPen } className="edit-playlist" />
              <FontAwesomeIcon
                icon={ faTrash }
                className="delete-playlist"
                onClick={ async () => {
                  const result = await mainAxios.deletePlaylist(
                    playlist["_id"]
                  );
                  if (result.data) {
                    const index = playlists.indexOf(playlist);
                    dispatch(deletePlaylist(index));
                    dispatch(setReloadPlaylists(true));
                  }
                } }
              />
            </div>
          </div>
        );
      }) }
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
