import React, { useEffect, useState } from "react";
import axios from "axios";

function Reminder() {
  const [allEvents, setAllEvents] = useState([]);
  const [plateData, setPlateData] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [vehicleStatus, setVehicleStatus] = useState([]);

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

  const handleFilter = async (selectedFilter) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/vehiclestatus?status=${selectedFilter}`
      );
      const vehicleStatusData = response.data;
      setVehicleStatus(
        Array.isArray(vehicleStatusData) ? vehicleStatusData : []
      );
      fetchAllData(selectedFilter);
    } catch (error) {
      console.error("Error fetching vehicle status:", error);
    }
  };

  useEffect(() => {
    fetchAllData("Used"); // Fetch data for initial "Used" status
  }, []);

  // useEffect(() => {
  // const fetchAllData = async (statusFilter) => {
  const fetchAllData = async (statusFilter) => {
    // const fetchAllData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/get-data-plate?status=${statusFilter}`
      );
      if (response.ok) {
        const responseData = await response.json();
        // console.log(responseData);
        setAllEvents(responseData.data);
      } else {
        console.error("Failed to fetch data from the server");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  // fetchAllData();
  // }, []);

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

  // const handleClick = (event) => {
  //   if (selectedEvent === event) {
  //     // Deselect the event if it's already selected
  //     setSelectedEvent(null);
  //   } else {
  //     setSelectedEvent(event);
  //   }
  // };
  const handleClick = (event) => {
    setSelectedEvent(selectedEvent === event ? null : event);
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
            {/* {allEvents
              .slice(0)
              .reverse()
              .filter((event) =>
                vehicleStatus.find(
                  (status) =>
                    status.plateNumber === event.plateNumber &&
                    status.status === "Used"
                )
              )
              .map((event) => ( */}
            {allEvents.length === 0 ? (
              <tr>
                <td>No vehicle routes available</td>
              </tr>
            ) : (
              allEvents.map((event) => (
                <tr key={event._id}>
                  <td>
                    <span
                      onClick={() => handleClick(event)}
                      style={{ cursor: "pointer" }}
                    >
                      {" "}
                      Plate Number {event.plateNumber}
                    </span>
                    {selectedEvent === event && (
                      <div>
                        {`PlateNumber: ${
                          event.plateNumber
                        } is currently at Longitude: ${
                          event.longitude
                        }, Latitude: ${event.latitude}, Time: ${formatTime(
                          event.time
                        )}`}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reminder;
