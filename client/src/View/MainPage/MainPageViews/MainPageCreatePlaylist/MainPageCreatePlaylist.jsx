import React from "react";
import "./mainPageCreatePlaylist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

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
        <FontAwesomeIcon icon={faSquarePlus} className="add-playlist-icon" />
        <form>
          <input type="text" />
        </form>
      </div>
    </section>
  );
};

export default MainPageCreatePlaylist;
