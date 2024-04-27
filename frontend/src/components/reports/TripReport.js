import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FaHistory } from "react-icons/fa";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import logo from "../logo.png";
import otherLogo from "../another-logo.png";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { FcDownload } from "react-icons/fc";
import HeaderReport from "../reports/HeaderReport";
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
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedPlateNumber, setSelectedPlateNumber] = useState(null);
  // const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };
  const handleCompleteBooking = () => {
    // Logic for completing the booking goes here
    console.log("Booking completed:", selectedBooking);
    handleCloseModal();
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

      doc.setFontSize(10); // Adjust font size here
      doc.text("Fortich St. Malaybalay City, Bukidnon 8700", 74, 30);

      doc.addImage(logo, "PNG", 30, 15, 20, 18);
      doc.addImage(otherLogo, "PNG", 157, 15, 20, 18);

      doc.setFontSize(14); // Adjust font size here
      doc.text(
        "NUMBER OF TRIP PER VEHICLE FOR THE MONTH OF APRIL 2024",
        33,
        55
      );

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
      doc.setFont(undefined, "bold"); // Set font weight to bold
      doc.text("GSU - Motorpool Section", 83, 45);

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

      doc.setFont("times"); // Set font to Times New Roman
      doc.setFontSize(17); // doc.setFont('helvetica', 'bold'); // Set font to bold
      doc.text("BUKIDNON STATE UNIVERSITY", 58, 25);

      // doc.setFont('times'); // Set font to Times New Roman
      // doc.setFontSize(17); // doc.setFont('helvetica', 'bold'); // Set font to bold
      // doc.text("BUKIDNON STATE UNIVERSITY", 57, 25);

      // const tableData = bookingData.map((booking, index) => [
      //   booking.vehicleName,
      //   booking.plateNumber,
      //   booking.destination,
      // ]);
      //Brendyl Ani

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
      // // Inside your tableData mapping function
      // const tableData = await Promise.all(
      //   Array.from(uniquePlateNumbers).map(async (plateNumber) => {
      //     const vehicleName = await getVehicleName(plateNumber);
      //     const trips = tripsPerVehicle[plateNumber] || 0;
      //     return [plateNumber, vehicleName, trips];
      //   })
      // );

      // const tableData = Object.keys(tripsPerVehicle).map((plateNumber) => {
      //   const vehicleName = bookingData.find(
      //     (booking) => booking.plateNumber === plateNumber
      //   ).vehicleName;
      //   return [vehicleName, plateNumber, tripsPerVehicle[plateNumber]];
      // });
      // const tableData = Object.keys(tripsPerVehicle).map((plateNumber) => {
      //   return [plateNumber, tripsPerVehicle[plateNumber]];
      // });

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

      // Add content to the PDF
      // doc.addImage(logo, 'PNG', 50, 15, 20, 18);

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

      // Add vehicle details
      //  filteredData.forEach((booking, index) => {
      //    const startY = 80 + index * 30;
      //    doc.text(`Plate No.: ${booking.plateNumber}`, 14, startY);
      //    doc.text(`Destination: ${booking.destination}`, 14, startY + 7);
      //    doc.text(`Bound For: ${booking.boundFor}`, 14, startY + 14);
      //    doc.text(`Departure: ${formatTime(booking.timeForBound)}`, 14, startY + 21);
      //    doc.text(`Return: ${formatTime(booking.returnDate)}`, 14, startY + 28);
      //  });

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

      // Save the PDF
      //     doc.save("booking_request_letter.pdf");
      //   } catch (error) {
      //     console.error("Error generating PDF:", error);
      //   }
      // };
      // const tableData = bookingData.map((booking) => [
      //   booking.plateNumber,
      //   booking.boundFor,
      //   booking.destination,
      //   formatDateTime(booking.timeForBound),
      //   formatDateTime(booking.returnDate),
      // ]);
      // doc.autoTable({
      //   startY: 60,
      //   head: [
      //     [
      //       {
      //         content: "MOTOR VEHICLE USED REQUEST FORM",
      //         colSpan: 2,
      //         styles: {
      //           fontStyle: "bold",
      //           font: "times",
      //           fontSize: 12,
      //           halign: "center",
      //         },
      //       },
      //     ],
      //     [
      //       {
      //         content: "Office/Department/Unit Name of Organization",
      //         styles: {
      //           fontStyle: "bold",
      //           font: "times",
      //           fontSize: 11,
      //           halign: "center",
      //         },
      //       },
      //       {
      //         content: "Name",
      //         styles: {
      //           fontStyle: "bold",
      //           font: "times",
      //           fontSize: 12,
      //           halign: "right",
      //         },
      //       },
      //       {
      //         content: "AZSDASD",
      //         styles: {
      //           fontStyle: "bold",
      //           font: "times",
      //           fontSize: 12,
      //           halign: "center",
      //         },
      //       },
      //     ],
      //     [
      //       {
      //         content: "Additional Line 1",
      //         styles: {
      //           fontStyle: "bold",
      //           font: "times",
      //           fontSize: 11,
      //           halign: "center",
      //         },
      //       },
      //       {
      //         content: "Additional Line 2",
      //         styles: {
      //           fontStyle: "bold",
      //           font: "times",
      //           fontSize: 12,
      //           halign: "right",
      //         },
      //       },
      //     ],
      //     [
      //       {
      //         content: "Header 3",
      //         styles: {
      //           fontStyle: "bold",
      //           font: "times",
      //           fontSize: 11,
      //           halign: "center",
      //         },
      //       },
      //       {
      //         content: "Header 4",
      //         styles: {
      //           fontStyle: "bold",
      //           font: "times",
      //           fontSize: 11,
      //           halign: "center",
      //         },
      //       },
      //       {}, // Empty cell to align with the next header
      //       {}, // Empty cell to align with the next header
      //     ],
      //   ],
      //   body: [
      //     [
      //       {
      //         content: "Content 1",
      //         styles: { font: "times", fontSize: 11, halign: "left" },
      //       },
      //       {
      //         content: "Content 2",
      //         styles: { font: "times", fontSize: 11, halign: "center" },
      //       },
      //       {
      //         content: "Content 3",
      //         styles: { font: "times", fontSize: 11, halign: "right" },
      //       },
      //       {
      //         content: "Content 4",
      //         styles: { font: "times", fontSize: 11, halign: "right" },
      //       },
      //     ],
      //     [
      //       {
      //         content: "Content 5",
      //         styles: { font: "times", fontSize: 11, halign: "left" },
      //       },
      //       {
      //         content: "Content 6",
      //         styles: { font: "times", fontSize: 11, halign: "center" },
      //       },
      //       {
      //         content: "Content 7",
      //         styles: { font: "times", fontSize: 11, halign: "right" },
      //       },
      //       {
      //         content: "Content 8",
      //         styles: { font: "times", fontSize: 11, halign: "right" },
      //       },
      //     ],
      //   ],
      //   headStyles: {
      //     fillColor: [220, 220, 220], // Light gray background color for header
      //     textColor: [0, 0, 0], // Black text color for header
      //     lineColor: [0, 0, 0], // Set header cell border color
      //     lineWidth: 0.2, // Set header cell border width
      //     fontStyle: "normal", // Reset font style to normal
      //     font: "times", // Set font to Times New Roman
      //   },
      //   bodyStyles: {
      //     fillColor: false, // Remove background color for body cells
      //     fontSize: 11,
      //     textColor: [0, 0, 0], // Black text color for body
      //     lineColor: [0, 0, 0], // Set body cell border color
      //     lineWidth: 0.2, // Set body cell border width
      //   },
      //   tableLineWidth: 0.2, // Set table border width
      //   tableLineColor: [0, 0, 0], // Set table border color
      //   margin: { top: 0 }, // Adjust table margin if needed
      //   didDrawPage: function (data) {
      //     // Calculate the height of the table
      //     const tableHeight = doc.autoTable.previous.finalY;

      //     // Add "Prepared by:" text
      //     doc.setFontSize(12); // Adjust font size here
      //     doc.text("Prepared by:", 15, tableHeight + 20);
      //   },
      // });
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
      // } else {
      //           console.error("Booking details not found");
      //       }
      //   } else {
      //       console.error("No plate number selected");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  useEffect(() => {
    // Fetch booking data from the server
    const fetchBookingData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/allbook"); // Replace with your actual API endpoint
        const data = response.data;

        // Update the state with the fetched data
        setBookingData(data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    // Call the fetch function
    fetchBookingData();
  }, []);

  const handleEdit = (index) => {
    setEditableData({ ...bookingData[index] });
  };

  const handleChange = (e, key) => {
    const { value } = e.target;
    setEditableData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSubmit = async (index) => {
    try {
      // Update data in the database
      await axios.put(
        `http://localhost:3000/editbook/${editableData._id}`,
        editableData
      );

      // Update data in the UI
      const updatedBookingData = [...bookingData];
      updatedBookingData[index] = editableData;
      setBookingData(updatedBookingData);

      // Clear editable data
      setEditableData({});
    } catch (error) {
      console.error("Error updating booking data:", error);
    }
  };

  const handleDeleteBooking = async (plateNumber) => {
    // Ask for confirmation before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) {
      return; // If user cancels, exit the function
    }

    try {
      const response = await axios.delete(
        `http://localhost:3000/deletebook/${plateNumber}`
      );
      if (response.data.success) {
        // Remove the deleted booking from the state
        setBookingData((prevData) =>
          prevData.filter((booking) => booking.plateNumber !== plateNumber)
        );
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
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

  const filteredData = bookingData.filter((booking) =>
    booking[searchField].toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <>
      <div>
        <button onClick={generatePDF} className="generate-button">
          Generate Report
        </button>
      </div>
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
          <option value="plateNumber">PLATE NO.</option>
          <option value="boundFor"> DESTINATION</option>
          <option value="timeForBound">DEPARTURE</option>
          <option value="returnDate">RETURN</option>
        </select>
      </div>
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
      {/* <div className='Report-container'>
        <div className='report-wrapper'> */}
      <div className="TableReportContainer">
        <table className="reportTable">
          <thead>
            <tr>
              <th>PLATE NO.</th>
              <th>DESTINATION</th>
              <th>OFFICE</th>
              <th>DEPARTURE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          {filteredData.length > 0 ? (
            <tbody>
              {/* {bookingData.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.plateNumber}</td>
                    <td>{booking.boundFor}</td>
                    <td>{booking.destination}</td>
                    <td>{formatDateTime(booking.timeForBound)}</td>
                    <td>{formatDateTime(booking.returnDate)}</td>
                
                    <td>
                    <button type="button" class="btn btn-warning btn-sm" onClick={() => handleEditBooking(booking.plateNumber)}>Edit</button>&nbsp; 
                      <button type="button" class="btn btn-warning btn-sm">Edit</button>&nbsp;  */}
              {/* {bookingData.map((booking, index) => ( */}
              {filteredData.map((booking, index) => (
                <tr key={booking._id}>
                  <td>
                    {editableData._id === booking._id ? (
                      <input
                        type="text"
                        value={editableData.plateNumber}
                        onChange={(e) => handleChange(e, "plateNumber")}
                        required
                      />
                    ) : (
                      booking.plateNumber
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
                    {isBookingDatePassed(booking.timeAndDate) ? (
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleCompleteBooking(booking)}
                      >
                        Complete
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => handleOpenModal(booking)}
                      >
                        Pending
                      </button>
                    )}
                  </td>
                  <td>
                    {editableData._id === booking._id ? (
                      <>
                        <button
                          type="button"
                          class="btn btn-success btn-sm"
                          onClick={() => handleSubmit(index)}
                        >
                          Submit
                        </button>
                        &nbsp;
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          onClick={() => setEditableData({})}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        class="btn btn-warning btn-sm"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>
                    )}
                    {/* &nbsp;<button type="button" class="btn btn-danger btn-sm">Delete</button> */}
                    &nbsp;{" "}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleToggleBooking(booking)}
                    >
                      {booking.isActive ? "Activate" : "Archive"}
                    </button>
                    {/* <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteBooking(booking.plateNumber)}
                    >
                      Delete
                    </button> */}
                    {/*      <button
                    onClick={handleGenerateReport}

                      className="actionBtn "
                    >
                      <FcDownload />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <p>No data available</p>
          )}
        </table>
      </div>

      {/* <DataTable value={bookingData}
            size="large"
            showGridlines
            removableSort
            paginator rows={9}>
            <Column field="plateNumber" header="Plate No." />
            <Column field="boundFor" header="Departure" />
            <Column field="destination" header="Destination" />
            <Column field="timeForBound" header="Departure" body={(rowData) => formatDateTime(rowData.timeForBound)} sortable />
            <Column field="returnDate" header="Return" body={(rowData) => formatDateTime(rowData.returnDate)} sortable />
            <Column header="Action" body={() => (
              <React.Fragment>
                <FaHistory className='actionBtn' />
               <button onClick={handleGenerateReport} className='actionBtn btn-primary'>
                  <IoDocumentAttachOutline />
                  </button>
              </React.Fragment>
            )} />
          </DataTable> */}
      {/* </div>
      </div> */}
      {/* Modal for completing booking */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Complete the booking for /NAME SA CLIENT DAPAT/</p>
          <form>
            <label>
              Plate Number
              <select className="bookingInput" required>
                <option value="" disabled>
                  Select Plate Number
                </option>
                {/* {plateNumbers.map(({ plateNumber }) => (
                  <option key={plateNumber} value={plateNumber}>
                    {plateNumber}
                  </option>
                ))} */}
              </select>
              <p>
                Status:
                {/* {selectedPlateNumberStatus} */}
              </p>
              <p>Seats: </p>
            </label>

            <label>
              Drivers
              <select className="bookingInput" required>
                <option value="" disabled>
                  Select Available Driver
                </option>
                {/* {plateNumbers.map(({ plateNumber }) => (
                  <option key={plateNumber} value={plateNumber}>
                    {plateNumber}
                  </option>
                ))} */}
              </select>
              <p>
                Status:
                {/* {selectedPlateNumberStatus} */}
              </p>
            </label>
          </form>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>{" "}
          <Button variant="success" onClick={handleCompleteBooking}>
            Complete Booking
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TripReport;
