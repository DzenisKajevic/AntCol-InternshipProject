import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./songCard.css";
import { setSongInfo } from "../../../../../../slices/audioVisualiser/songInfoSlice";
import { cleanup } from "../../../MainPagePlayer/AudioVisualiser";
import { setSeekBytes } from "../../../../../../slices/audioVisualiser/seekBytesSlice";

const SongCard = ({ img, author, genre, songName, album }) => {
  const searchResults = useSelector((state) => state.searchResults);
  const songInfo = useSelector((state) => state.songInfo.song);
  const dispatch = useDispatch();

  return (
    <div className="song-cards" /* style={ { display: !searchResults.length ? 'none' : null } } */>
      { searchResults.songs.map((song, index) => {
        return (<div className="song-card" key={ song['_id'] } onClick={ async () => {
          cleanup();
          let tempSongInfo = structuredClone(song);
          tempSongInfo['songIndex'] = index;
          tempSongInfo['playedFrom'] = 'SEARCH';
          console.log(tempSongInfo);
          dispatch(setSongInfo(tempSongInfo));
          dispatch(setSeekBytes(0));
        } }>
          <img src={ img } alt="author image" className="author-image" />
          <div className="song-card-text">
            <p className="author-name-p">{ song.metadata.author }</p>
            <p className="song-name-p">{ song.metadata.songName }</p>
            <p className="genre-p">{ song.metadata.genre }</p>
          </div>
          <img src={ album } alt="album image" className="album-image" />
        </div>);
      })

      }
    </div>
  );
};

export default SongCard;
