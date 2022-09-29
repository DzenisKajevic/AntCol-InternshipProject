import React from "react";
import GenreCard from "./components/GenreCard";
import "./mainPageHome.css";

const MainPageHome = () => {
  return (
    <section>
      <h1 className="main-page-home-title">Find your favorite genres</h1>
      <div className="card-container">
        <GenreCard title="Pop" />
        <GenreCard title="Hip-Hop" />
        <GenreCard title="Rock" />
        <GenreCard title="Metal" />
        <GenreCard title="Classical" />
        <GenreCard title="Blue" />
        <GenreCard title="Funk" />
        <GenreCard title="K-Pop" />
      </div>
    </section>
  );
};

export default MainPageHome;
