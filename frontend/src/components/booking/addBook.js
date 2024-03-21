import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar as BigCalendar, dateFnsLocalizer, momentLocalizer  } from "react-big-calendar";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import logo from "../sidebaraddbooking/images/buksu-logo.png"
import SidebarMenu from "../SidebarMenu";
import { NavLink } from "react-router-dom";
import { BiLogOut, BiSearch } from "react-icons/bi";
import { AnimatePresence } from "framer-motion";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";

// import 'react-big-calendar/lib/sass/styles';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaRegSquare } from "react-icons/fa6";

import { MDBModal,} from 'mdb-react-ui-kit';
import {
  MDBBtn,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
 
} from 'mdb-react-ui-kit';
import AddBooking from './AddBooking';



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


const locales = {
  "en-US": require("date-fns/locale/en-US"),
  };
  

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});



function AddBook() {
  const [scrollableModal, setScrollableModal] = useState(false);

  const [newEvent, setNewEvent] = useState({ title: "", driver: "", start: null, end: null });

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  
  const [allEvents, setAllEvents] = useState([
    {
      title: "Big Meeting",
      driver:"mama",
      allDay: true,
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 1),
    },
  ]);

  const [formData, setFormData] = useState({
    plateNumber: '',
    driverName: '',
    clientName: '',
    passengerQuantity: '',
    destination: 'WOS',
    boundFor: '',
    timeAndDate: '',
    returnDate: '',
    purpose: '',
    timeForBound: '',
  });

  console.log(formData);


//   const handlebookingsub = async (e) => {
//     e.preventDefault();


//      // Format date values
//   const formattedFormData = {
//     ...formData,
//     timeAndDate: formData.timeAndDate.toISOString(),
//     returnDate: formData.returnDate.toISOString(),
//     timeForBound: formData.timeForBound,
//   };

//   console.log("Start Date:", new Date(formData.timeAndDate));
// console.log("End Date:", new Date(formData.returnDate));

// const newBookingEvent  = {
//   title: formData.plateNumber,
//   driver: formData.driverName,
//   start: new Date(formData.timeAndDate),  // Convert to Date object
//   end: new Date(formData.returnDate),     // Convert to Date object
//   timeForBound: formData.timeForBound,
// };

// console.log("New Event:", newBookingEvent);

// // Add the new event to the calendar
// setAllEvents([...allEvents, newBookingEvent]);


// console.log("All Events:", allEvents);

// setNewEvent({ title: "", driver: "", start: null, end: null });


  
//      // Send a POST request to the server
//      try {
//       const response = await fetch('http://localhost:3000/addbook', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formattedFormData),
//       });
  
//       if (response.ok) {
//         // Handle success, e.g., clear the form or close the modal
//         setFormData({
//           plateNumber: '',
//           driverName: '',
//           clientName: '',
//           passengerQuantity: '',
//           destination: 'WOS',
//           boundFor: '',
//           timeAndDate: '',
//           returnDate: '',
//           purpose: '',
//           timeForBound: '',
//         });
//         setScrollableModal(!setScrollableModal);
//       } else {
//         // Handle error
//         console.error('Error while submitting the form');
//       }
//     } catch (error) {
//       // Handle network error
//       console.error('Network error:', error);
//     }
  
//     };

