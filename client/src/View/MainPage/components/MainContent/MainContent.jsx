import React from "react";
import "./mainContent.css";
import "../../../../variables.css";
import { Outlet } from "react-router-dom";
import MainPageHome from "../../MainPageViews/MainPageHome/MainPageHome";

const MainContent = () => {
  return (
    <>
      <section className="main-content">
        <Outlet />
      </section>
    </>
  );
};

export default MainContent;
