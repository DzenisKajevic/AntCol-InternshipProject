import React from "react";
import "./mainContent.css";
import "../../../../variables.css";
import { Outlet } from "react-router-dom";
import MainPageHome from "../../MainPageViews/MainPageHome/MainPageHome";
import { AudioVisualiser, playPause } from '../../MainPageViews/MainPagePlayer/AudioVisualiser';
import songInfoSlice from "../../../../slices/audioVisualiser/songInfoSlice";
import { useDispatch, useSelector } from "react-redux";
import { playSong } from "../../MainPageViews/MainPageSearch/components/SongCard/SongCard";

const MainContent = () => {
  const songInfo = useSelector((state) => state.songInfo.song);
  const playlists = useSelector((state) => state.playlists.playlists);
  const searchResults = useSelector((state) => state.searchResults);
  const favouriteSongs = useSelector((state) => state.favouriteSongs);
  const dispatch = useDispatch();

  const playPrevious = async function (source) {
    console.log(Number(songInfo.songIndex));
    console.log(Number(source.songs.length) - 1);
    if (Number(songInfo.songIndex) > 0) {
      await playSong(source.songs[Number(songInfo.songIndex) - 1], Number(songInfo.songIndex) - 1);
    }
    else await playSong(source.songs[source.songs.length - 1], Number(source.songs.length) - 1);
  }

  const playNext = async function (source) {
    console.log(Number(songInfo.songIndex));
    console.log(Number(source.songs.length) - 1);
    if (songInfo.songIndex < source.songs.length - 1) {
      await playSong(source.songs[Number(songInfo.songIndex) + 1], songInfo.songIndex + 1);
    }
    else await playSong(source.songs[0], 0);

  }

  return (
    <>
      <section className="main-content">

        <button id="previousSong" onClick={ async () => {
          // check where the song is located (search / playlists / favourites / genres)

          console.log(songInfo.playedFrom);
          if (songInfo.playedFrom === "SEARCH") {
            await playPrevious(searchResults);
          }
          else if (songInfo.playedFrom === "FAVOURITES") {
            await playPrevious(favouriteSongs);
          }


        } }>Previous</button>
        <button id="button1" onClick={ playPause }>Play/Pause</button>
        <button id="nextSong" onClick={ async () => {
          if (songInfo.playedFrom === "SEARCH") {
            await playNext(searchResults);
          }
          else if (songInfo.playedFrom === "FAVOURITES") {
            await playNext(favouriteSongs);
          }
        } }>Next</button>
        <Outlet />
      </section>
    </>
  );
};

export default MainContent;
