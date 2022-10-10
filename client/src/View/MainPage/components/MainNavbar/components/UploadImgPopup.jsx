import React from "react";
import { useEffect, useState } from "react";
import "./uploadImgPopup.css";
import popupStyles from "./uploadImgPopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const UploadImgPopup = (props) => {
  useEffect(() => {
    console.log("upalio sam se");
  }, []);

  return (
    <div
      style={{
        visibility: props.show ? "visible" : "hidden",
        opacity: props.show ? "1" : "0",
      }}
      className={popupStyles.overlay}
    >
      <div className={popupStyles.popup}>
        <h2>{props.title}</h2>
        <span className={popupStyles.close}>&times;</span>
      </div>
      <div className={popupStyles.content}>{props.children}</div>
    </div>
  );
};

// UploadImgPopup.propTypes = {
//   title: Proptypes.string.isRequired,
//   show: Proptypes.bool.isRequired,
//   onClose: Proptypes.func.isRequired,
// };

export default UploadImgPopup;
