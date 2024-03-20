import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenuaddname from "../sidebaraddbooking/SidebarMenuaddname";
import logo from "../sidebaraddbooking/images/buksu-logo.png";
import { FaRegFileLines } from "react-icons/fa6";
import { BsFuelPumpDiesel } from "react-icons/bs";
import { GrMap } from "react-icons/gr";


import { TbLayoutDashboard } from "react-icons/tb";
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuMonitorDot } from "react-icons/lu";
import { BiLogOut, BiSearch } from "react-icons/bi";


const routes = [ 
{
  path: "/addbook",
  name: "Booking",
  icon: <FaRegCalendarCheck className="iconSidebar"/>,
},
{
  path: "/reports",
  name: "Report",
  icon: <FaRegFileLines  className="iconOut "/>,
},

{
  path: "/logoutaddbook",
  name: "Logout",
   icon: <BiLogOut  className="iconL"/>,
  
},
];

const Sidebaraddname = ({ children }) => {
  // console.log("Children content:", children);

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

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
                  <SidebarMenuaddname
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
                  className={`link ${route.path === '/logoutaddbook' ? 'logout-link' : ''}`}
                  
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

export default Sidebaraddname