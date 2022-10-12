import React from "react";
import { useState, useRef, useEffect } from "react";
import "./musicPlayer.css";
import {
  faArrowLeft,
  faArrowRight,
  faPlay,
  faPause,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const musicPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  useEffect(() => {
    const seconds = Math.floor(musicPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [musicPlayer?.current?.loadedmetadata, musicPlayer?.current?.readyState]);

  const calculateTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(sec % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes} : ${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      musicPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      musicPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = musicPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    musicPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "0",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backFifteen = () => {
    progressBar.current.value = Number(progressBar.current.value - 15);
    changeRange();
  };

  const forwardFifteen = () => {
    progressBar.current.value = Number(progressBar.current.value + 5);
    changeRange();
  };

  return (
    <section className="music-player">
      <audio
        ref={ musicPlayer }
        src="https://file-examples.com/storage/fe783a5cbb6323602a28c66/2017/11/file_example_MP3_700KB.mp3"
        preload="metadata"
      ></audio>
      <button className="forward-backward" onClick={ backFifteen }>
        <FontAwesomeIcon icon={ faArrowLeft } />
        15
      </button>
      <button className="play-pause" onClick={ togglePlayPause }>
        { isPlaying ? (
          <FontAwesomeIcon icon={ faPause } />
        ) : (
          <FontAwesomeIcon icon={ faPlay } />
        ) }
      </button>
      <button className="forward-backward" onClick={ forwardFifteen }>
        15
        <FontAwesomeIcon icon={ faArrowRight } />
      </button>

      <div className="current-time">{ calculateTime(currentTime) }</div>
      <div>
        <input
          type="range"
          className="progress-bar"
          defaultValue="0"
          ref={ progressBar }
          onChange={ changeRange }
        />
      </div>
      <div className="duration">
        { duration && !isNaN(duration) && calculateTime(duration) }
      </div>
      <NavLink to="/main-page/audio-player" className="expand-icon">
        <FontAwesomeIcon icon={ faExpand } />
      </NavLink>
    </section>
  );
};

export default MusicPlayer;
