import React from "react";
import "./uploadImgPopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const UploadImgPopup = (props) => {
  return props.trigger ? (
    <div className="upload-popup">
      <div className="upload-popup-inner">
        <button className="close-icon-button">
          <FontAwesomeIcon icon={faXmark} className="close-icon" />
        </button>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default UploadImgPopup;
