import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  momentLocalizer,
  CalendarProps,
} from "react-big-calendar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

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

function Booking() {
  const [scrollableModal, setScrollableModal] = useState(false);
  const [passengerNames, setPassengerNames] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    // driver: "",
    start: null,
    end: null,
  });

  const [allEvents, setAllEvents] = useState([
    {
      title: "Big Meeting",
      driver: "mama",
      allDay: true,
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 1),
    },
  ]);

  const handlePassengerNameChange = (e) => {
    // Split the input value by commas and trim each resulting name
    const names = e.target.value.split(",").map((name) => name.trim());
    setPassengerNames(names);
  };

  const [formData, setFormData] = useState({
    // plateNumber: "",
    // driverName: "",
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

  const handlebookingsub = async (e) => {
    e.preventDefault();

    // Format date values
    const formattedFormData = {
      ...formData,
      timeAndDate: formData.timeAndDate.toISOString(),
      returnDate: formData.returnDate.toISOString(),
      timeForBound: formData.timeForBound,
      passengerNames: passengerNames.join(", "),
    };

    console.log("Start Date:", new Date(formData.timeAndDate));
    console.log("End Date:", new Date(formData.returnDate));

    const newBookingEvent = {
      // title: formData.plateNumber,
      title: "Untitled",
      // driver: formData.driverName,
      start: new Date(formData.timeAndDate), // Convert to Date object
      end: new Date(formData.returnDate), // Convert to Date object
      timeForBound: formData.timeForBound,
    };

    console.log("New Event:", newBookingEvent);

    // Add the new event to the calendar
    setAllEvents([...allEvents, newBookingEvent]);

    console.log("All Events:", allEvents);

    // setNewEvent({ title: "", driver: "", start: null, end: null });
    setNewEvent({ title: "", start: null, end: null });

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
        // Handle success, e.g., clear the form or close the modal
        setFormData({
          // plateNumber: "",
          // driverName: "",
          clientName: "",
          passengerNames: "",
          destination: "WOS",
          boundFor: "",
          timeAndDate: "",
          returnDate: "",
          purpose: "",
          timeForBound: "",
        });
        setScrollableModal(!setScrollableModal);
        window.location.reload();
      } else {
        // Handle error
        console.error("Error while submitting the form");
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
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
        const response = await fetch("http://localhost:3000/allbook");
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
        const response = await fetch("http://localhost:3000/allbook");
        if (response.ok) {
          const data = await response.json();

          // Ensure consistent property names for time and date
          const formattedReminders = data.map((reminder) => ({
            ...reminder,
            start: new Date(reminder.timeAndDate),
            end: new Date(reminder.returnDate),
            type: "reminder", // Adding a type to differentiate reminders
          }));

          setAllReminders(formattedReminders);
        } else {
          console.error("Failed to fetch reminders from the server");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchReminders();
  }, []);

  // Combine reminders and events
  const combinedEvents = [...allEvents];

  // function handleAddEvent() {
  //   setAllEvents([...allEvents, newEvent]);
  // }
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

    setAllEvents([...allEvents, newEvent]);
  }

  const EventComponent = ({ event, height }) => {
    return (
      <div className="EventComponent" style={{ height }}>
        {/* Display only the plate number */}
        <div>{`Plate Number: ${event.plateNumber}`}</div>
      </div>
    );
  };
  
  

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

  const [plateNumbers, setPlateNumbers] = useState([]);
  const [selectedPlateNumber, setSelectedPlateNumber] = useState("");
  const [plateNumberStatuses, setPlateNumberStatuses] = useState({});
  const [selectedPlateNumberStatus, setSelectedPlateNumberStatus] =
    useState("");

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

  useEffect(() => {
    const reminderTimer = setInterval(() => {
      checkUpcomingEvents();
    }, 10 * 60 * 1000); // Check every 10 minutes

    return () => {
      clearInterval(reminderTimer);
    };
  }, [allEvents]);

  const checkUpcomingEvents = () => {
    const now = new Date();
    const upcomingEvents = allEvents.filter((event) => {
      const timeDifference = event.start - now;
      return timeDifference > 0 && timeDifference <= 10 * 60 * 1000; // Upcoming events within 10 minutes
    });

    if (upcomingEvents.length > 0) {
      // Trigger alert or notification
      alert("Upcoming event: " + upcomingEvents[0].title);
    }
  };

  return (
    <>
      <div className="header-wrapper">
        <div className="header-container">
          <h4>
            <strong>BOOKING</strong>{" "}
          </h4>{" "}
          <span className="userName">
            <span className="userName-text">Administrator</span>{" "}
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
                    .slice(0)
                    //.reverse()
                    .sort((a, b) => new Date(a.start) - new Date(b.start)) // Sort events by start date
                    .map((event, index) => (
                      <tr key={event.id}>
                        <td>
                          {`${event.plateNumber} is scheduled to depart ${
                            event.timeForBound
                              ? ` at ${formatTime(event.timeForBound)}`
                              : ""
                          } ${event.boundFor ? ` for ${event.boundFor}` : ""}
        ${
          event.start instanceof Date ? ` on ${event.start.toDateString()}` : ""
        }`}
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
                      <MDBModalTitle>PRE BOOKING</MDBModalTitle>
                      <button
                        className="btn-close"
                        color="none"
                        onClick={() => setScrollableModal(!setScrollableModal)}
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
                        <label>
                          Client Name(Office)
                          <input
                            type="text"
                            className="bookingInput"
                            value={formData.clientName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                clientName: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label>
                          {/* Name of Passengers
                          <input
                            type="text"
                            className="bookingInput"
                            style={{ height: "100px", verticalAlign: "top" }}
                            value={formData.passengerQuantity}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                passengerQuantity: e.target.value,
                              })
                            }
                          /> */}
                           Name of Passengers
                           <input
                                  type="text"
                                  className="bookingInput"
                                  style={{ height: "100px", verticalAlign: "top" }}
                                  value={passengerNames.join(", ")} // Display the names as a comma-separated string
                                  onChange={(e) =>
                                      setPassengerNames(e.target.value.split(",").map(name => name.trim()))
                                  } // Split the input by commas and trim each resulting name
                              />
                        </label>
                        <label>
                          Bound For
                          <select
                            className="bookingInput"
                            value={formData.destination}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                destination: e.target.value,
                              })
                            }
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
                        />
                        <label>
                          Return Date
                          <DatePicker
                            className="bookingInput"
                            selected={formData.returnDate}
                            onChange={(date) =>
                              setFormData({ ...formData, returnDate: date })
                            }
                          />
                        </label>
                        <label>
                          Purpose
                          <input
                            type="text"
                            className="bookingInput"
                            style={{ height: "100px" }}
                            value={formData.purpose}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                purpose: e.target.value,
                              })
                            }
                          />
                        </label>
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
            events={combinedEvents}
            // events={events}
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

            // defaultView={Views.WEEK}
            // view={Views.MONTH}
          />

          {/* AREA NI IF MAG BUTANG SA CALENDAR DKO KABALO IF NAKA MODAL SYA UNSAON PAG BUTANG */}
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
        </div>
      </div>
    </>
  );
}

export default Booking;
