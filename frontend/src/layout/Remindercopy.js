import React, { useEffect, useState } from "react";

function Reminder() {
  const [allEvents, setAllEvents] = useState([]);
  const [plateData, setPlateData] = useState({});

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
    const fetchAllData = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-data-plate");
        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          setAllEvents(responseData.data);
        } else {
          console.error("Failed to fetch data from the server");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchAllData();
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

  return (
    <div>
      <div className="dashboard-Reminder">
        <h6>Vehicle Routes</h6>
        <hr />
        <table className="BookingList">
          <tbody className="BookingList">
            {/* <tr>
              <td>
                {`PlateNumber: ${plateData.plateNumber} is currently at Longitude: ${plateData.longitude}, Latitude: ${plateData.latitude}`}
              </td>
            </tr> */}
            {/* {allEvents
              .slice(0)
              .reverse()
              .map((event) => (
                <tr key={event._id}>
                  <td>
                    {`PlateNumber: ${event.plateNumber} is currently at Longitude: ${event.longitude}, Latitude: ${event.latitude}, Time: ${event.time}`}
                  </td>
                </tr>
              ))} */}
            {allEvents
              .slice(0)
              .reverse()
              .map((event) => (
                <tr key={event._id}>
                  <td>
                    {`PlateNumber: ${
                      event.plateNumber
                    } is currently at Longitude: ${
                      event.longitude
                    }, Latitude: ${event.latitude}, Time: ${formatTime(
                      event.time
                    )}`}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reminder;
