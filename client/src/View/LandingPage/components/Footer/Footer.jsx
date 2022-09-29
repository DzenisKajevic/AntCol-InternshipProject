import React from "react";
import "./footer.css";
import "../../../../variables.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-links-container">
        <div className="footer-links-content">
          <ul className="footer-ul">
            <h4>Title1</h4>
            <a href="">link1</a>
            <a href="">link2</a>
            <a href="">link3</a>
          </ul>
        </div>
        <div className="footer-links-content">
          <ul className="footer-ul">
            <h4>Title2</h4>
            <a href="">link4</a>
            <a href="">link5</a>
            <a href="">link6</a>
          </ul>
        </div>
        <div className="sm-container">
          <span className="sm-icons-styling">
            <i className="fa-brands fa-instagram fa-2xl fa-bounce"></i>
          </span>
          <span className="sm-icons-styling">
            <i className="fa-brands fa-twitter fa-2xl fa-bounce"></i>
          </span>
          <span className="sm-icons-styling">
            <i className="fa-brands fa-facebook fa-2xl fa-bounce"> </i>
          </span>
        </div>
      </div>
      <div className="breakline"></div>
      <div className="footer-bottom-container">
        <select className="language-form" name="Languages" id="languages">
          <option value="English">English</option>
          <option value="Deutsch">Deutsch</option>
          <option value="Francais">Francais</option>
          <option value="Espanol">Espanol</option>
        </select>
        <img
          className="footer-music-app-logo"
          src="./assets/app-images/music-app-logo.png"
          alt="app logo"
        />
        <p className="copyright-p">2022 &copy; AntCol Music App</p>
      </div>
    </footer>
  );
};

export default Footer;
