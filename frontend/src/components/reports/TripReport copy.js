import React , {useEffect, useState} from 'react';
import { FaHistory } from "react-icons/fa";
import { IoDocumentAttachOutline } from "react-icons/io5";
import axios from 'axios';
import SidebarMenu from "../SidebarMenu";
import { NavLink } from "react-router-dom";
import { BiLogOut, BiSearch } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import logo from "../sidebaraddbooking/images/buksu-logo.png"
import { FaBars } from "react-icons/fa";

function formatDateTime(dateTimeString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  return new Date(dateTimeString).toLocaleDateString('en-US', options);
}


function TripReport() {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };


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
      icon: <FaRegCalendarCheck className="iconSidebar"/>,
    },
    {
      path: "/tripreport",
      name: "Report",
      icon: <FaRegFileLines  className="iconOut "/>,
    },
    
    {
      path: "/logout",
      name: "Logout",
       icon: <BiLogOut  className="iconL"/>,
      
    },
    ];
  


  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    // Fetch booking data from the server
    const fetchBookingData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/allbook'); // Replace with your actual API endpoint
        const data = response.data;

        // Update the state with the fetched data
        setBookingData(data);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    // Call the fetch function
    fetchBookingData();
  }, []);


  return (
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
        <div className="bars">
          <FaBars onClick={toggle} />
        </div>
      </div>
      <div className="pl-5">
        <img
          alt="logoSide"
          src={logo} // Make sure to import your logo and replace "logo" with the actual variable holding your logo image path
          className="rounded-circle usr-image"
          height={isOpen ? "150" : "40"}
          width={isOpen ? "150" : "40"}
        />
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
    <main>
      <div className='header-wrapper'>
        <div className='header-container'>   
          <h1><strong>Reports</strong>    <p className="userName">SECRETARY</p></h1>
        </div>
      </div>
      <div className='Report-container'>
    <div className='report-wrapper'>
      <div className='TableReportContainer'>
      <table className='reportTable'>
  <thead>
    <tr>
      <th>PLATE NO.</th>
      <th>DEPARTURE</th>
      <th>DESTINATION</th>
      <th>DEPARTURE</th>
      <th>RETURN</th>
      <th>KM</th>
      <th>ACTION</th>
     
    </tr>
  </thead>
  <tbody>
  {bookingData.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.plateNumber}</td>
                    <td>{booking.boundFor}</td>
                    <td>{booking.destination}</td>
                    <td>{formatDateTime(booking.timeForBound)}</td>
                    <td>{formatDateTime(booking.returnDate)}</td>
                    <td>km</td>
                    <td>
                      <FaHistory className='actionBtn' />
                      <IoDocumentAttachOutline className='actionBtn' />
                    </td>
                  </tr>
                ))}
  </tbody>
</table>
      </div>
</div>
    </div>
    </main>
  </div>
  )
}

export default TripReport