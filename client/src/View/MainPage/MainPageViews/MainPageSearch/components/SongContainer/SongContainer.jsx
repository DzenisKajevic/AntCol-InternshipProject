import React from "react";
import { SongCard } from "../SongCard/SongCard";
import "./songContainer.css";

const SongContainer = () => {
  return (
    <section>
      <SongCard
        img="http://placekitten.com/200"
        author="Author Name"
        songName="Song Name"
        album="http://placekitten.com/200"
      />
      <SongCard
        img="http://placekitten.com/200"
        author="Author Name"
        songName="Song Name"
        album="http://placekitten.com/200"
      />
      <SongCard
        img="http://placekitten.com/200"
        author="Author Name"
        songName="Song Name"
        album="http://placekitten.com/200"
      />
      <SongCard
        img="http://placekitten.com/200"
        author="Author Name"
        songName="Song Name"
        album="http://placekitten.com/200"
      />
    </section>
  );
};

export default SongContainer;
