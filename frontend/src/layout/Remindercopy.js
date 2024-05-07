import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

function Reminder() {
  const [allEvents, setAllEvents] = useState([]);
  const [plateData, setPlateData] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState([]);
  const [locationName, setLocationName] = useState(null);
  const [showVecModal, setShowVecModal] = useState(false);
  const [selectedPlateNumber, setSelectedPlateNumber] = useState(null);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);
  const [locationData, setLocationData] = useState(null);

  const handleCancelEdit = () => {
    setShowVecModal(false);
  };

  // Fetch reminders from the server
  // useEffect(() => {
  //   const fetchPlateData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/get-data-plate');
  //       if (response.ok) {
  //         const responseData = await response.json();
  //         console.log(responseData);
  //         if (responseData.data && responseData.data.length > 0) {
  //           const { plateNumber, longitude, latitude } = responseData.data[0];
  //           console.log(plateNumber, longitude, latitude);
  //           setPlateData({ plateNumber, longitude, latitude });
  //         } else {
  //           console.error('Plate data is undefined');
  //           // Set default values if plate data is undefined
  //           setPlateData({ plateNumber: 'N/A', longitude: 'N/A', latitude: 'N/A' });
  //         }
  //       } else {
  //         console.error('Failed to fetch plate data from the server');
  //       }
  //     } catch (error) {
  //       console.error('Error during plate data fetch:', error);
  //     }
  //   };

  //   fetchPlateData();
  // }, []);
  useEffect(() => {
    const fetchVehicleStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/vehiclestatus");
        const vehicleStatusData = response.data;
        // setVehicleStatus(vehicleStatusData);
        setVehicleStatus(
          Array.isArray(vehicleStatusData) ? vehicleStatusData : []
        );
      } catch (error) {
        console.error("Error fetching vehicle status:", error);
      }
    };
    fetchVehicleStatus();
  }, []);

  // const handleFilter = async (selectedFilter) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3000/vehiclestatus?status=${selectedFilter}`
  //     );
  //     const vehicleStatusData = response.data;
  //     setVehicleStatus(
  //       Array.isArray(vehicleStatusData) ? vehicleStatusData : []
  //     );
  //     fetchAllData(selectedFilter);
  //   } catch (error) {
  //     console.error("Error fetching vehicle status:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchAllData("Used"); // Fetch data for initial "Used" status
  // }, []);

  const [latestEvent, setLatestEvent] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [latestCompletedBooking, setLatestCompletedBooking] = useState(null);
  // useEffect(() => {
  // const fetchAllData = async (statusFilter) => {

   // Function to fetch location name using OpenStreetMap Nominatim API
  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );

      if (response.data.display_name) {
        const locationName = response.data.display_name;
        setLocationName(locationName);
        console.log("Location: ", locationName);
      } else {
        console.error("No address found for the provided coordinates.");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const eventResponse = await axios.get("http://localhost:3000/get-latest-data");
        if (eventResponse.status === 200) {
          const latestEventData = eventResponse.data.data; // Assuming the latest data is stored under the 'data' property
          setLatestEvent(latestEventData);
          console.log("Latest Data Fetched:", latestEventData);
    
          const plateNumber = latestEventData.plateNumber;

          // const locationName = await fetchLocationName(latestEventData.latitude, latestEventData.longitude);
          await fetchLocationName(latestEventData.latitude, latestEventData.longitude);
          // console.log("Location: ", locationName);
    
          const completedBookingResponse = await axios.get(`http://localhost:3000/get-latest-completed-booking?plateNumber=${plateNumber}`);
          if (completedBookingResponse.status === 200) {
            const latestCompletedBooking = completedBookingResponse.data.latestCompletedBooking;
            setLatestCompletedBooking(latestCompletedBooking);
            console.log("Latest Completed Booking Fetched:", latestCompletedBooking);
          } else {
            console.error("Failed to fetch latest completed booking data from the server");
          }
        } else {
          console.error("Failed to fetch latest event data from the server");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Fetch latest data initially
    fetchLatestData();
  
    // Poll for latest data every 30 seconds
    const intervalId = setInterval(fetchLatestData, 30000);
  
    // Cleanup function to clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (timeString) => {
    if (!timeString || typeof timeString !== "string") return "Invalid Time";

    const timeParts = timeString.split("+");
    if (timeParts.length !== 2) return "Invalid Time";

    const time = timeParts[0];
    const ampm = parseInt(time.split(":")[0]) >= 12 ? "pm" : "am";
    const formattedTime =
      time
        .split(":")
        .map((part, index) => (index === 0 ? parseInt(part) % 12 || 12 : part))
        .join(":") + ampm;

    return formattedTime;
  };

  const formatTime2 = (timeString) => {
    if (!timeString || typeof timeString !== "string") return "Invalid Time";

    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is zero-based
    const day = date.getDate();

    return `${formattedHours}:${formattedMinutes} ${ampm}, ${year}-${month}-${day}`;
};

  // const handleClick = (event) => {
  //   if (selectedEvent === event) {
  //     // Deselect the event if it's already selected
  //     setSelectedEvent(null);
  //   } else {
  //     setSelectedEvent(event);
  //   }
  // };

  const handleClick = async (plateNumber) => {
    console.log("Plate Number Clicked:", plateNumber);
  
    try {

      const response = await axios.get(
        `http://localhost:3000/get-data-plate/${plateNumber}`
      );
      setLocationData(response.data);

      // Fetch vehicle details
      const detailsResponse = await axios.get(
        `http://localhost:3000/vehicle/details/${plateNumber}`
      );
      const details = detailsResponse.data;
  
      console.log("Details:", details.vehicle.vehicleName);
  
      // Fetch location data
      const locationResponse = await axios.get(
        `http://localhost:3000/get-data-plate/${plateNumber}`
      );
      const locationData = locationResponse.data;
  
      console.log("Latitude:", locationData.latitude);
      console.log("Longitude:", locationData.longitude);
  
      console.log("Details plate:", details.vehicle.vehicleName);
      setSelectedPlateNumber(plateNumber);
      setSelectedVehicleDetails(details);

      console.log("Selected Vehicle Details:", selectedVehicleDetails);
      setShowVecModal(true);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };


  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const filteredEvents = allEvents
    .slice(0)
    .reverse()
    .filter((event) =>
      vehicleStatus.find(
        (status) =>
          status.plateNumber === event.plateNumber && status.status === "Used"
      )
    );
  console.log("Vehicle Status:", vehicleStatus);
  console.log("Filtered Events:", filteredEvents);

  
  return (
    <div>
      <div className="dashboard-Reminder">
        <h6>Vehicle Routes</h6>
    
        <table className="BookingList">
          <tbody className="BookingList">
             {/* {latestEvent ? (
              <tr onClick={toggleExpand}>
                <td>
                  <span style={{ cursor: "pointer" }}>Plate Number {latestEvent.plateNumber}</span>
                  {expanded && (
                    <div>
                      {`Plate Number: ${latestEvent.plateNumber} is currently at Longitude: ${latestEvent.longitude}, Latitude: ${latestEvent.latitude}, Time: ${formatTime(latestEvent.time)}`}
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              <tr>
                <td>No vehicle routes available</td>
              </tr>
            )} */}
            {/* {latestEvent ? (
              <tr onClick={toggleExpand}>
                <td>
                  <span style={{ cursor: "pointer" }}  onClick={() => handleClick(latestEvent.plateNumber)}>Plate Number {latestEvent.plateNumber}</span>
                  {expanded && (
                    <div>
                      {`Plate Number: ${latestEvent.plateNumber} is currently at  ${
                  locationName ? locationName : "Unknown Location"
                  }, Time: ${formatTime(latestEvent.time)}`}
      
                    </div>
                  )}
                   {expanded && latestCompletedBooking && (
                    <div>
                      Latest Booking: <br />
                      {`Driver: ${latestCompletedBooking.name}, Destination: ${latestCompletedBooking.boundFor}, Time and Date: ${formatTime2(latestCompletedBooking.timeAndDate)}`}
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              <tr>
                <td>No vehicle routes available</td>
              </tr>
            )} */}
 {latestEvent ? (
              <tr onClick={toggleExpand}>
                <td>
                <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
    <div style={{ display: "flex", justifyContent: "flex-start", width: "100%", textAlign: "justify" }}>
        <span style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => handleClick(latestEvent.plateNumber)}>
            <strong>Plate Number:</strong> {latestEvent.plateNumber}
        </span>
    </div>
    {expanded && (
        <div style={{ textAlign: "justify" }}>
            <div>
                <strong>Location:</strong> {locationName ? locationName : "Unknown Location"} <br></br> <strong>Time:</strong> {formatTime(latestEvent.time)}
            </div>
            <div>
                {latestCompletedBooking ? (
                    <div>
                    <strong style={{ color: "green" }}>LATEST BOOKING</strong> <br />
                    <strong>Driver:</strong> {latestCompletedBooking.name} <br></br>  <strong>Destination:</strong> {latestCompletedBooking.boundFor} <br></br> <strong>Time and Date:</strong> {formatTime2(latestCompletedBooking.timeAndDate)}
                    </div>
                ) : (
                    <div style={{ color: "red" }}><strong>UNREGISTERED BOOKING</strong></div>
                )}
            </div>
        </div>
    )}
</div>

                </td>
              </tr>
            ) : (
              <tr>
                <td>No vehicle routes available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       {/* Vehicle details MODAL */}
       <div
        className="secondmodal"
        style={{ display: showVecModal ? "block" : "none" }}
      >
        <MDBModal tabIndex="-1" open={showVecModal} setOpen={setShowVecModal}>
          <MDBModalDialog style={{ maxWidth: "750px" }}>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Vehicle's Wherabouts</MDBModalTitle>
                <button
                  className="btn-close"
                  onClick={handleCancelEdit}
                ></button>
              </MDBModalHeader>
              <MDBModalBody>
                {/* Display vehicle name and plate number */}
                {selectedVehicleDetails && (
                  <div>
                    {/* <h5>Vehicle Name: {selectedVehicleDetails.vehicleName}</h5> */}
                    <h5>Plate Number: {selectedPlateNumber}</h5>
                    {latestCompletedBooking && (
                    <div>
                      Latest Booking: <br />
                      {`Driver: ${latestCompletedBooking.name}, Destination: ${latestCompletedBooking.boundFor}, Time and Date: ${formatTime2(latestCompletedBooking.timeAndDate)}`}
                    </div>
                       )}
                    {/* Add your map component here */}
                    {/* Below is just a placeholder */}
                    {locationData && (
                      <div
                        style={{ height: "250px", backgroundColor: "#f0f0f0" }}
                      >
                        {/* Map Component Goes Here */}
                        <iframe
                          width="680"
                          height="360"
                          frameBorder="0"
                          scrolling="no"
                          marginHeight="0"
                          marginWidth="0"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            locationData.latitude
                          )},${encodeURIComponent(
                            locationData.longitude
                          )}&t=&z=17&ie=UTF8&iwloc=B&output=embed`}
                        >
                          <a href="https://www.maps.ie/population/">
                            Calculate population in area
                          </a>
                        </iframe>
                      </div>
                    )}
                  </div>
                )}
              </MDBModalBody>
              <br />
              <br />
              <br />
              <br />
              <MDBModalFooter>
                <button
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Back
                </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </div>
    </div>
  );
}

export default Reminder;
