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
  const [plateDataList, setPlateDataList] = useState([]);
  const [plateData1, setPlateData1] = useState(null);
  const [plateData2, setPlateData2] = useState(null);
  const [locationName1, setLocationName1] = useState(null);
  const [locationName2, setLocationName2] = useState(null);
  const [selectedPlateData, setSelectedPlateData] = useState(null);
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



  const [latestEvent, setLatestEvent] = useState(null);
  // const [expanded, setExpanded] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [latestCompletedBooking, setLatestCompletedBooking] = useState(null);
  // useEffect(() => {
  // const fetchAllData = async (statusFilter) => {

  //new
  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
  
      if (response.data && response.data.display_name) {
        const locationName = response.data.display_name;
        console.log("Fetched location name:", locationName); // Log fetched location name
        return locationName;
      } else {
        console.error("No address found for the provided coordinates.");
        return "Unknown Location";
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Unknown Location";
    }
  };

   // Function to fetch location name using OpenStreetMap Nominatim API
  // const fetchLocationName = async (latitude, longitude) => {
  //   try {
  //     const response = await axios.get(
  //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  //     );

  //     if (response.data.display_name) {
  //       const locationName = response.data.display_name;
  //       setLocationName(locationName);
  //       console.log("Location: ", locationName);
  //     } else {
  //       console.error("No address found for the provided coordinates.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching location name:", error);
  //   }
  // };

  const fetchLatestDataForPlate = async (plateNumber) => {
    try {
      console.log(`Fetching data for plate: ${plateNumber}`);
      const response = await axios.get(`http://localhost:3000/get-data-plate/${plateNumber}`);
      const data = response.data.data;

      if (data && data.latitude && data.longitude) {
        const locationName = await fetchLocationName(data.latitude, data.longitude);
        return { ...data, plateNumber, locationName };
      } else {
        console.warn(`No data or missing location for plate: ${plateNumber}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching data for plate: ${plateNumber}`, error);
      return null;
    }
  };

  const fetchLatestCompletedBooking = async (plateNumber) => {
    try {
      console.log(`Fetching latest completed booking for plate: ${plateNumber}`);
      const response = await axios.get(`http://localhost:3000/get-latest-completed-booking?plateNumber=${plateNumber}`);
      const latestBooking = response.data.latestCompletedBooking;
      
      if (latestBooking) {
        console.log(`Found latest booking for ${plateNumber}:`, latestBooking);
      } else {
        console.log(`No latest booking found for ${plateNumber}`);
      }
      
      return latestBooking;
    } catch (error) {
      console.error(`Error fetching latest completed booking for plate: ${plateNumber}`, error);
      return null;
    }
  };

  // const fetchLatestDataForPlate = async (plateNumber, setPlateData, setLocationName) => {
  //   try {
  //     console.log(`Fetching data for plate: ${plateNumber}`);
  //     const response = await axios.get(`http://localhost:3000/get-data-plate/${plateNumber}`);
  
  //     if (response.status === 200) {
  //       const data = response.data.data;
  //       console.log(`Data for plate number ${plateNumber}:`, data); // Log fetched data for each plate number
  
  //       if (!data) {
  //         console.error(`No data found for plate: ${plateNumber}`);
  //         return;
  //       }
  
  //       // Check if latitude and longitude are present
  //       if (typeof data.latitude === 'undefined' || typeof data.longitude === 'undefined') {
  //         console.error(`Latitude or longitude is missing for plate: ${plateNumber}`);
  //         return;
  //       }
  
  //       setPlateData(data);
  
  //       // Fetch and set location name
  //       const locationName = await fetchLocationName(data.latitude, data.longitude);
  //       setLocationName(locationName);
  //     } else {
  //       console.error(`Failed to fetch data for plate: ${plateNumber} with status code ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error(`Error fetching data for plate: ${plateNumber}`, error);
  //   }
  // };

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const plateNumbers = ["JHGF324", "LAB4405"];
        const plateDataPromises = plateNumbers.map(async (plateNumber) => {
          const plateData = await fetchLatestDataForPlate(plateNumber);
          const latestBooking = await fetchLatestCompletedBooking(plateNumber);
          
          return { ...plateData, latestBooking };
        });

        const plateDataList = await Promise.all(plateDataPromises);
        console.log("Fetched plate data list:", plateDataList);
        setPlateDataList(plateDataList);
      } catch (error) {
        console.error("Error fetching plate data:", error);
      }
    };

    fetchLatestData();
    const intervalId = setInterval(fetchLatestData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  //new
  // useEffect(() => {
  //   const fetchLatestData = async () => {
  //     try {
  //       const plateNumbers = ["JHGF324", "LAB4405"];
  //       const plateDataPromises = plateNumbers.map(async (plateNumber) => {
  //         console.log(`Fetching data for plate: ${plateNumber}`);
  //         const plateResponse = await axios.get(`http://localhost:3000/get-data-plate/${plateNumber}`);

  //         console.log(`Plate response data for ${plateNumber}:`, plateResponse.data);
  //         const { latitude, longitude, time } = plateResponse.data.data;

  //         const locationName = await fetchLocationName(latitude, longitude);

  //         return { latitude, longitude, time, plateNumber, locationName };
  //       });

  //       const plateDataList = await Promise.all(plateDataPromises);
  //       console.log("Fetched plate data list:", plateDataList);
  //       setPlateDataList(plateDataList);
  //     } catch (error) {
  //       console.error("Error fetching plate data:", error);
  //     }
  //   };

  //   fetchLatestData();
  //   const intervalId = setInterval(fetchLatestData, 30000);

  //   return () => clearInterval(intervalId);
  // }, []);

  // useEffect(() => {
  //   const fetchLatestData = async () => {
  //     try {
  //       // Fetch latest event data
  //       const eventResponse = await axios.get("http://localhost:3000/get-latest-data");
  //       if (eventResponse.status === 200) {
  //         const latestEventData = eventResponse.data.data;
  //         setLatestEvent(latestEventData);
  //         console.log("Latest Data Fetched:", latestEventData);
  
  //         const plateNumbers = ["JHGF324", "LAB4405"];
  //         const plateDataPromises = plateNumbers.map(async (plateNumber) => {
  //           const plateResponse = await axios.get(`http://localhost:3000/get-data-plate/${plateNumber}`);
  //           if (plateResponse.status === 200) {
  //             const plateData = plateResponse.data;
  //             console.log(`Data for plate number ${plateNumber}:`, plateData);
  //             return { plateNumber, ...plateData };
  //           } else {
  //             console.error(`Failed to fetch data for plate: ${plateNumber}`);
  //             return null;
  //           }
  //         });
  
  //         // Await all promises to resolve, then filter out any null results
  //         const plateDataList = (await Promise.all(plateDataPromises)).filter(Boolean);
  //         setPlateData(plateDataList);
  
  //         // Optionally, fetch location names
  //         await Promise.all(plateDataList.map(async (plate) => {
  //           await fetchLocationName(plate.latitude, plate.longitude);
  //         }));
  
  //         // Fetch latest completed booking
  //         const completedBookingResponse = await axios.get(`http://localhost:3000/get-latest-completed-booking?plateNumber=${latestEventData.plateNumber}`);
  //         if (completedBookingResponse.status === 200) {
  //           const latestCompletedBooking = completedBookingResponse.data.latestCompletedBooking;
  //           setLatestCompletedBooking(latestCompletedBooking);
  //           console.log("Latest Completed Booking Fetched:", latestCompletedBooking);
  //         } else {
  //           console.error("Failed to fetch latest completed booking data from the server");
  //         }
  //       } else {
  //         console.error("Failed to fetch latest event data from the server");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  
  //   // Fetch latest data initially and set up polling every 30 seconds
  //   fetchLatestData();
  //   const intervalId = setInterval(fetchLatestData, 30000);
  
  //   return () => clearInterval(intervalId);
  // }, []);


//daan and working
  // useEffect(() => {
  //   const fetchLatestData = async () => {
  //     try {
  //       const eventResponse = await axios.get("http://localhost:3000/get-latest-data");
  //       if (eventResponse.status === 200) {
  //         const latestEventData = eventResponse.data.data; 
  //         setLatestEvent(latestEventData);
  //         console.log("Latest Data Fetched:", latestEventData);
    
  //         const plateNumber = latestEventData.plateNumber;

  //         // const locationName = await fetchLocationName(latestEventData.latitude, latestEventData.longitude);
  //         await fetchLocationName(latestEventData.latitude, latestEventData.longitude);
  //         // console.log("Location: ", locationName);
    
  //         const completedBookingResponse = await axios.get(`http://localhost:3000/get-latest-completed-booking?plateNumber=${plateNumber}`);
  //         if (completedBookingResponse.status === 200) {
  //           const latestCompletedBooking = completedBookingResponse.data.latestCompletedBooking;
  //           setLatestCompletedBooking(latestCompletedBooking);
  //           console.log("Latest Completed Booking Fetched:", latestCompletedBooking);
  //         } else {
  //           console.error("Failed to fetch latest completed booking data from the server");
  //         }
  //       } else {
  //         console.error("Failed to fetch latest event data from the server");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  
  //   // Fetch latest data initially
  //   fetchLatestData();
  
  //   // Poll for latest data every 30 seconds
  //   const intervalId = setInterval(fetchLatestData, 30000);
  
  //   // Cleanup function to clear interval on component unmount
  //   return () => clearInterval(intervalId);
  // }, []);

  // const formatTime = (timeString) => {
  //   if (!timeString || typeof timeString !== "string") return "Invalid Time";

  //   const timeParts = timeString.split("+");
  //   if (timeParts.length !== 2) return "Invalid Time";

  //   const time = timeParts[0];
  //   const ampm = parseInt(time.split(":")[0]) >= 12 ? "pm" : "am";
  //   const formattedTime =
  //     time
  //       .split(":")
  //       .map((part, index) => (index === 0 ? parseInt(part) % 12 || 12 : part))
  //       .join(":") + ampm;

  //   return formattedTime;
  // };

  const formatTime = (timeString) => {
    // If timeString is empty or undefined, return "Invalid Time"
    if (!timeString) return "Invalid Time";
  
    // Check if the timeString has a "+" sign (indicating a specific format like "HH:mm+AM/PM")
    const timeParts = timeString.split("+");
    
    if (timeParts.length === 2) {
      // Handle the first format: HH:mm+AM/PM
      const time = timeParts[0];
      const ampm = parseInt(time.split(":")[0]) >= 12 ? "pm" : "am";
      const formattedTime =
        time
          .split(":")
          .map((part, index) => (index === 0 ? parseInt(part) % 12 || 12 : part))
          .join(":") + ampm;
      return formattedTime;
    } else {
      // Handle ISO format or other general time strings
      const date = new Date(timeString);
      
      // Ensure the date is valid
      if (isNaN(date)) {
        console.error("Invalid date format:", timeString);
        return "Invalid Time";
      }
  
      // Format the time as local time (using the user's locale)
      return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString()}`;
    }
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

  // const handleClick = async (plateNumber) => {
  //   console.log("Plate Number Clicked:", plateNumber);
  
  //   try {

  //     const response = await axios.get(
  //       `http://localhost:3000/get-data-plate/${plateNumber}`
  //     );
  //     setLocationData(response.data);

  //     // Fetch vehicle details
  //     const detailsResponse = await axios.get(
  //       `http://localhost:3000/vehicle/details/${plateNumber}`
  //     );
  //     const details = detailsResponse.data;
  
  //     console.log("Details:", details.vehicle.vehicleName);
  
  //     // Fetch location data
  //     const locationResponse = await axios.get(
  //       `http://localhost:3000/get-data-plate/${plateNumber}`
  //     );
  //     const locationData = locationResponse.data;
  
  //     console.log("Latitude:", locationData.latitude);
  //     console.log("Longitude:", locationData.longitude);
  
  //     console.log("Details plate:", details.vehicle.vehicleName);
  //     setSelectedPlateNumber(plateNumber);
  //     setSelectedVehicleDetails(details);

  //     console.log("Selected Vehicle Details:", selectedVehicleDetails);
  //     setShowVecModal(true);
  //   } catch (error) {
  //     console.error("Error fetching details:", error);
  //   }
  // };

  const handleClick = (plateNumber) => {
    console.log("Plate Number Clicked:", plateNumber);
    const selectedPlate = plateDataList.find(plate => plate.plateNumber === plateNumber);
    if (selectedPlate) {
      setLocationData({ latitude: selectedPlate.latitude, longitude: selectedPlate.longitude });
      axios.get(`http://localhost:3000/vehicle/details/${plateNumber}`)
        .then(response => {
          const details = response.data;
          console.log("Details:", details.vehicle.vehicleName);
          setSelectedPlateNumber(plateNumber);
          setSelectedVehicleDetails(details);
          setShowVecModal(true);
        })
        .catch(error => console.error("Error fetching details:", error));
    } else {
      console.error("No data found for selected plate:", plateNumber);
    }
  };


  // const toggleExpand = () => {
  //   setExpanded(!expanded);
  // };

  const toggleExpand = (plateNumber) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [plateNumber]: !prevExpanded[plateNumber], // Toggle the expansion for this specific plate number
    }));
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
      {/* <div className="dashboard-Reminder">
        <h6>VEHICLE ROUTES</h6>
    
        <table className="BookingList">
          <tbody className="BookingList">

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
                <strong>Location:</strong> {locationName ? locationName : "Unknown Location"}, <br></br> <strong>Time:</strong> {formatTime(latestEvent.time)}
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
      </div> */}
      <div className="dashboard-Reminder">
        <h6>VEHICLE ROUTES</h6>
        <table className="BookingList">
          <tbody className="BookingList">
            {plateDataList && plateDataList.length > 0 ? (
              plateDataList.map((plate, index) => (
                <tr key={index} onClick={() => toggleExpand(plate.plateNumber)}>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <span style={{ cursor: "pointer" }} onClick={() => handleClick(plate.plateNumber)}>
                          <strong>Plate Number:</strong> {plate.plateNumber}
                        </span>
                      </div>
                      {expanded[plate.plateNumber] && (
                         <div style={{ textAlign: "justify" }}>
                          <div>
                            <strong>Location:</strong> {plate.locationName || "Unknown Location"}, 
                            <br />
                            <strong>Time:</strong> {formatTime(plate.time)}
                          </div>
                          <div>
                            {plate.latestBooking ? (
                              <div>
                                <strong style={{ color: "green" }}>LATEST BOOKING</strong> <br />
                                <strong>Driver:</strong> {plate.latestBooking.name} <br />
                                <strong>Destination:</strong> {plate.latestBooking.boundFor} <br />
                                <strong>Time and Date:</strong> {formatTime(plate.latestBooking.timeAndDate)}
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
              ))
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
          <MDBModalTitle style={{ color: "black" }}>Vehicle's Whereabouts</MDBModalTitle>
          <button
            className="btn-close"
            onClick={handleCancelEdit}
          ></button>
        </MDBModalHeader>
        <MDBModalBody>
          {/* Display vehicle name and plate number */}
          {selectedVehicleDetails && (
            <div>
              <h5 style={{ color: "black" }}>Plate Number: {selectedPlateNumber}</h5>
              {/* Check if there is a current booking */}
              {selectedVehicleDetails.latestBooking ? (
                <div style={{ textAlign: "left" }}>
                 <strong style={{ color: "green" }}>LATEST BOOKING</strong> <br />
                  <br />
                  <div style={{ textAlign: "left", color: "black" }}>
                    <strong>Driver:</strong> {selectedVehicleDetails.latestBooking.name}, 
                    <strong>Destination:</strong> {selectedVehicleDetails.latestBooking.boundFor}, 
                    <strong>Time and Date:</strong> {formatTime2(selectedVehicleDetails.latestBooking.timeAndDate)}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "left", color: "black" }}>
                  <div style={{ color: "red" }}><strong>UNREGISTERED BOOKING</strong></div>
                </div>
              )}

              {/* Add your map component here */}
              {/* Below is just a placeholder */}
              {locationData && (
                <div
                  style={{ height: "245px", backgroundColor: "#f0f0f0" }}
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
