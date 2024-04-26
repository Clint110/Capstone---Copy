import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";

const HeaderReport = () => {
  return (
    <div className="header-wrapper">
      <div className="header-container">
        <h4>
          <strong>DRIVERS</strong>{" "}
        </h4>{" "}
        <span className="userName">
          <span className="userName-text">Administrator</span>{" "}
          <FontAwesomeIcon icon={faCircleUser} className="icon-circle" />
        </span>
      </div>
    </div>
  );
};

export default HeaderReport;
