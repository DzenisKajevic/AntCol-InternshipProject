import React from "react";
import "./mainPageCreatePlaylist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import CreatedPlaylist from "./components/CreatedPlaylist";

const MainPageCreatePlaylist = () => {
  return (
    <section className="create-playlist-container">
      <h1 className="main-page-create-playlist-title">
        Create your own playlists
      </h1>
      <p className="main-page-create-playlist-p">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim odit modi
        voluptate totam fugit dignissimos, cupiditate excepturi nobis accusamus
        ducimus! Vitae ipsam qui culpa ratione harum pariatur distinctio
        recusandae, id exercitationem
      </p>
      <div className="create-playlist-form">
        <FontAwesomeIcon
          icon={faSquarePlus}
          className="add-playlist-icon"
          title="create playlist"
        />
        <form>
          <input
            type="text"
            className="create-playlist-input"
            autoComplete="off"
            placeholder="Give your playlist a name"
          />
        </form>
      </div>
      <CreatedPlaylist
        userImage="http://placekitten.com/50"
        playlistName={"Playlist Name"}
      />
      <CreatedPlaylist
        userImage="http://placekitten.com/50"
        playlistName={"Playlist Name"}
      />
    </section>
  );
};

export default MainPageCreatePlaylist;
