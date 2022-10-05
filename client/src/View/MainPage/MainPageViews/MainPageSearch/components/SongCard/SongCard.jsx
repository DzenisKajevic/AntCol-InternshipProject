import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./songCard.css";
import { setReloadFavouriteSongs } from "../../../../../../slices/favourites/favouriteSongsSlice"
import { setSongInfo, setReloadPlaylists } from "../../../../../../slices/audioVisualiser/songInfoSlice";
import { cleanup, source } from "../../../MainPagePlayer/AudioVisualiser";
import { setSeekBytes } from "../../../../../../slices/audioVisualiser/seekBytesSlice";
import * as mainAxios from "../../../../mainAxios";

const SongCard = (source) => {
  const searchResults = useSelector((state) => state.searchResults);
  const favouriteSongs = useSelector((state) => state.favouriteSongs.songs);
  const dispatch = useDispatch();

  async function playSong(song, index) {
    cleanup();
    let tempSongInfo = structuredClone(song);
    tempSongInfo['songIndex'] = index;
    tempSongInfo['playedFrom'] = 'SEARCH';
    dispatch(setSongInfo(tempSongInfo));
    dispatch(setSeekBytes(0));
  }

  if (source.source === "SEARCH") {
    return (
      <div className="song-cards" >
        { searchResults.songs.map((song, index) => {
          return (<div className="song-card" key={ song['_id'] } >
            <img src={ null } alt="author image" className="author-image" onClick={ async () => { playSong(song, index) } } />
            <div className="song-card-text">
              <p className="author-name-p">{ song.metadata.author }</p>
              <p className="song-name-p">{ song.metadata.songName }</p>
              <p className="genre-p">{ song.metadata.genre }</p>
            </div>
            <img src={ null } alt="album image" className="album-image" />
            <button className="addToFavourites" onClick={
              async () => {
                const result = await mainAxios.addFileToFavourites(song['_id']);
                if (result.data) dispatch(setReloadFavouriteSongs(true));
              }
            }></button>
          </div>);
        })
        }
      </div >
    );
  }
  else if (source.source === "FAVOURITES") {
    return (
      <div className="song-cards" >
        { favouriteSongs.map((song, index) => {
          return (<div className="song-card" key={ song.fileId['_id'] } >
            <img src={ null } alt="author image" className="author-image" onClick={ async () => { playSong(song, index) } } />
            <div className="song-card-text">
              <p className="author-name-p">{ song.fileId.metadata.author }</p>
              <p className="song-name-p">{ song.fileId.metadata.songName }</p>
              <p className="genre-p">{ song.fileId.metadata.genre }</p>
            </div>
            <img src={ null } alt="album image" className="album-image" />
            <button className="removeFromFavourites" onClick={
              async () => {
                const result = await mainAxios.deleteFavouriteFile(song.fileId['_id']);
                if (result.data) dispatch(setReloadFavouriteSongs(true));
              }
            }></button>
          </div>);
        })
        }
      </div >
    );
  }
};

export default SongCard;



















/* // this could be used to save space on code, but the generateSongCards() function has problems with extracting metadata
// due to favourite songs having a few extra branches in the object

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./songCard.css";
import { setReloadFavouriteSongs } from "../../../../../../slices/favourites/favouriteSongsSlice"
import { setSongInfo, setReloadPlaylists } from "../../../../../../slices/audioVisualiser/songInfoSlice";
import { cleanup } from "../../../MainPagePlayer/AudioVisualiser";
import { setSeekBytes } from "../../../../../../slices/audioVisualiser/seekBytesSlice";
import * as mainAxios from "../../../../mainAxios";

const SongCard = (source) => {
  const searchResults = useSelector((state) => state.searchResults);
  const favouriteSongs = useSelector((state) => state.favouriteSongs.songs)
  const dispatch = useDispatch();

  console.log(searchResults.songs, favouriteSongs);
  const generateSongCards = function (cardSource) {
    console.log(cardSource);
    return <div className="song-cards" >
      { cardSource.map((song, index) => {
        return (<div className="song-card" key={ song['_id'] } >
          <img src={ "" } alt="author image" className="author-image" onClick={ async () => { playSong(song, index) } } />
          <div className="song-card-text">
            <p className="author-name-p">{ song.metadata.author }</p>
            <p className="song-name-p">{ song.metadata.songName }</p>
            <p className="genre-p">{ song.metadata.genre }</p>
          </div>
          <img src={ "" } alt="album image" className="album-image" />
          <button className="addToFavourites" onClick={
            async () => {
              const result = await mainAxios.addFileToFavourites(song['_id']);
              if (result.data) dispatch(setReloadFavouriteSongs(true));
            }
          }></button>
        </div>);
      })
      }
    </div >
  };

  async function playSong(song, index) {
    cleanup();
    let tempSongInfo = structuredClone(song);
    tempSongInfo['songIndex'] = index;
    tempSongInfo['playedFrom'] = 'SEARCH';
    console.log(tempSongInfo);
    dispatch(setSongInfo(tempSongInfo));
    dispatch(setSeekBytes(0));
  }
  console.log(source.source);




  if (source.source === "SEARCH") {
    return generateSongCards(searchResults.songs);
  }
  else if (source.source === "FAVOURITES") {
    return generateSongCards(favouriteSongs);
  }


}

export default SongCard;
 */


