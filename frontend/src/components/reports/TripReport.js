import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import logo from "../logo.png";
import otherLogo from "../another-logo.png";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Modal, Button } from "react-bootstrap";

function formatDateTime(dateTimeString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  return new Date(dateTimeString).toLocaleDateString("en-US", options);
}

const TripReport = () => {
  const [bookingData, setBookingData] = useState([]);
  const [editableData, setEditableData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("plateNumber");
  const [showArchived, setShowArchived] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [completedBooking, setCompletedBooking] = useState([]);
  const [selectedPlateNumberStatus, setSelectedPlateNumberStatus] = useState("");
  const [formEditData, setFormEditData] = useState({});

  console.log("Complete Edit booking: ", formEditData)

  
  const handleEditOpen = (booking) => {
    const { clientName,  destination } = booking;

    setFormEditData({
      clientName: clientName,
      destination: destination,
  });

    // Logic for handling edit action goes here
    setSelectedBooking(booking);
    console.log("Booking Details:", booking);
    setShowEditModal(true);
  };


  const handleCompleteEditedBooking = (booking, formEditData) => {
    console.log("Booking details:", booking);
    console.log("Form data:", formEditData);
  };
  const handleEditCloseModal = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    fetchCompletedBookings();
    // Add any other necessary initialization logic here
  }, []);

  const fetchCompletedBookings = async () => {
    try {
      const response = await fetch("http://localhost:3000/check-completed-bookings");
      if (response.ok) {
        const data = await response.json();
        setCompletedBookings(data.completedBookings);
        console.log("completed bookings: ", data.completedBookings);
      } else {
        console.error("Failed to fetch completed bookings");
      }
    } catch (error) {
      console.error("Error fetching completed bookings:", error);
    }
  };

  const handleOpenModal = (booking) => {
    const {_id, clientName, passengerNames, destination, boundFor, timeAndDate, timeForBound, returnDate } = booking;
     // Combine date and timeForBound
  const combinedDate = new Date(timeAndDate);
  combinedDate.setHours(new Date(timeForBound).getHours());
  combinedDate.setMinutes(new Date(timeForBound).getMinutes());

  const bookingID = _id;

  setFormData({
    bookingID: bookingID,
    plateNumber: booking.plateNumber, // Include plateNumber
    name: booking.name,
    clientName: clientName,
    passengerNames: passengerNames.join(", "), // Convert array to string
    destination: destination,
    timeAndDate: combinedDate.toISOString(), // Use the combined date
    returnDate: returnDate
});

    setSelectedBooking(booking);
    console.log("Booking Details:", booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    
  };


  const [formData, setFormData] = useState({
    plateNumber: "",
     name: "",

  });

  console.log("Complete booking: ", formData)


//   const handleCompleteBooking = async (booking, formData) => {
//     // Here you can access both booking and formData
//     console.log("Booking details:", booking);
//     console.log("Form data:", formData);

//     try {
//       const response = await fetch("http://localhost:3000/completed-bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         // Handle success, e.g., clear the form or close the modal
//         setFormData({
//           bookingID: "",
//           plateNumber: "",
//           name: "",
//           clientName: "",
//           passengerNames: "",
//           destination: "WOS",
//           boundFor: "",
//           timeAndDate: "",
//         });

//         setCompletedBookings([...completedBookings, booking._id]); // Update completedBookings state
//         console.log("Updated completed bookings:", [...completedBookings, booking._id]);
//         alert("Completed");
//         window.location.reload();
//       } else {
//         // Handle error
//         console.error("Error while submitting the form");
//       }
//     } catch (error) {
//       // Handle network error
//       console.error("Network error:", error);
//     }

// };

const handleCompleteBooking = async (booking, formData, selectedPlateNumberStatus, passengerNames) => {
  // Here you can access both booking and formData
  console.log("Booking details:", booking);
  console.log("Form data:", formData);
  console.log("Passenger names:", passengerNames);
  // Function to validate booking based on available seats
  const validateBooking = (selectedPlateNumberStatus, passengerNames) => {
    // Check if selectedPlateNumberStatus is defined
    if (!selectedPlateNumberStatus) {
        console.error("Error: selectedPlateNumberStatus is undefined.");
        return false;
    }

    // Extract availability status and available seats from selectedPlateNumberStatus
    const [status, availableSeatsString] = selectedPlateNumberStatus.split(". Seats: ");
    const availableSeats = parseInt(availableSeatsString.trim());

    // Extract passenger names from the array
    const passengerNamesString = passengerNames[0];

    // Split the string of passenger names into an array
    const passengerNamesArray = passengerNamesString.split(", ");

    console.log("Availability status:", status);
    console.log("Available seats:", availableSeats);
    console.log("Passengers:", passengerNamesArray.length);

    // Check if the number of passengers exceeds available seats
    if (passengerNamesArray.length > availableSeats) {
        // If so, return false to indicate that booking is not valid
        return false;
    }

    // Otherwise, return true to indicate that booking is valid
    return true;
};

try {

      // Proceed with booking submission
      const isValidBooking = validateBooking(selectedPlateNumberStatus, passengerNames);

      if (isValidBooking) {

        const response = await fetch("http://localhost:3000/completed-bookings", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      });
    
          // Handle success, e.g., clear the form or close the modal
          setFormData({
              bookingID: "",
              plateNumber: "",
              name: "",
              clientName: "",
              passengerNames: "",
              destination: "WOS",
              boundFor: "",
              timeAndDate: "",
          });

          setCompletedBookings([...completedBookings, booking._id]); // Update completedBookings state
          console.log("Updated completed bookings:", [...completedBookings, booking._id]);
          alert("Completed");
          window.location.reload();
          } else {
              // Display error message to the user indicating that the booking exceeds available seats
              alert('The number of passengers exceeds the available seats. Please select a different vehicle or reduce the number of passengers.');
          }
  } catch (error) {
      // Handle network error
      console.error("Network error:", error);
  }
};


  // Function to handle vehicle click
  const handleVehicleClick = (plateNumber) => {
    setSelectedPlateNumber(plateNumber);
    console.log("Selected plate number:", plateNumber); // Add this line for debugging
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      //FOOTER
      // Track page number
      let pageNumber = 1;

      // Function to add page number

      let issueNumber = 0; // Initialize issue number

      const addPageNumber = () => {
        // Position at 15 mm from bottom
        doc.setFontSize(10);
        const pageNumberText = `Page ${pageNumber} of ${pageNumber}`;
        const issueDate = new Date().toLocaleDateString(); // Get current date
        issueNumber++; // Increment issue number
        const issueNumberText = `Issue No. ${issueNumber}`; // Issue number text

        // Calculate the width of the text
        const pageNumberWidth =
          doc.getStringUnitWidth(pageNumberText) * doc.internal.getFontSize();
        const issueDateWidth =
          doc.getStringUnitWidth(issueDate) * doc.internal.getFontSize();
        const issueNumberWidth =
          doc.getStringUnitWidth(issueNumberText) * doc.internal.getFontSize();

        // Calculate x-positions for each element
        const pageXPos = doc.internal.pageSize.width - 20 - pageNumberWidth;
        const issueDateXPos = pageXPos - 15 - issueDateWidth;
        const issueNumberXPos = issueDateXPos - 10 - issueNumberWidth;

        // Draw the text
        doc.text(pageNumberText, pageXPos, doc.internal.pageSize.height - 10);
        doc.text(
          `Issue Date: ${issueDate}`,
          issueDateXPos,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          issueNumberText,
          issueNumberXPos,
          doc.internal.pageSize.height - 10
        );
      };

      // Function to add a new page with a page number
      const addPageWithNumber = () => {
        if (pageNumber > 1) {
          // Add new page except for the first page
          doc.addPage();
        }

        // Add page number
        addPageNumber();
      };

      // Add a page with the page number
      addPageWithNumber();

      // Header content
      doc.setFontSize(10);
      doc.text("Fortich St. Malaybalay City, Bukidnon 8700", 74, 30);
      doc.addImage(logo, "PNG", 30, 15, 20, 18);
      doc.addImage(otherLogo, "PNG", 157, 15, 20, 18);

      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
      const currentYear = currentDate.getFullYear();
      doc.setFontSize(13);
      doc.text(
        `NUMBER OF TRIP PER VEHICLE FOR THE MONTH OF ${currentMonth.toUpperCase()} ${currentYear}`,
          34,
          55
      );

      doc.setFontSize(13);
      doc.text(
        `Within and Beyond Official Station`,
          73,
          62
      );
      
      doc.setFont(undefined, "bold");
      doc.setFontSize(12);
      doc.text("GSU - Motorpool Section", 80, 45);

      doc.setFont("times");
      doc.setFontSize(17);
      doc.text("BUKIDNON STATE UNIVERSITY", 58, 25);

      //BELOW THE TABLE
      let yPos = 45;
      // doc.text("Prepared by:", 15, textYPos);
      doc.setFontSize(12); // Adjust font size here
      doc.text("Prepared by:", 15, yPos + 110);
      yPos += 15; // Adjust margin as needed

      doc.setFontSize(11); // Adjust font size here
      doc.text("Administrative Aide III", 25, 167);
      let yPos1 = 180;
      const leftMarginVerifiedBy = 10; // Adjust the left margin for "Verified by:" as needed
      doc.setFontSize(12); // Adjust font size here
      doc.text("Verified by:", 15 + leftMarginVerifiedBy, yPos1); // Adjusted x-coordinate

      yPos1 += 10; // Adjust margin as needed
      doc.setFontSize(11); // Adjust font size here
      doc.text(
        "Supervisor,Transportation Service (Motorpool Section)",
        22,
        200
      );

      let yPos2 = 180;
      const leftMarginNotedBy = 130; // Adjust the left margin for "Verified by:" as needed
      doc.setFontSize(12); // Adjust font size here
      doc.text("Noted by:", 15 + leftMarginNotedBy, yPos2); // Adjusted x-coordinate
      yPos1 += 10; // Adjust margin as needed

      doc.setFontSize(11); // Adjust font size here
      doc.text("Head, GSU", 160, 200);

      doc.setFontSize(12); // Adjust font size here
      doc.text("SNIFFY L. TIMONES", 25, 162);
      const textWidth = doc.getStringUnitWidth("SNIFFY L. TIMONES") * 4.5; // Adjust 12 to the font size used
      const startX = 24; // Adjust as needed
      const startY = 162 + 1; // Adjust to position the underline below the text
      doc.line(startX, startY, startX + textWidth, startY); // Draw a line below the text

      const topMargin = 10; // Adjust the top margin as needed
      const leftMargin = 25; // Adjust the left margin as needed
      doc.setFontSize(12); // Adjust font size here
      const text = "ERIC L. GULTIANO";
      const textWidth3 = doc.getStringUnitWidth(text) * 4.5; // Adjust 12 to the font size used
      const startX3 = 24 + leftMargin; // Adjust as needed
      const startY3 = 186 + topMargin; // Adjust to position the text below the top margin
      doc.text(text, 25 + leftMargin, 185 + topMargin); // Adjusted y-coordinate for the text
      doc.line(startX3, startY3, startX3 + textWidth3, startY3); // Adjusted start and end positions for the line

      const topMarginNew = 10; // Adjust the top margin as needed for the new copy
      const leftMarginNew = 120; // Adjust the left margin as needed for the new copy
      doc.setFontSize(12); // Adjust font size here for the new copy
      const textNew = "KRISTINE FIVI O. GEWAN";
      const textWidthNew = doc.getStringUnitWidth(textNew) * 4.5; // Adjust 12 to the font size used for the new copy
      const startXNew = 24 + leftMarginNew; // Adjust as needed for the new copy
      const startYNew = 186 + topMarginNew; // Adjust to position the text below the top margin for the new copy
      doc.text(textNew, 25 + leftMarginNew, 185 + topMarginNew); // Adjusted y-coordinate for the text for the new copy
      doc.line(startXNew, startYNew, startXNew + textWidthNew, startYNew); // Adjusted start and end positions for the line for the new copy
      
      //Brendyl Ani
      //TABLE
      // Calculate total number of trips per vehicle
      const tripsPerVehicle = {};
      bookingData.forEach((booking) => {
        const plateNumber = booking.plateNumber;
        if (!tripsPerVehicle[plateNumber]) {
          tripsPerVehicle[plateNumber] = 0;
        }
        tripsPerVehicle[plateNumber]++;
      });

      // Fetch vehicle names based on plate numbers
      const getVehicleName = async (plateNumber) => {
        try {
          const response = await axios.get(
            `http://localhost:3000/vehicle/details/${plateNumber}`
          );
          return response.data.vehicle.vehicleName || "Unknown";
        } catch (error) {
          console.error("Error fetching vehicle name:", error);
          return "Unknown";
        }
      };

      // Prepare data for the table
      const plateNumbers = bookingData.map((booking) => booking.plateNumber);
      const uniquePlateNumbers = new Set(plateNumbers);
      // Initialize total trips
      let totalTrips = 0;
      // Inside your tableData mapping function

      const tableData = await Promise.all(
        Array.from(uniquePlateNumbers).map(async (plateNumber) => {
          const vehicleName = await getVehicleName(plateNumber);
          let wosTrips = 0;
          let bosTrips = 0;

          // Count trips based on service type
          bookingData.forEach((booking) => {
            if (booking.plateNumber === plateNumber) {
              if (booking.destination === "WOS") {
                wosTrips++;
              } else if (booking.destination === "BOS") {
                bosTrips++;
              }
            }
          });
          // Increment total trips
          totalTrips += wosTrips + bosTrips;

          return [plateNumber, vehicleName, wosTrips, bosTrips];
        })
      );

      // Add a row for total trips
      tableData.push(["TOTAL TRIPS:", totalTrips]);
    
      ///here taman
      doc.autoTable({
        // startY: 78,
        startY: yPos + 10,
        head: [
          [
            { content: "Plate Number", styles: { fontStyle: "bold" } },
            { content: "Vehicle", styles: { fontStyle: "bold" } },
            // { content: "TOTAL NO. OF TRIP", styles: { fontStyle: "bold" } },
            {
              content: "Within Official Station",
              styles: { fontStyle: "bold" },
            },
            {
              content: "Beyond Official Station",
              styles: { fontStyle: "bold" },
            },
          ],
        ],
        body: tableData,

        headStyles: {
          fillColor: [255, 255, 255], // White background for header
          textColor: [0, 0, 0], // Black text color for header
          lineColor: [0, 0, 0], // Set header cell border color
          lineWidth: 0.2, // Set header cell border width
          halign: "center", // Center align the header content horizontally
          fontSize: 12, // Adjust font size of the header
          fontStyle: "arialnarrow", // Set font style to Arial Narrow
        },
        bodyStyles: {
          fillColor: false, // Remove background color for body cells
          // fontStyle: 'bold',
          fontSize: 11,
          textColor: [0, 0, 0], // Black text color for body
          lineColor: [0, 0, 0], // Set body cell border color
          lineWidth: 0.2, // Set body cell border width
        },
        tableLineWidth: 0.2, // Set table border width
        tableLineColor: [0, 0, 0], // Set table border color
        margin: { top: 0 }, // Adjust table margin if needed
        didDrawPage: function (data) {
          const tableHeight = doc.autoTable.previous.finalY;
          const bottomMargin = 20; // Adjust the bottom margin as needed
          const pageHeight = doc.internal.pageSize.height;
          if (tableHeight + bottomMargin >= pageHeight) {
            doc.addPage();
          }
        },
      });

      
      // Convert the PDF content into a data URL
      const dataUri = doc.output("datauristring");

      // Create a new HTML file with the PDF content
      const htmlContent = `<html><head><title>Monthly Trip Report</title></head><body><iframe width="100%" height="100%" src="${dataUri}"></iframe></body></html>`;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      // Open the new HTML file in a new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // const handleGenerateReport = async () => {
  const handleGenerateReport = (plateNumber) => {
    try {
      // if (selectedPlateNumber) {
      if (!plateNumber) {
        console.log("Generating report for plate number:", selectedPlateNumber);
        // Add your logic for generating the report
      } else {
        console.log("No plate number selected");
      }

      const bookingDetails = filteredData.find(
        (booking) => booking.plateNumber === plateNumber
      );

      const doc = new jsPDF();
      // addCommonContent(doc);
      doc.addImage(logo, "PNG", 30, 12, 20, 18);
      doc.addImage(otherLogo, "PNG", 165, 12, 20, 18);
      doc.setFontSize(10); // Adjust font size here
      doc.text("Malaybalay City, Bukidnon 8700, Mobile 09178036386", 65, 30);
      doc.setFontSize(9); // Adjust font size here
      doc.text(
        "TeleFax (088) 813-2717 Local 158 www.buksu.edu.ph - eig052775@gmail.com",
        50,
        36
      );

      doc.setFont("times");
      doc.setFontSize(13);
      doc.text("GENERAL SERVICES UNIT", 75, 48);

      doc.setFontSize(13);
      doc.text("TRANSPORTATION SERVICE (Motorpool Section)", 52, 54);

      doc.setFont(undefined, "bold"); // Set font weight to bold
      // Set font to Times New Roman
      doc.setFontSize(17); // doc.setFont('helvetica', 'bold'); // Set font to bold
      doc.text("BUKIDNON STATE UNIVERSITY", 62, 25);

      doc.setFontSize(16);
      doc.text("Booking Request Letter", 68, 70);

      doc.setFontSize(12);
      doc.text(`From: ${formData.clientName}`, 14, 30);

      // Add date
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Date: ${currentDate}`, 14, 44);

      // Add body of the letter
      doc.setFontSize(12);
      doc.text("Dear Sir/Madam,", 14, 60);
      doc.text(
        "We would like to request a booking for the following vehicle:",
        14,
        67
      );


      // Clear existing content or initialize a new PDF document
      // Then add booking details
      doc.text(`Plate No.: ${bookingDetails.plateNumber}`, 14, 80);
      doc.text(`Destination: ${bookingDetails.destination}`, 14, 87);
      doc.text(`Bound For: ${bookingDetails.boundFor}`, 14, 94);
      doc.text(
        `Departure: ${formatTime(bookingDetails.timeForBound)}`,
        14,
        101
      );
      doc.text(`Return: ${formatTime(bookingDetails.returnDate)}`, 14, 108);

      // Add closing remarks
      const lastY = 80 + filteredData.length * 30;
      doc.text("Thank you for your attention to this matter.", 14, lastY + 10);
      doc.text("Best regards,", 14, lastY + 20);
      doc.text("Your Name", 14, lastY + 30); // Change "Your Name" to the sender's name

    
      // Convert the PDF content into a data URL
      const dataUri = doc.output("datauristring");

      // Create a new HTML page with an embedded iframe that displays the PDF
      const htmlContent = `
        <html>
          <head>
            <title>Vehicle Trip Report</title>
          </head>
          <body>
            <iframe width="100%" height="100%" src="${dataUri}"></iframe>
          </body>
        </html>
      `;

      // Create a Blob from the HTML content
      const blob = new Blob([htmlContent], { type: "text/html" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Open the URL in a new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  useEffect(() => {
    // Fetch booking data from the server
    const fetchBookingData = async () => {
      try {
        let endpoint;
        if (showArchived) {
          endpoint = "http://localhost:3000/archivedbook";
        } else {
          endpoint = "http://localhost:3000/allbook";
        }
        const response = await axios.get(endpoint);
        const data = response.data;
        // Update the state with the fetched data
        setBookingData(data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };
  
    // Call the fetch function
    fetchBookingData();
  }, [showArchived]);

  const handleEdit = (index) => {
    setEditableData({ ...bookingData[index] });
  };

  const handleChange = (e, key) => {
    const { value } = e.target;
    setEditableData((prevState) => {
      const updatedData = {
        ...prevState,
        [key]: value,
      };
      console.log("Updated editable data:", updatedData);
      return updatedData;
    });
  };


  const handleSubmit = async () => {
    try {
      // Update data in the database
      await axios.put(
        `http://localhost:3000/editbook/${selectedBooking._id}`, // Include the ID in the URL
        editableData
      );
  
      // Update data in the UI
      const updatedBookingData = [...bookingData];
      //const index = updatedBookingData.findIndex(item => item._id === selectedBooking._id);
      //updatedBookingData[index] = editableData;
      setBookingData(updatedBookingData);
  
      // Clear editable data
      setEditableData({});
      setShowEditModal(false); // Close the modal
      window.location.reload();
    } catch (error) {
      console.error("Error updating booking data:", error);
    }
  };


  const handleArchiveBooking = async (plateNumber) => {
    try {
      const response = await axios.post(`http://localhost:3000/archive/${plateNumber}`);
      if (response.data.success) {
        // Remove the archived booking from the state
        setBookingData((prevData) =>
          prevData.filter((booking) => booking.plateNumber !== plateNumber)
        );
      }
    } catch (error) {
      console.error("Error archiving booking:", error);
    }
  };

  const handleActivateBooking = async (plateNumber) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/activatebook/${plateNumber}`
      );
      if (response.data.success) {
        // Remove the activated booking from the state
        setBookingData((prevData) =>
          prevData.filter((booking) => booking.plateNumber !== plateNumber)
        );
      }
    } catch (error) {
      console.error("Error activating booking:", error);
    }
  };

  const handleToggleArchive = () => {
    setShowArchived(!showArchived);
  };



  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };
    return new Date(dateTimeString).toLocaleDateString("en-US", options);
  };

  const filteredData = bookingData
  .filter((booking) => {
    const fieldValue = booking[searchField];
    // Modify the filtering logic to check the passengerNames field
    return (
      fieldValue &&
      (searchField !== "passengerNames"
        ? fieldValue.toLowerCase().includes(searchQuery.toLowerCase())
        : fieldValue.join(" ").toLowerCase().includes(searchQuery.toLowerCase()))
    );
  })
  .filter((booking) => (showArchived ? true : !booking.isArchived));

  const handleToggleBooking = async (booking) => {
    const action = booking.isActive ? "archive" : "activate";
    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this booking?`
    );
    if (!confirmAction) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/${action}book/${booking.plateNumber}`
      );
      if (response.data.success) {
        setBookingData((prevData) =>
          prevData.map((prevBooking) => {
            if (prevBooking.plateNumber === booking.plateNumber) {
              return { ...prevBooking, isActive: !booking.isActive };
            }
            return prevBooking;
          })
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
    }
  };
  const isBookingDatePassed = (bookingDate) => {
    const now = new Date();
    return new Date(bookingDate) < now;
  };

  const handleToggleStatus = (index) => {
    const updatedData = [...filteredData];
    updatedData[index].status =
      updatedData[index].status === "Pending" ? "Used" : "Pending";
    setBookingData(updatedData);
  };

  const [plateNumbers, setPlateNumbers] = useState([]);
  const [plateNumberStatuses, setPlateNumberStatuses] = useState({});

  const [selectedPlateNumber, setSelectedPlateNumber] = useState(null);
  const [availablePlateNumbers, setAvailablePlateNumbers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedDriverStatus, setSelectedDriverStatus] = useState("");
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedPlateNumberSeats, setSelectedPlateNumberSeats] = useState(null);
  

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
            availableSeats: data[plateNumber].availableSeats
          }));

          console.log("Hello", plateNumberArray);
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
    const selectedPlateNumber = event.target.value;
    console.log("selected:", selectedPlateNumber);
    const selectedPlate = plateNumbers.find((plate) => plate.plateNumber === selectedPlateNumber);
    
    if (selectedPlate) {
      console.log("Selected Plate:", selectedPlate);
      setSelectedPlateNumber(selectedPlateNumber);
      setSelectedPlateNumberStatus(selectedPlate.status);
      setSelectedPlateNumberSeats(selectedPlate.availableSeats); // Set the selected plate number's available seats
      setFormData({ ...formData, plateNumber: selectedPlateNumber });
    }
  };

  useEffect(() => {
    // Filter available plate numbers only if plateNumbers is not empty
    if (plateNumbers.length > 0) {
      const availableNumbers = plateNumbers.filter(({ status }) => status.includes("Available"));
      console.log("Avail:", availableNumbers);
      setAvailablePlateNumbers(availableNumbers);
    }
  }, [plateNumbers]);

  useEffect(() => {
    const fetchDriverStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/driverstatus");
        if (response.ok) {
          const data = await response.json();
          console.log("Received driver data:", data);
          const availableDrivers = Object.values(data)
            .filter(driver => driver.status === "Available")
            .map(driver => ({ name: driver.name }));
          setAvailableDrivers(availableDrivers);
        } else {
          console.error("Failed to fetch driver status from the server");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };
  
    fetchDriverStatus();
  }, []);

  const handleDriverChange = (event) => {
    const selectedDriverId = event.target.value;
    console.log("selected driver: ", selectedDriverId);
    setSelectedDriver(selectedDriverId);
    setFormData({ ...formData, name: selectedDriverId });
    setSelectedDriverStatus(""); // Reset the driver status when a new driver is selected
    // Retrieve and set the status of the selected driver
    const status = availableDrivers.find(({ name }) => name === selectedDriverId) ? "Available" : "Unavailable";
    setSelectedDriverStatus(status);
  };

  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const response = await fetch("http://localhost:3000/get-all-completedbookings");
        if (response.ok) {
          const data = await response.json();
          console.log("Completed bookings data:", data);
          setCompletedBooking(data);
        } else {
          console.error("Failed to fetch completed bookings from the server");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchCompletedBookings();
  }, []);

  return (
    <>
  
      <div className="header-wrapper">
        <div className="header-container">
          <h4>
            <strong>REPORT</strong>{" "}
          </h4>{" "}
          <span className="userName">
            <span className="userName-text">Administrator</span>{" "}
            <FontAwesomeIcon icon={faCircleUser} className="icon-circle" />
          </span>
        </div>
      </div>
      <div className="report-container">
      <div className="report-wrapper">
     
      <div className="report_search">
        <input
          type="text"
          placeholder="Search Plate Number....."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
  
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="passengerNames">PASSENGER NAMES</option>
          <option value="boundFor"> DESTINATION</option>
          <option value="timeForBound">DEPARTURE</option>
          <option value="returnDate">RETURN</option>
        </select>

        <button onClick={handleToggleArchive} className={`archived-button ${showArchived ? 'active' : ''}`}>
          {showArchived ? "Show Active Data" : "Show Archived Data"}
        </button>
      
        <button onClick={generatePDF} className="generate-button">
          Generate Report
        </button>
       
        </div>
     
      <div className="TableReportContainer">
        <table className="reportTable">
          <thead>
            <tr>
            <th>PASSENGER NAMES</th>
              <th>DESTINATION</th>
              <th>OFFICE</th>
              <th>DEPARTURE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          {filteredData.length > 0 ? (
            <tbody>
              {filteredData.map((booking, index) => (
                <tr key={booking._id}>
                  <td>
                    {editableData._id === booking._id ? (
                      <input
                        type="text"
                        value={editableData.passengerNames}
                        onChange={(e) => handleChange(e, "passengerNames")}
                        required
                      />
                    ) : (
                      booking.passengerNames
                    )}
                  </td>
                  <td>
                    {editableData._id === booking._id ? (
                      <input
                        type="text"
                        value={editableData.boundFor}
                        onChange={(e) => handleChange(e, "boundFor")}
                        required
                      />
                    ) : (
                      booking.boundFor
                    )}
                  </td>
                  <td>
                    {editableData._id === booking._id ? (
                      <input
                        type="text"
                        value={editableData.clientName} // Change here
                        onChange={(e) => handleChange(e, "clientName")} // Change here
                        required
                      />
                    ) : (
                      booking.clientName // Change here
                    )}
                  </td>
                  <td>
                    {editableData._id === booking._id ? (
                      <input
                        type="text"
                        value={editableData.timeAndDate}
                        onChange={(e) => handleChange(e, "timeAndDate")}
                        required
                      />
                    ) : (
                      booking.timeAndDate
                    )}
                  </td>
                  <td>
                  {completedBookings.find(completedBooking => completedBooking.bookingID === booking._id) ? (
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      style={{ width: "100px" }}
                      disabled // Disable the button if already completed
                    >
                      Completed
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      style={{ width: "100px" }}
                      onClick={() => handleOpenModal(booking)}
                    >
                      Pending
                    </button>
                  )}
                  {/* Add console logs here */}
              {console.log('Booking:', booking.clientName)}
              {console.log('Completed bookings:', completedBookings)}
                  {/* <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      style={{ width: "100px" }} // Adjust width as needed
                      onClick={() => handleOpenModal(booking)}
                    >
                      Pending
                    </button> */}
                  </td>
                  <td>
                  {/* <div className="btn-group"> */}
                    {/* Edit button */}
                    {editableData._id === booking._id ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => handleSubmit(index)}
                        >
                          Submit
                        </button>
                        &nbsp;
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setEditableData({})}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => handleEditOpen(booking)}
                      style={{ backgroundColor: "#1D5D9B", color: "white" }} // Change background color to blue
                    >
                      Edit
                    </button>
                    )}
                    {/* &nbsp;<button type="button" class="btn btn-danger btn-sm">Delete</button> */}
                    &nbsp;{" "}
                    {showArchived && (
                        // Render only the "Activate" button when showing archived data
                        <button
                            className="action-btn activate-btn"
                            onClick={() => {
                                const confirmed = window.confirm("Are you sure you want to activate this data?");
                                if (confirmed) {
                                    handleActivateBooking(booking.plateNumber);
                                }
                            }}
                        >
                            Activate
                        </button>
                    )}
                    {!showArchived && (
                          <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => {
                                  if (window.confirm("Are you sure you want to archive this data?")) {
                                      handleArchiveBooking(booking.plateNumber);
                                  }
                              }}
                              style={{ backgroundColor: '#b90000', color: 'white' }}
                          >
                              Archive
                          </button>
                      )}
                 </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <p>No data available</p>
          )}
        </table>
      </div>
      <div className="TableReportContainer">
        <h3>COMPLETED BOOKINGS</h3>
        <table className="reportTable">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Plate Number</th>
              <th>Driver</th>
              <th>Passenger Names</th>
              <th>Client Name</th>
              <th>Destination</th>
              <th>Time and Date</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {completedBooking.map((booking) => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.plateNumber}</td>
                <td>{booking.name}</td>
                <td>{booking.passengerNames}</td>
                <td>{booking.clientName}</td>
                <td>{booking.destination}</td>
                {/* <td>{booking.boundFor}</td> */}
                <td>{booking.timeAndDate}</td>
                <td>{booking.returnDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        {/* Edit Booking Modal */}
      <Modal show={showEditModal} onHide={handleEditCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "20px" }}>Edit Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form >
        <div className="form-group">
        <label>
            Booking ID:
            <input type="text"  className="bookingInput" value={selectedBooking ? selectedBooking._id : ''} readOnly />
          </label>
          </div>
          <div className="form-group">
            <label>
              Passenger Names:
              <input type="text" className="bookingInput" value={editableData.passengerNames !== undefined ? editableData.passengerNames : (selectedBooking ? selectedBooking.passengerNames : '')} onChange={(e) => handleChange(e, 'passengerNames')} />
            </label>
          </div>
          <div className="form-group">
          <label>
            Destination:
            <input type="text" className="bookingInput" value={editableData.boundFor !== undefined ? editableData.boundFor : (selectedBooking ? selectedBooking.boundFor : '')} onChange={(e) => handleChange(e, 'boundFor')} />
          </label>
          </div>
          <div className="form-group">
          <label>
            Office:
            <input type="text" className="bookingInput" value={editableData.clientName !== undefined ? editableData.clientName : (selectedBooking ? selectedBooking.clientName : '')} onChange={(e) => handleChange(e, 'clientName')} />
          </label>
          </div>
          {/* <div className="form-group">
            {/* //<label htmlFor="office">Office</label> */}
            {/* <input type="text" className="form-control" id="office" /> */}
          {/* </div> */} 
          <Button variant="secondary" onClick={handleEditCloseModal}>
            Cancel
          </Button>
        &nbsp;
          <Button variant="primary"  onClick={handleSubmit}
          style={{
            marginLeft: "7px" // Adjust margin-left as needed
          }}>
            Save Changes
          </Button>
        </form>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      {/* Modal for completing booking */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Complete the booking for: {selectedBooking ? selectedBooking.clientName : ''}</p>
          {/* <p>Complete the booking for /NAME SA CLIENT DAPAT/</p> */}
          <form onSubmit={handleCompleteBooking}>
          <label>
            Booking ID:
            <input type="text"  className="bookingInput" value={selectedBooking ? selectedBooking._id : ''} readOnly />
          </label>
          <label>
            Passenger Names:
            <input type="text"  className="bookingInput" value={selectedBooking ? selectedBooking.passengerNames : ''} readOnly />
          </label>
          <br />
          <label>
            Client Name:
            <input type="text" className="bookingInput" value={selectedBooking ? selectedBooking.clientName : ''} readOnly />
          </label>
          <br />
          <label>
            Destination:
            <input type="text" className="bookingInput" value={selectedBooking ? selectedBooking.destination : ''} readOnly />
          </label>
          <br />
          <label>
            Bound For:
            <input type="text" className="bookingInput" value={selectedBooking ? selectedBooking.boundFor : ''} readOnly />
          </label>
          <br />
          <label>
            Time and Date:
            <input
              type="text"
              className="bookingInput"
              value={
                selectedBooking
                  ? `${new Date(selectedBooking.timeAndDate).toISOString().split('T')[0]} ${new Date(selectedBooking.timeForBound).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : ''
              }
              readOnly
            />
          </label>

          <label>
            Return Date:
            <input type="text" className="bookingInput" value={selectedBooking ? selectedBooking.returnDate : ''} readOnly />
          </label>
            <label>
              Plate Number
              <select className="bookingInput"  value={selectedPlateNumber} onChange={handlePlateNumberChange} required>
                <option value="" disabled>
                  Select Plate Number
                </option>
                {availablePlateNumbers.map(({ plateNumber}) => (
                  <option key={plateNumber} value={plateNumber}>
                    {plateNumber}
                  </option>
                ))}
              </select>
              <p>
                Status: {selectedPlateNumberStatus}
              </p>
              {/* <p>Seats: {selectedPlateNumberSeats} </p> */}
            </label>

            <label>
              Drivers
              <select className="bookingInput" onChange={handleDriverChange} required>
                <option value="" disabled>
                  Select Driver
                </option>
                {availableDrivers.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <p>
                Status:
                {selectedDriverStatus}
              </p>
            </label>
            <div>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>{" "}
          <Button variant="success" onClick={() => handleCompleteBooking(selectedBooking, formData,  selectedPlateNumberStatus, selectedBooking.passengerNames)}>
              Complete Booking
          </Button>

          </div>
          </form>
        </Modal.Body>
      </Modal>
      </div>
      </div>
    </>
  );
};

export default TripReport;