const handlebookingsub = async (e) => {
  e.preventDefault();

  if (formData.passengerQuantity < 0) {
    alert('Passenger quantity cannot be negative');
    return; // Exit the function early if validation fails
  } else {

      // Format date values
  const formattedFormData = {
    ...formData,
    timeAndDate: formData.timeAndDate.toISOString(),
    returnDate: formData.returnDate.toISOString(),
    timeForBound: formData.timeForBound,
  };

  const newBookingEvent = {
    title: formData.plateNumber,
    driver: formData.driverName,
    start: new Date(formData.timeAndDate),
    end: new Date(formData.returnDate),
    timeForBound: formData.timeForBound,
  };

  // Add the new event to the beginning of the array
  setAllEvents([newBookingEvent, ...allEvents]);

  // Clear the form fields
  setFormData({
    plateNumber: '',
    driverName: '',
    clientName: '',
    passengerQuantity: '',
    destination: 'WOS',
    boundFor: '',
    timeAndDate: '',
    returnDate: '',
    purpose: '',
    timeForBound: '',
  });

  // Send a POST request to the server
  try {
    const response = await fetch('http://localhost:3000/addbook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedFormData),
    });

    if (response.ok) {
      // Handle success, e.g., close the modal
      setScrollableModal(false);
      window.location.reload();
    } else {
      // Handle error
      console.error('Error while submitting the form');
    }
  } catch (error) {
    // Handle network error
    console.error('Network error:', error);
  }

  
  }
  // if (formData.passengerQuantity > 0) {
  //   const newReminderEvent = {
  //     ...newBookingEvent,
  //     type: 'reminder', // Adding a type to differentiate reminders
  //   };
  //   // Add the new event to the beginning of the reminders list
  //   setAllReminders([newReminderEvent, ...allReminders]);
  // }
};




    // Load all events from localStorage when the component mounts
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setAllEvents(storedEvents);
  }, []);

  // Save events to localStorage whenever allEvents changes
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(allEvents));
  }, [allEvents]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/allbook');
        if (response.ok) {
          const data = await response.json();
  
          // Ensure consistent property names for time and date
          const formattedEvents = data.map((event) => ({
            ...event,
            start: new Date(event.timeAndDate),
            end: new Date(event.returnDate),
          }));
  
          setAllEvents(formattedEvents);
        } else {
          console.error('Failed to fetch data from the server');
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };
  
    fetchData();
  }, []);

    // State to manage reminders
    const [allReminders, setAllReminders] = useState([]);

    // Fetch reminders from the server
    useEffect(() => {
      const fetchReminders = async () => {
        try {
          const response = await fetch('http://localhost:3000/allbook');
          if (response.ok) {
            const data = await response.json();

             // Ensure consistent property names for time and date
        const formattedReminders = data.map((reminder) => ({
          ...reminder,
          start: new Date(reminder.timeAndDate),
          end: new Date(reminder.returnDate),
          type: 'reminder', // Adding a type to differentiate reminders
        }));

            setAllReminders(formattedReminders);
          } else {
            console.error('Failed to fetch reminders from the server');
          }
        } catch (error) {
          console.error('Error during fetch:', error);
        }
      };
  
      fetchReminders();
    }, []);
  
    // Combine reminders and events
    const combinedEvents = [...allEvents, ...allReminders];

    

  function handleAddEvent() {

    setAllEvents([...allEvents, newEvent]);
  }

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

const [userRole, setUserRole] = useState('');



  const EventComponent = ({ event }) => {
    return (
      <div className="EventComponent">
      <strong>{event.title}</strong>
      {`${event.plateNumber}`}<br />
      
      <span className="timeForBound">{`${event.timeForBound ? `Time: ${formatTime(event.timeForBound)} -` : ''} ${event.boundFor ? `Bound For: ${event.boundFor}` : ''}`}</span>
    </div>
    );
  };

// const formatTime = (timeString) => {
//   // Check if timeString is null or undefined
//   if (!timeString) {
//     console.log('timeString is null or undefined');
//     return '';
//   }

//   // Assuming timeString is in HH:mm format
//   console.log('timeString:', timeString);
//   const [hours, minutes] = timeString.split(':');
//   const formattedTime = `${parseInt(hours, 10) % 12 || 12}:${minutes} ${parseInt(hours, 10) >= 12 ? 'PM' : 'AM'}`;
//   return formattedTime;
// };


const formatTime = (timeString) => {
  // Check if timeString is null or undefined
  if (!timeString) {
    return '';
  }

  // Extract hours and minutes from the timeString
  const dateObject = new Date(timeString);
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();

  // Format hours and minutes
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const period = hours >= 12 ? 'PM' : 'AM';

  // Construct the formatted time string
  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

  return formattedTime;
};

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
          <h1><strong>Booking</strong>    <p className="userName">SECRETARY</p></h1>
        </div>
      </div>
      <div className='Booking-container'>
        <div className='Container row'>
        
        </div>
        <div className='booking-wrapper'>
  <div className='add_booking_area'>
  <button className='add_booking_area_btn' onClick={() => setScrollableModal(!scrollableModal)}>
    + add booking</button>
