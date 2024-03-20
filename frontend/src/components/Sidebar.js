import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
import logo from "../images/buksu-logo.png"
import { FaRegFileLines } from "react-icons/fa6";
import { BsFuelPumpDiesel } from "react-icons/bs";
import { GrMap } from "react-icons/gr";


import { TbLayoutDashboard } from "react-icons/tb";
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuMonitorDot } from "react-icons/lu";
import { BiLogOut, BiSearch } from "react-icons/bi";


// const routes = [ {
//   path: "/dashboard",
//   name: "Dashboard",
//   icon:  <TbLayoutDashboard className="iconSidebar"/>,
// },
// {
//   path: "/booking",
//   name: "Booking",
//   icon: <FaRegCalendarCheck className="iconSidebar"/>,
// },

// {
//   path: "/monitoring",
//   name: "Monitoring",
//    icon: <LuMonitorDot className="iconSidebar"/>,
  
// },
// {
//   path: "/reports",
//   name: "Report",
//   icon: <FaRegFileLines  className="iconOut "/>,
// //   subRoutes: [
// //     {
// //       path: "/reportTrip",
// //       name: "Trip Report",
// //        icon: <GrMap  className="iconOut "/>,
// //     }, 
// //  {
// //         path: "/report-fuel_consumption",
// //         name: "Fuel",
// //          icon: <BsFuelPumpDiesel  className="iconOut "/>,
// //       }
// //   ],
// },

// {
//   path: "/logout",
//   name: "Logout",
//    icon: <BiLogOut  className="iconL"/>,
  
// },
// ];

const Sidebar = ({ children, isAddbooker, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);


  console.log("User role:", isAdmin ? "Admin" : (isAddbooker ? "Addbookerni" : "Unknown"));

  // const inputAnimation = {
  //   hidden: {
  //     width: 0,
  //     padding: 0,
  //     transition: {
  //       duration: 0.2,
  //     },
  //   },
  //   show: {
  //     width: "140px",
  //     padding: "5px 15px",
  //     transition: {
  //       duration: 0.2,
  //     },
  //   },
  // };

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
      icon: <TbLayoutDashboard className="iconSidebar" />,
    },
    {
      path: "/booking",
      name: "Booking",
      icon: <FaRegCalendarCheck className="iconSidebar" />,
    },
    {
      path: "/monitoring",
      name: "Monitoring",
      icon: <LuMonitorDot className="iconSidebar" />,
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
  

  const routes = isAddbooker ? addbookerRoutes: adminRoutes;

  return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "200px" : "75px",

            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar `}
        >
          
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                >
                  
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars">
              <FaBars onClick={toggle} />
            </div>

          </div>
           {/*<div className="search">
            <div className="search_icon">
              <BiSearch />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.input
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={inputAnimation}
                  type="text"
                  placeholder="Search"
                />
              )}
            </AnimatePresence>
          </div> */}
          <div className="pl-5">
        <img
            alt="logoSide"
              src={logo}
              className="rounded-circle usr-image"
              height={isOpen  ? "150" : "40"}
              width={isOpen  ? "150" : "40"}
            ></img>
          </div>
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  // className="link"
                  activeClassName="active"
                  className={`link ${route.path === '/logout' ? 'logout-link' : ''}`}
                  
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                       
                      >
                        {route.name}
                      </motion.div>
                    )}
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

export default Sidebar