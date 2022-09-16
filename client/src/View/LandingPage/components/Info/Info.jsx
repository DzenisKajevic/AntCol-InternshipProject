import React from "react";
import "./info.css";
import "../../../../variables.css";

const Info = () => {
  return (
    <section className="info-container">
      <h2 className="info-title">Download and listen to music while offline</h2>
      <p className="info-p">
        Listen to music wherever you are and whenever you want. You can download
        music and are allowed to listen to it even offline.
        <br />
        For <span className="highlighted-text">Subscribed</span> users only.
      </p>
      <button className="subscribe-button shine">Subscribe Now</button>
    </section>
  );
};

export default Info;
