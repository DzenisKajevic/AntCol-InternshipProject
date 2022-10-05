import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./songCard.css";
import { setReloadFavouriteSongs } from "../../../../../../slices/favourites/favouriteSongsSlice"
import { setSongInfo, setReloadPlaylists } from "../../../../../../slices/audioVisualiser/songInfoSlice";
import { cleanup } from "../../../MainPagePlayer/AudioVisualiser";
import { setSeekBytes } from "../../../../../../slices/audioVisualiser/seekBytesSlice";
import * as mainAxios from "../../../../mainAxios";

const SongCard = ({ img, author, genre, songName, album }) => {
  const searchResults = useSelector((state) => state.searchResults);
  const dispatch = useDispatch();

  async function playSong(song, index) {
    cleanup();
    let tempSongInfo = structuredClone(song);
    tempSongInfo['songIndex'] = index;
    tempSongInfo['playedFrom'] = 'SEARCH';
    console.log(tempSongInfo);
    dispatch(setSongInfo(tempSongInfo));
    dispatch(setSeekBytes(0));
  }

  return (
    <div className="song-cards" /* style={ { display: !searchResults.length ? 'none' : null } } */>
      { searchResults.songs.map((song, index) => {
        return (<div className="song-card" key={ song['_id'] } >
          <img src={ img } alt="author image" className="author-image" onClick={ async () => { playSong(song, index) } } />
          <div className="song-card-text">
            <p className="author-name-p">{ song.metadata.author }</p>
            <p className="song-name-p">{ song.metadata.songName }</p>
            <p className="genre-p">{ song.metadata.genre }</p>
          </div>
          <img src={ album } alt="album image" className="album-image" />
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
};

export default SongCard;
