import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import SidebarMenu from "../SidebarMenu";
import { NavLink } from "react-router-dom";
import { BiLogOut, BiSearch } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import logo from "../sidebaraddbooking/images/buksu-new-logo.png";
import { AiFillSchedule } from "react-icons/ai";

function Scheduletwo() {
  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,

      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      padding: "0px 15px",
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  const routes = [
    {
      path: "/addbook",
      name: "Booking",
      icon: <FaRegCalendarCheck className="iconSidebar" />,
    },
    {
      path: "/scheduletwo",
      name: "Schedule",
      icon: <AiFillSchedule className="iconSidebar" />,
    },
    {
      path: "/tripreport",
      name: "Report",
      icon: <FaRegFileLines className="iconOut " />,
    },

    {
      path: "/logoutsec",
      name: "Logout",
      icon: <BiLogOut className="iconL" />,
    },
  ];
  return (
    <>
      <div className="header-wrapper">
        <div className="header-container">
          <h4>
            <strong>SCHEDULE</strong>{" "}
          </h4>{" "}
          <span className="userName">
            <span className="userName-text">Administrator</span>{" "}
            <FontAwesomeIcon icon={faCircleUser} className="icon-circle" />
          </span>
        </div>
      </div>
    </>
  );
}

export default Scheduletwo;
