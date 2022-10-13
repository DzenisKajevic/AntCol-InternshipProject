import React, { useEffect, useRef, useState } from "react";
import "./mainPageCreatePlaylist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import CreatedPlaylist from "./components/CreatedPlaylist";
import * as mainAxios from "../../mainAxios";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylists, setReloadPlaylists, addPlaylistToArray } from "../../../../slices/playlists/playlistsSlice";

const MainPageCreatePlaylist = () => {

  const [playlistNameInput, setPlaylistNameInput] = useState("");
  const reloadPlaylists = useSelector((state) => state.playlists.reloadPlaylists);
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.playlists.playlists);
  const sortSongAsc = useRef(true);
  const sortAuthorAsc = useRef(true);

  useEffect(() => {
    if (reloadPlaylists) {
      const fetchPlaylists = async function () {
        let result = await mainAxios.getPlaylists();
        dispatch(setPlaylists(result.data.data));
        dispatch(setReloadPlaylists(false));
      }
      fetchPlaylists()
        .catch(console.error);
    }
  }, [reloadPlaylists]);

  return (

    <section className="create-playlist-container">
      <h1 className="main-page-create-playlist-title">
        Create your own playlists
      </h1>
      <div className="create-playlist-form">
        <FontAwesomeIcon
          icon={ faSquarePlus }
          className="add-playlist-icon"
          title="create playlist"
          onClick={ async () => { // set song list under the search bar and edit the redux state
            let result = await mainAxios.createEmptyPlaylist(playlistNameInput, "private");
            if (result.data) {
              dispatch(addPlaylistToArray(result.data.data));
              dispatch(setReloadPlaylists(true));
            }
          } }
        />
        <form onSubmit={ (e) => {
          e.preventDefault();
        } }>
          <input
            type="text"
            className="create-playlist-input"
            autoComplete="off"
            placeholder="Give your playlist a name"
            value={ playlistNameInput }
            onChange={ (event) => { setPlaylistNameInput(event.target.value); } }
          />
        </form>
      </div>
      <CreatedPlaylist />
    </section>
  );
};

export default MainPageCreatePlaylist;
