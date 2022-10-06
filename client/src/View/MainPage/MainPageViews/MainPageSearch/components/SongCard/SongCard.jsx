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
  const favouriteSongs = useSelector((state) => state.favouriteSongs);
  const dispatch = useDispatch();

  async function playSong(song, index) {
    cleanup();
    let tempSongInfo = structuredClone(song);
    console.log(index);
    tempSongInfo['songIndex'] = index;
    tempSongInfo['playedFrom'] = source.source;
    dispatch(setSongInfo(tempSongInfo));
    dispatch(setSeekBytes(0));
  }

  if (source.source === "SEARCH") {
    console.log(searchResults.songs);
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
        { favouriteSongs.songs.map((song, index) => {
          return (<div className="song-card" key={ song.fileId['_id'] } >
            <img src={ null } alt="author image" className="author-image" onClick={ async () => { console.log(song['fileId']); await playSong(song['fileId'], index) } } />
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