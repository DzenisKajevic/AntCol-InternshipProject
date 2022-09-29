import React from "react";
import "./mainContent.css";
import "../../../../variables.css";
import { Outlet } from "react-router-dom";

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
