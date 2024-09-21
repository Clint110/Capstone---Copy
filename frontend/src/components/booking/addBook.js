import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  momentLocalizer,
  globalizeLocalizer,
} from "react-big-calendar";
import globalize from "globalize";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
// import logo from "../sidebaraddbooking/images/buksu-logo.png";
import SidebarMenu from "../SidebarMenu";
import { NavLink } from "react-router-dom";
import { BiLogOut, BiSearch } from "react-icons/bi";
import { AnimatePresence } from "framer-motion";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../sidebaraddbooking/images/BRAND LOGO-03.png";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { AiFillSchedule } from "react-icons/ai";

// import 'react-big-calendar/lib/sass/styles';

import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaRegSquare } from "react-icons/fa6";

import { MDBModal } from "mdb-react-ui-kit";
import {
  MDBBtn,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
} from "mdb-react-ui-kit";
import AddBooking from "./AddBooking";

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
  const [clientName, setClientName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  
  const localizer = globalizeLocalizer(globalize);

  const [newEvent, setNewEvent] = useState({
    title: "",
    driver: "",
    start: null,
    end: null,
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const [allEvents, setAllEvents] = useState([
    {
      title: "Big Meeting",
      driver: "mama",
      allDay: true,
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 1),
    },
  ]);

  const sampleSuggestions = ["COT", "COB", "CON", "Alumni Relations Unit", "Admission and Testing Unit", "Botanical Gardens and Herbarium", "Bukidnon State University - Baungon Campus", "Bukidnon State University - Cabanglasan Campus", "Bukidnon State University - Damulog Campus", "Bukidnon State University - Impasugong Campus", "Bukidnon State University - Kadingilan Campus",
   "Bukidnon State University - Kalilangan Campus", "Bukidnon State University - Malitbog Campus", "Bukidnon State University - Medina Campus", "Bukidnon State University - San Fernando Campus", "Bukidnon State University - Talakag Campus", "Bukidnon State University - Talisayan Campus", "Bukidnon Studies Center", "BukSU Hostel", "BukSU Hotel Laboratory", "Business Affairs Unit",
    "CAS - Community Development Department", "CAS - Economics Department", "CAS - General Education Courses Department", "CAS - Language and Letters Department", "CAS - MA Sociology", "CAS - Mathematics Department", "CAS - National Sciences Department", "CAS - Philosophy Department", "CAS - Sociology and Social Science", ];


  useEffect(() => {
    const filteredSuggestions = sampleSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(clientName.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  }, [clientName]);

  const handleClientNameChange = (e) => {
    setClientName(e.target.value);
  };

  const [formData, setFormData] = useState({
    clientName: "",
    passengerNames: "",
    destination: "WOS",
    boundFor: "",
    timeAndDate: "",
    returnDate: "",
    purpose: "",
    timeForBound: "",
  });

  console.log(formData);

  const [plateNumbers, setPlateNumbers] = useState([]);
  const [selectedPlateNumber, setSelectedPlateNumber] = useState("");
  const [plateNumberStatuses, setPlateNumberStatuses] = useState({});
  const [selectedPlateNumberStatus, setSelectedPlateNumberStatus] =
    useState("");
    const [passengerNames, setPassengerNames] = useState([]);

  useEffect(() => {
    const fetchPlateNumbers = async () => {
      try {
        const response = await fetch("http://localhost:3000/vehiclestatus");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // const plateNumbers = data.map(vehicle => vehicle.plateNumber);

          const plateNumberStatuses = data;
          const plateNumberArray = Object.keys(data).map((plateNumber) => ({
            plateNumber: plateNumber,
            status: data[plateNumber],
          }));

          console.log(plateNumberArray);
          setPlateNumbers(plateNumberArray);
          setPlateNumberStatuses(plateNumberStatuses);
        } else {
          console.error("Failed to fetch plate numbers from the server");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchPlateNumbers();
  }, []);

  const handlePlateNumberChange = (event) => {
    // setSelectedPlateNumber(event.target.value);
    const selectedPlateNumber = event.target.value;
    setSelectedPlateNumber(selectedPlateNumber);
    setSelectedPlateNumberStatus(plateNumberStatuses[selectedPlateNumber]);
    setFormData({ ...formData, plateNumber: selectedPlateNumber });
  };

  const handlebookingsub = async (e) => {
    e.preventDefault();

    if (formData.passengerQuantity < 0) {
      alert("Passenger quantity cannot be negative");
      return; // Exit the function early if validation fails
    } else {
      // Format date values
      const formattedFormData = {
        ...formData,
        timeAndDate: formData.timeAndDate.toISOString(),
        returnDate: formData.returnDate.toISOString(),
        timeForBound: formData.timeForBound,
        passengerNames: passengerNames.join(", "),
        clientName: clientName,
      };

      const newBookingEvent = {
        title: formData.plateNumber,
        start: new Date(formData.timeAndDate),
        end: new Date(formData.returnDate),
        timeForBound: formData.timeForBound,
      };

      // Add the new event to the beginning of the array
      setAllEvents([newBookingEvent, ...allEvents]);

      // Clear the form fields
      setFormData({
        clientName: "",
        passengerNames: "",
        destination: "WOS",
        boundFor: "",
        timeAndDate: "",
        returnDate: "",
        purpose: "",
        timeForBound: "",
      });

      // Send a POST request to the server
      try {
        const response = await fetch("http://localhost:3000/addbook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedFormData),
        });

        if (response.ok) {
          // Handle success, e.g., close the modal
          setScrollableModal(false);
          window.location.reload();
        } else {
          // Handle error
          console.error("Error while submitting the form");
        }
      } catch (error) {
        // Handle network error
        console.error("Network error:", error);
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
        const response = await fetch("http://localhost:3000/get-all-completedbookings");
        if (response.ok) {
          const data = await response.json();
          console.log("Data2", data);

          // Ensure consistent property names for time and date
          const formattedEvents = data.map((event) => ({
            ...event,
            start: new Date(event.timeAndDate),
            end: new Date(event.returnDate),
          }));

          setAllEvents(formattedEvents);
        } else {
          console.error("Failed to fetch data from the server");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
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
        const response = await fetch("http://localhost:3000/get-all-completedbookings");
        if (response.ok) {
          const data = await response.json();
          console.log("Hello", data);
          const formattedReminders = data.map((reminder) => ({
            ...reminder,
            start: new Date(reminder.timeAndDate),
            end: new Date(reminder.returnDate),
            type: "reminder",
          }));
          setAllReminders(formattedReminders);
          console.log("reminders", formattedReminders);
        } else {
          console.error("Failed to fetch completed bookings from the server");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchReminders();
  }, []);

  // Combine reminders and events
  const combinedEvents = [...allEvents, ...allReminders];

  function handleAddEvent() {
    let clash = false;
    // Loop through all existing events to check for clashes
    for (let i = 0; i < allEvents.length; i++) {
      const d1 = new Date(allEvents[i].start);
      const d2 = new Date(newEvent.start);
      const d3 = new Date(allEvents[i].end);
      const d4 = new Date(newEvent.end);
  
      // Check if there is an overlap
      if ((d1 < d4 && d2 < d3) || (d2 < d3 && d4 < d3)) {
        clash = true;
        break;
      }
    }
  
    if (!clash) {
      // Add the new event to the calendar
      setAllEvents((prevEvents) => [...prevEvents, newEvent]);
    } else {
      console.log("There is a clash with existing events.");
    }
  }

  const routes = [
    {
      path: "/addbook",
      name: "Booking",
      icon: <FaRegCalendarCheck className="iconSidebar" />,
    },
    // {
    //   path: "/scheduletwo",
    //   name: "Schedule",
    //   icon: <AiFillSchedule className="iconSidebar" />,
    // },
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

  const [userRole, setUserRole] = useState("");

  const EventComponent = ({ event, height }) => {
    const fontSize = 10.5; // Define your desired font size here
    const startTime = formatTime(event.timeAndDate);
    return (
      <div className="EventComponent" style={{ height, fontSize: `${fontSize}px` }}>
        <div>
          <strong>{event.title}</strong>
        </div>
        <div>{`Plate Number: `} 
          <span style={{ fontWeight: 'bold' }}>{event.plateNumber}</span>
        </div>
        <div>
          {event.timeForBound ? `Time: ${formatTime(event.timeForBound)} -` : ""} 
          {event.boundFor ? `Bound For: ${event.boundFor}` : ""}
        </div>
        <div>{`Departure Time: `}
          <span style={{ fontWeight: 'bold' }}>{startTime}</span>
        </div>
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
      return "";
    }

    // Extract hours and minutes from the timeString
    const dateObject = new Date(timeString);
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    // Format hours and minutes
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const period = hours >= 12 ? "PM" : "AM";

    // Construct the formatted time string
    const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

    return formattedTime;
  };

  const formatDate = (dateObject) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObject.toLocaleDateString('en-US', options);
};

  const formatDateTime = (timeAndDateString) => {
    if (!timeAndDateString) {
        return "";
    }

    const dateTimeObject = new Date(timeAndDateString);
    const formattedDate = formatDate(dateTimeObject);
    const formattedTime = formatTime(dateTimeObject);

    return `${formattedDate} ${formattedTime}`;
};

  return (
    <div className="main-container">
      <motion.div className={`sidebar `}>
        {/* <div className="top_section">
        <div className="bars">
          <FaBars onClick={toggle} />
        </div>
      </div> */}
        <div className="pl-5">
          <img
            alt="logoSide"
            src={logo} // Make sure to import your logo and replace "logo" with the actual variable holding your logo image path
            className="image"
            height="140"
            width="155"
          />{" "}
          <div className="logo-text">MoniTour</div>
        </div>
        <section className="routes">
          {routes.map((route, index) => {
            if (route.subRoutes) {
              return (
                <SidebarMenu
                  setIsOpen={setIsOpen}
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
                // className="link"
                activeClassName="active"
                className={`link ${
                  route.path === "/logoutsec" ? "logout-link" : ""
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

      
      <main>
        <div className="header-wrapper">
          <div className="header-container">
            <h4>
              <strong>BOOKING</strong>{" "}
            </h4>{" "}
            <span className="userName">
              <span className="userName-text">Secretary</span>{" "}
              <FontAwesomeIcon icon={faCircleUser} className="icon-circle" />
            </span>
          </div>
        </div>
        <div className="Booking-container">
          <div className="Container row"></div>
          <div className="booking-wrapper">
            <div className="add_booking_area">
              <button
                className="add_booking_area_btn"
                onClick={() => setScrollableModal(!scrollableModal)}
              >
                + PRE BOOKING
              </button>
              <hr />
              <div className="reminder-Head">
                <h6>SCHEDULES</h6>
              </div>

              <div className="reminder-container" style={{ height: "390px" }}>
              <div className="reminder-content">
                <tbody className="BookingList">
                  {allEvents
                    .filter((event) => {
                      const returnDate = new Date(event.returnDate); // Convert return date to a Date object
                      const now = new Date(); // Get the current time

                      console.log("Return Date:", returnDate);
                      console.log("Current Date:", now);

                      // Only include events where the return date is in the future
                      return returnDate > now; // Exclude today
                    })
                    .sort((a, b) => new Date(a.start) - new Date(b.start)) // Sort events by start date
                    .map((event, index) => (
                      <tr key={event.id}>
                        <td style={{ textAlign: "left", textJustify: "inter-word" }}>
                          <strong>{`${event.plateNumber}`}</strong>
                          {` is scheduled to depart`}
                          <strong>
                            {`${event.timeAndDate ? ` at ${formatDateTime(event.timeAndDate)}` : ""}`}
                            {`${event.boundFor ? ` for ${event.boundFor}` : ""}`}
                            {`${event.start instanceof Date ? ` on ${event.start.toDateString()}` : ""}`}
                          </strong>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </div>
              </div>

              <MDBModal
                open={scrollableModal}
                setOpen={setScrollableModal}
                tabIndex="-1"
                className="addB_Container"
              >
                <div>
                  <MDBModalDialog
                    className="addb mt-0 "
                    size="fullscreen-xl-down"
                    position="right"
                  >
                    <MDBModalContent>
                      <MDBModalHeader>
                        <MDBModalTitle>Pre Booking</MDBModalTitle>
                        <button
                          className="btn-close"
                          color="none"
                          onClick={() =>
                            setScrollableModal(!setScrollableModal)
                          }
                        >
                          {" "}
                        </button>
                      </MDBModalHeader>
                      <MDBModalBody className="addbookingscroll">
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
                        <form id="addbook" onSubmit={handlebookingsub}>
                          {/* <label>
                            Plate Number
                            
                            <select
                              className="bookingInput"
                              value={selectedPlateNumber}
                              onChange={handlePlateNumberChange}
                              required
                            >
                              <option value="" disabled>
                                Select Plate Number
                              </option>
                              {plateNumbers.map(({ plateNumber }) => (
                                <option key={plateNumber} value={plateNumber}>
                                  {plateNumber}
                                </option>
                              ))}
                            </select>
                            <p>Status: {selectedPlateNumberStatus}</p>
                          </label> */}
                          {/* <label>
         DRIVER’s NAME
            <input type="text" className='bookingInput' value={formData.driverName} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}/>
        </label> */}
                           <label style={{ position: 'relative' }}>
                            Client Name(Office)
                            <input
                              type="text"
                              className="bookingInput"
                              value={clientName}
                              onChange={handleClientNameChange}
                            />
                           {clientName && (
                            <ul style={{ position: 'absolute', top: '100%', left: 0, zIndex: 999, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', listStyle: 'none', margin: 0, paddingInlineStart: 0 }}>
                              {suggestions.map((suggestion, index) => (
                                (clientName.toLowerCase() !== suggestion.toLowerCase()) && (
                                  <li key={index} onClick={() => setClientName(suggestion)} style={{ paddingLeft: '8px', whiteSpace: 'nowrap' }}>
                                    {suggestion}
                                  </li>
                                )
                              ))}
                            </ul>
                          )}
                          </label>
                          <label>
                          Name of Passengers
                          <textarea
                              className="bookingInput"
                              style={{ 
                                height: "100px",
                                width: "220%",
                                boxSizing: "border-box",
                                padding: "8px",
                                border: "1px solid #ccc",
                                resize: "vertical", // Allows the user to resize the textarea vertically
                                overflow: "auto", // Allows scrolling if content exceeds the height
                              }}
                              value={passengerNames.join(", ")} // Display the names as a comma-separated string
                              onChange={(e) =>
                                setPassengerNames(e.target.value.split(",").map(name => name.trim()))
                              } // Split the input by commas and trim each resulting name
                            />
                          </label>
                          <label>
                            Bound For:
                            <select
                              className="bookingInput"
                              value={formData.destination}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  destination: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="WOS">
                                Within Official Station{" "}
                              </option>
                              <option value="BOS">
                                Beyond Official Station{" "}
                              </option>
                            </select>
                          </label>
                          <label>
                            Destination
                            <input
                              type="text"
                              className="bookingInput"
                              value={formData.boundFor}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  boundFor: e.target.value,
                                })
                              }
                              required
                            />
                          </label>
                          <label>
                            Date
                            <DatePicker
                              className="bookingInput"
                              selected={formData.timeAndDate}
                              onChange={(date) =>
                                setFormData({ ...formData, timeAndDate: date })
                              }
                              minDate={
                                new Date(
                                  new Date().getFullYear(),
                                  new Date().getMonth(),
                                  1
                                )
                              } // Set minDate to the first day of the current month
                              required
                            />
                          </label>
                          Time <br></br>
                          <DatePicker
                            className="bookingInput"
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            selected={formData.timeForBound}
                            onChange={(time) =>
                              setFormData({ ...formData, timeForBound: time })
                            }
                            required
                          />
                          <label>
                            Return Date
                            <DatePicker
                              className="bookingInput"
                              selected={formData.returnDate}
                              onChange={(date) =>
                                setFormData({ ...formData, returnDate: date })
                              }
                              minDate={
                                new Date(
                                  new Date().getFullYear(),
                                  new Date().getMonth(),
                                  1
                                )
                              } // Set minDate to the first day of the current month
                              required
                            />
                          </label>
                          <label>
                        Purpose
                            <textarea
                              className="bookingInput"
                              style={{ 
                                height: "100px",
                                width: "220%", // Ensure it takes full width
                                boxSizing: "border-box", // Include padding and border in the width and height
                                padding: "8px",
                          
                                border: "1px solid #ccc",
                                resize: "vertical", // Allows vertical resizing
                                overflow: "auto", // Show scrollbar if needed
                              }}
                              value={formData.purpose}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  purpose: e.target.value,
                                })
                              }
                              required
                            />
                        </label>
                        <div>
                          <button
                            className="submitBooking"
                            onClick={handleAddEvent}
                          >
                            Add
                          </button>
                        
                          <button
                            className="cancelBooking"
                            onClick={() =>
                              setScrollableModal(!setScrollableModal)
                            }
                          >
                            Cancel{" "}
                          </button>
                          </div>
                        </form>
                      </MDBModalBody>
                    </MDBModalContent>
                  </MDBModalDialog>
                </div>
              </MDBModal>
            </div>
          </div>
          <div className="rbc-calendar">
              <BigCalendar
                localizer={localizer}
                events={combinedEvents
                  .filter((event) => {
                    const eventDate = new Date(event.start);
                    const now = new Date();
                    return eventDate >= now; // Filter out past events
                  })
                  .sort((a, b) => new Date(a.start) - new Date(b.start)) // Sort events by start date
                }
                driverAccessor="driver"
                startAccessor="start"
                endAccessor="end"
                components={{
                  event: (props) => <EventComponent {...props} height={20} />, // Set the height here
                }}
                style={{
                  height: "77.5vh", // 95% of the viewport height
                  width: "63vw", // 70% of the viewport width
                }}
                defaultView={"month"}
                views={["month", "week", "day"]}
              />
            </div>
          {/* Add your content here */}
        </div>
      </main>
    </div>
  );
}

export default AddBook;