<hr/>
<div className="reminder-Head">
<h6>FILTER</h6>
<p><FaRegSquare className="iconRemind"/> View All</p>
</div>

  <div className="reminder-container">
  <div className="reminder-content">
  <tbody className="BookingList">
  {allEvents.slice(0).reverse().map((event, index) => (
    <tr key={event.id}>
      <td>
        {`${event.plateNumber} is scheduled to depart ${
          event.timeForBound ? ` at ${formatTime(event.timeForBound)}` : ''
        } ${event.boundFor ? ` for ${event.boundFor}` : ''}
        ${event.start instanceof Date ? ` on ${event.start.toDateString()}` : ''}`}
      </td>
    </tr>
  ))}
</tbody>
</div>
  </div>

  <MDBModal open={scrollableModal} setOpen={setScrollableModal} tabIndex='-1' className='addB_Container'>
    <div>
    <MDBModalDialog className='addb mt-0 '  size='fullscreen-xl-down' position='right'  >

<MDBModalContent >
  <MDBModalHeader>
    <MDBModalTitle>Add Booking</MDBModalTitle>
    <button
      className='btn-close'
      color='none'
      onClick={() => setScrollableModal(!setScrollableModal)}
     > </button>
  </MDBModalHeader>
  <MDBModalBody className='addbookingscroll'>
  {/* <div>
      <form onSubmit={(e) => e.preventDefault()}>
         <input type="text" placeholder="Add Title" style={{ width: "20%", marginRight: "10px" }} 
        value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} /> 

     <DatePicker placeholderText="Start Date" style={{ marginRight: "10px" }} 
        selected={newEvent.start} onChange={(start) => setNewEvent({ ...newEvent, start })} /> 

         <DatePicker placeholderText="End Date" selected={newEvent.end}
         onChange={(end) => setNewEvent({ ...newEvent, end })} /> 


        <button style={{ marginTop: "10px" }} onClick={handleAddEvent}>
            Add Event
        </button>

        </form>

    </div> */}
   <form id='addbook' onSubmit={handlebookingsub}>
        <label>
            PLATE NUMBER
            <input type="text" className='bookingInput' 
             value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
             />
        </label>
        <label>
         DRIVER’s NAME
            <input type="text" className='bookingInput' value={formData.driverName} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}/>
        </label>
        <label>
            CLIENT NAME
            <input type="text" className='bookingInput' value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} />
        </label>
        <label>
        PASSENGER QUANTITY
            <input type="number" className='bookingInput' value={formData.passengerQuantity} onChange={(e) => setFormData({ ...formData, passengerQuantity: e.target.value })} />
        </label>
        <label>
        DESTINATION
        <select className='bookingInput' value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })}>
            <option value='WOS'>Within Official Station </option>
            <option value='BOS'>Beyond Official Station </option>
        </select>
        </label>
        <label>
            BOUND FOR
            <input type="text" className='bookingInput' value={formData.boundFor} onChange={(e) => setFormData({ ...formData, boundFor: e.target.value })}/>

            Time <br></br>
            <DatePicker
            className='bookingInput'
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            selected={formData.timeForBound}
            onChange={(time) => setFormData({ ...formData, timeForBound: time })}
          />
        </label>

        <label>
         DATE & TIME
         <DatePicker
    className='bookingInput'
    selected={formData.timeAndDate}
    onChange={(date) => setFormData({ ...formData, timeAndDate: date })}
  />
          
        </label>
        
        <label>
        RETURN DATE
        <DatePicker
    className='bookingInput'
    selected={formData.returnDate}
    onChange={(date) => setFormData({ ...formData, returnDate: date })}
  />
         </label>
        <label>
        PURPOSE
            <input type="text" className='bookingInput' style={{ height: '250px' }} value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}/>
        </label>
        <button  className='submitBooking' 
        onClick={handleAddEvent} 
        >Add</button>
        <button className='cancelBooking' onClick={() => setScrollableModal(!setScrollableModal)}>
      Cancel </button>
   
    

    </form>


  </MDBModalBody>

</MDBModalContent>
</MDBModalDialog>
    </div>
 </MDBModal>
</div>

 </div>
 <div   className="rbc-calendar">
  <BigCalendar
  localizer={localizer} 
  events={combinedEvents}
  // events={events} 
  driverAccessor="driver"
  startAccessor="start" 
  endAccessor="end"
  components={{
    event: EventComponent, // Replace EventComponent with your custom event component
  }}
   style={{ height: 500}}
    />
 </div>
        {/* Add your content here */}
      </div>
    </main>
  </div>
);
}

export default AddBook
