import React from "react";
import GenreCard from "./components/GenreCard";
import "./mainPageHome.css";

const MainPageHome = () => {
  return (
    <section>
      <h1 className="main-page-home-title">Find your favorite genres</h1>
      {/* old cards */}
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

      {/* new cards  */}
      {/* <div class="container">
        <div class="box">
          <span></span>
          <div class="content">
            <h2>Card one</h2>
          </div>
        </div>
        <div class="box">
          <span></span>
          <div class="content">
            <h2>Card two</h2>
          </div>
        </div>
        <div class="box">
          <span></span>
          <div class="content">
            <h2>Card Three</h2>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default MainPageHome;
