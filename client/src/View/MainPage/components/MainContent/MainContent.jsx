import React from "react";
import "./mainContent.css";
import "../../../../variables.css";
import { Outlet } from "react-router-dom";
import MainPageHome from "../../MainPageViews/MainPageHome/MainPageHome";
import {
  AudioVisualiser,
  playPause,
} from "../../MainPageViews/MainPagePlayer/AudioVisualiser";
import songInfoSlice from "../../../../slices/audioVisualiser/songInfoSlice";
import { useDispatch, useSelector } from "react-redux";
import { playSong } from "../../MainPageViews/MainPageSearch/components/SongCard/SongCard";
import UploadImgPopup from "../MainNavbar/components/UploadImgPopup";

const MainContent = () => {
  const songInfo = useSelector((state) => state.songInfo.song);
  const playlists = useSelector((state) => state.playlists.playlists);
  const searchResults = useSelector((state) => state.searchResults);
  const favouriteSongs = useSelector((state) => state.favouriteSongs);
  const dispatch = useDispatch();
  const map1 = new Map();

  const playPrevious = async function (source, sourceMaxIndex) {

    let song = map1.get(source);
    if (Number(songInfo.songIndex) > 0) {
      await playSong(map1.get(source), Number(songInfo.songIndex) - 1);
    }
    else {
      await playSong(map1.get(source + "Final"), sourceMaxIndex);
    }
  }

  const playNext = async function (source, sourceMaxIndex) {
    console.log(songInfo.songIndex, sourceMaxIndex);
    if (songInfo.songIndex < sourceMaxIndex) {
      await playSong(map1.get(source), songInfo.songIndex + 1);
    }
    else await playSong(map1.get(source + "First"), 0);

  }

  return (
    <>
      <section className="main-content">
        <button
          id="previousSong"
          onClick={ async () => {
            // check where the song is located (search / playlists / favourites / genres)

            console.log(songInfo.playedFrom);
            let song = {};
            if (songInfo.playedFrom === "SEARCH") {
              if (Number(songInfo.songIndex - 1) >= 0) {
                song = { ...searchResults.songs[Number(songInfo.songIndex) - 1], playedFrom: "SEARCH" }
                map1.set('searchResultsPrevious', song);
              }
              else {
                song = { ...searchResults.songs[Number(searchResults.songs.length) - 1], playedFrom: "SEARCH" }
                map1.set('searchResultsPreviousFinal', song);
              }
              await playPrevious("searchResultsPrevious", Number(searchResults.songs.length) - 1);
            }
            else if (songInfo.playedFrom === "FAVOURITES") {
              console.log("ADLALSDM", songInfo.songIndex);
              if (Number(songInfo.songIndex - 1) >= 0) {
                song = { ...favouriteSongs.songs[Number(songInfo.songIndex) - 1].fileId, playedFrom: "FAVOURITES" }
                map1.set('favouriteSongsPrevious', song);
              }
              else {
                song = { ...favouriteSongs.songs[favouriteSongs.songs.length - 1].fileId, playedFrom: "FAVOURITES" }
                map1.set('favouriteSongsPreviousFinal', song);
              }
              await playPrevious("favouriteSongsPrevious", Number(favouriteSongs.songs.length) - 1);
            }


          } }>Previous</button>
        <button id="button1" onClick={ playPause }>Play/Pause</button>
        <button id="nextSong" onClick={ async () => {
          let song = {};
          if (songInfo.playedFrom === "SEARCH") {
            if (songInfo.songIndex < searchResults.songs.length - 1) {
              song = { ...searchResults.songs[Number(songInfo.songIndex) + 1], playedFrom: "SEARCH" }
              map1.set('searchResultsNext', song);
            }
            else {
              song = { ...searchResults.songs[0], playedFrom: "SEARCH" };
              map1.set('searchResultsNextFirst', song);
            }
            await playNext("searchResultsNext", searchResults.songs.length - 1);
          }
          else if (songInfo.playedFrom === "FAVOURITES") {
            if (songInfo.songIndex < favouriteSongs.songs.length - 1) {
              song = { ...favouriteSongs.songs[Number(songInfo.songIndex) + 1].fileId, playedFrom: "FAVOURITES" }
              map1.set('favouriteSongsNext', song);
            }
            else {
              song = { ...favouriteSongs.songs[0].fileId, playedFrom: "FAVOURITES" }
              map1.set('favouriteSongsNextFirst', song);
            }
            await playNext("favouriteSongsNext", favouriteSongs.songs.length - 1);
          }
        } }>Next</button>
        <Outlet />
      </section>
    </>
  );
};

export default MainContent;
