import React, { useEffect, useState } from "react";

function Reminder() {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

          setAllEvents(formattedReminders);
        } else {
          console.error("Failed to fetch reminders from the server");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchReminders();
  }, []);

  const formatTime = (timeString) => {
    // Check if timeString is null or undefined
    if (!timeString) {
      return "";
    }

    // Assuming timeString is in HH:mm format
    const [hours, minutes] = timeString.split(":");
    const formattedTime = `${parseInt(hours, 10) % 12 || 12}:${minutes} ${
      parseInt(hours, 10) >= 12 ? "PM" : "AM"
    }`;
    return formattedTime;
  };

  const handleClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div>
      <div className="dashboard-Reminder">
        <h6>Reminder</h6>
        <hr />
        <table className="BookingList">
          <tbody className="BookingList">
            {allEvents
              .slice(0)
              .reverse()
              .map((event, index) => (
                <tr key={event.id}>
                  <td
                    onClick={() => handleClick(event)}
                    style={{ cursor: "pointer" }}
                  >
                    {`${event.plateNumber}`}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {selectedEvent && (
          <div>
            {`${selectedEvent.plateNumber} is scheduled to depart ${
              selectedEvent.timeForBound
                ? ` at ${formatTime(selectedEvent.timeForBound)}`
                : ""
            } ${selectedEvent.boundFor ? ` for ${selectedEvent.boundFor}` : ""}
            ${
              selectedEvent.start instanceof Date
                ? ` on ${selectedEvent.start.toDateString()}`
                : ""
            }`}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reminder;
