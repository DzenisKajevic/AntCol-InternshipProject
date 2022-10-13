import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./songCard.css";
import { setReloadFavouriteSongs } from "../../../../../../slices/favourites/favouriteSongsSlice";
import {
  setSongInfo,
  setReloadPlaylists,
} from "../../../../../../slices/audioVisualiser/songInfoSlice";
import { cleanup, source } from "../../../MainPagePlayer/AudioVisualiser";
import { setSeekBytes } from "../../../../../../slices/audioVisualiser/seekBytesSlice";
import * as mainAxios from "../../../../mainAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faXmark, faPlay } from "@fortawesome/free-solid-svg-icons";

let playSong = null;

const SongCard = (source, style) => {
  const genres = useSelector((state) => state.genres);
  const searchResults = useSelector((state) => state.searchResults);
  const favouriteSongs = useSelector((state) => state.favouriteSongs);
  const songInfo = useSelector((state) => state.songInfo.song);
  const dispatch = useDispatch();

  playSong = function (song, index) {
    cleanup();
    let tempSongInfo = structuredClone(song);
    tempSongInfo["songIndex"] = index;
    if (!song["playedFrom"]) tempSongInfo["playedFrom"] = source.source;
    dispatch(setSongInfo(tempSongInfo));
    dispatch(setSeekBytes(0));
  };

  if (source.source === "SEARCH") {
    return (
      <div className="song-cards">
        { searchResults.songs.length ? searchResults.songs.map((song, index) => {
          return (
            <div className="song-card" key={ song["_id"] }>
              <button
                className="song-card-play-button"
                onClick={ async () => {
                  playSong(song, index);
                } }
              >
                <FontAwesomeIcon icon={ faPlay } className="play-icon" />
              </button>
              <div className="song-card-text">
                <p className="author-name-p">{ song.metadata.author }</p>
                <p className="song-name-p">{ song.metadata.songName }</p>
                <p className="genre-p">{ song.metadata.genre }</p>
              </div>
              <img
                src="http://placekitten.com/60"
                alt="author image"
                className="author-image"
              />
              <button
                className="addToFavourites"
                onClick={ async () => {
                  const result = await mainAxios.addFileToFavourites(
                    song["_id"]
                  );
                  if (result.data) dispatch(setReloadFavouriteSongs(true));
                } }
              >
                <FontAwesomeIcon
                  icon={ faBookmark }
                  className="bookmark-icon"
                  title="Add song to favorites"
                />
              </button>
            </div>
          );
        }) : <p>{/* Songs not found */ }</p> }
      </div>
    );
  } else if (source.source === "FAVOURITES") {
    return (
      <div className="song-cards">
        { favouriteSongs.songs ? favouriteSongs.songs.map((song, index) => {
          return (
            <div className="song-card" key={ song.fileId["_id"] }>
              <button
                className="song-card-play-button"
                onClick={ async () => {
                  playSong(song, index);
                } }
              >
                <FontAwesomeIcon icon={ faPlay } className="play-icon" />
              </button>
              <div className="song-card-text">
                <p className="author-name-p">{ song.fileId.metadata.author }</p>
                <p className="song-name-p">{ song.fileId.metadata.songName }</p>
                <p className="genre-p">{ song.fileId.metadata.genre }</p>
              </div>
              <img
                // src={null}
                src="http://placekitten.com/60"
                alt="album image"
                className="album-image"
              />
              <button
                className="removeFromFavourites"
                onClick={ async () => {
                  const result = await mainAxios.deleteFavouriteFile(
                    song.fileId["_id"]
                  );
                  if (result.data) dispatch(setReloadFavouriteSongs(true));
                } }
              >
                <FontAwesomeIcon
                  icon={ faXmark }
                  className="bookmark-icon-remove"
                  title="Remove song from favorites"
                />
              </button>
            </div>
          );
        }) : <p>{/* No favorites found */ }</p> }
      </div>
    );
  } else if (source.source === "GENRES") {
    return (
      <div
        className="song-cards"
        style={ { display: genres.songsHidden ? "none" : null } }
      >
        { genres.songs.length ? genres.songs.map((song, index) => {
          return (
            <div className="song-card" key={ song["_id"] }>
              <button
                className="song-card-play-button"
                onClick={ async () => {
                  playSong(song, index);
                } }
              >
                <FontAwesomeIcon icon={ faPlay } className="play-icon" />
              </button>
              <div className="song-card-text">
                <p className="author-name-p">{ song.metadata.author }</p>
                <p className="song-name-p">{ song.metadata.songName }</p>
                <p className="genre-p">{ song.metadata.genre }</p>
              </div>
              <img
                // src={null}
                src="http://placekitten.com/60"
                alt="album image"
                className="album-image"
              />
              <button
                className="addToFavourites"
                onClick={ async () => {
                  const result = await mainAxios.addFileToFavourites(
                    song["_id"]
                  );
                  if (result.data) dispatch(setReloadFavouriteSongs(true));
                } }
              >
                <FontAwesomeIcon
                  icon={ faBookmark }
                  className="bookmark-icon"
                  title="Add song to favorites"
                />
              </button>
            </div>
          );
        }) : <p>No songs found</p> }
      </div>
    );
  }
};

export { SongCard, playSong };
