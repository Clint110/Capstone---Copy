import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
// import logo from "../images/buksu-new-logo.png";
import logo from "../images/BRAND LOGO-03.png";
import { FaRegFileLines } from "react-icons/fa6";
import { BiLogOut, BiSearch } from "react-icons/bi";
import { GrMap } from "react-icons/gr";
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuMonitorDot } from "react-icons/lu";
import { FaHouse } from "react-icons/fa6";
import { FaBook } from "react-icons/fa6";
import { AiFillSchedule } from "react-icons/ai";
import { MdMonitor } from "react-icons/md";
import { TbReport } from "react-icons/tb";
import { TbReportAnalytics } from "react-icons/tb";

const Sidebar = ({ children, isAddbooker, isAdmin }) => {
  console.log(
    "User role:",
    isAdmin ? "Admin" : isAddbooker ? "Addbookerni" : "Unknown"
  );

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

  // Define routes based on user type
  const adminRoutes = [
    {
      path: "/dashboard",
      name: "Dashboard",
      // icon: <TbLayoutDashboard className="iconSidebar" />,
      icon: <FaHouse className="iconSidebar" />,
    },
    {
      path: "/booking",
      name: "Booking",
      // icon: <FaRegCalendarCheck className="iconSidebar" />,
      icon: <FaBook className="iconSidebar" />,
    },
    {
      path: "/drivers",
      name: "Drivers",
      icon: <AiFillSchedule className="iconSidebar" />,
      // icon: <RiCalendarScheduleFill className="iconSidebar" />,
    },
    {
      path: "/monitoring",
      name: "Monitoring",
      // icon: <LuMonitorDot className="iconSidebar" />,
      icon: <MdMonitor className="iconSidebar" />,
    },
    {
      path: "/reports",
      name: "Report",
      icon: <TbReportAnalytics className="iconOut " />,
      // icon: <FaRegFileLines className="iconOut " />,
    },
    {
      path: "/logout",
      name: "Logout",
      icon: <BiLogOut className="iconL" />,
    },
  ];

  const addbookerRoutes = [
    {
      path: "/addbook",
      name: "Booking",
      icon: <FaRegCalendarCheck className="iconSidebar" />,
    },
    {
      path: "/reports",
      name: "Report",
      icon: <FaRegFileLines className="iconOut " />,
    },
    {
      path: "/logout",
      name: "Logout",
      icon: <BiLogOut className="iconL" />,
    },
  ];

  const routes = isAddbooker ? addbookerRoutes : adminRoutes;

  return (
    <>
      <div className="main-container">
        <motion.div className={`sidebar `}>
          {/* <div className="top_section">
            <div className="bars">
              <FaBars />
            </div>
          </div> */}
          <div className="pl-5">
            <img
              alt="logoSide"
              src={logo}
              className="image"
              height="140"
              width="155"
            ></img>
            <div className="logo-text font-weight-bold">MoniTour</div>
          </div>
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    route={route}
                    showAnimation={showAnimation}
                    key={index}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  activeClassName="active"
                  className={`link ${
                    route.path === "/logout" ? "logout-link" : ""
                  }`}
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    <motion.div
                      variants={showAnimation}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="link_text"
                    >
                      {route.name}
                    </motion.div>
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Sidebar;
