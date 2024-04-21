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
      doc.text("Fortich St. Malaybalay City, Bukidnon", 77, 30);

      doc.addImage(logo, "PNG", 30, 15, 20, 18);
      doc.addImage(otherLogo, "PNG", 157, 15, 20, 18);

      let yPos = 140;
      doc.setFontSize(12); // Adjust font size here
      doc.text("Prepared by:", 15, yPos);
      yPos += 10; // Adjust margin as needed

      let yPos1 = 180;
      const leftMarginVerifiedBy = 10; // Adjust the left margin for "Verified by:" as needed
      doc.setFontSize(12); // Adjust font size here
      doc.text("Verified by:", 15 + leftMarginVerifiedBy, yPos1); // Adjusted x-coordinate
      yPos1 += 10; // Adjust margin as needed

      let yPos2 = 180;
      const leftMarginNotedBy = 130; // Adjust the left margin for "Verified by:" as needed
      doc.setFontSize(12); // Adjust font size here
      doc.text("Noted by:", 15 + leftMarginNotedBy, yPos2); // Adjusted x-coordinate
      yPos1 += 10; // Adjust margin as needed

      doc.setFontSize(14); // Adjust font size here
      doc.text("NUMBER OF TRIP PER VEHICLE", 68, 60);

      doc.setFontSize(11); // Adjust font size here
      doc.text("Administrative Aide III", 25, 158);

      doc.setFontSize(11); // Adjust font size here
      doc.text(
        "Supervisor,Transportation Service (Motorpool Section)",
        22,
        200
      );

      doc.setFontSize(11); // Adjust font size here
      doc.text("Head, GSU", 160, 200);

      doc.setFontSize(14); // Adjust font size here
      doc.setFont(undefined, "bold"); // Set font weight to bold
      doc.text("Month of April 2024", 85, 67);

      doc.setFontSize(12); // Adjust font size here
      doc.text("SNIFFY L. TIMONES", 25, 153);
      const textWidth = doc.getStringUnitWidth("SNIFFY L. TIMONES") * 4.5; // Adjust 12 to the font size used
      const startX = 24; // Adjust as needed
      const startY = 152 + 1; // Adjust to position the underline below the text
      doc.line(startX, startY, startX + textWidth, startY); // Draw a line below the text

      const topMargin = 10; // Adjust the top margin as needed
      const leftMargin = 25; // Adjust the left margin as needed
      doc.setFontSize(12); // Adjust font size here
      const text = "ERIC L. GULTIANO";
      const textWidth3 = doc.getStringUnitWidth(text) * 4.5; // Adjust 12 to the font size used
      const startX3 = 24 + leftMargin; // Adjust as needed
      const startY3 = 185 + topMargin; // Adjust to position the text below the top margin
      doc.text(text, 25 + leftMargin, 185 + topMargin); // Adjusted y-coordinate for the text
      doc.line(startX3, startY3, startX3 + textWidth3, startY3); // Adjusted start and end positions for the line

      const topMarginNew = 10; // Adjust the top margin as needed for the new copy
      const leftMarginNew = 120; // Adjust the left margin as needed for the new copy
      doc.setFontSize(12); // Adjust font size here for the new copy
      const textNew = "KRISTINE FIVI O. GEWAN";
      const textWidthNew = doc.getStringUnitWidth(textNew) * 4.5; // Adjust 12 to the font size used for the new copy
      const startXNew = 24 + leftMarginNew; // Adjust as needed for the new copy
      const startYNew = 185 + topMarginNew; // Adjust to position the text below the top margin for the new copy
      doc.text(textNew, 25 + leftMarginNew, 185 + topMarginNew); // Adjusted y-coordinate for the text for the new copy
      doc.line(startXNew, startYNew, startXNew + textWidthNew, startYNew); // Adjusted start and end positions for the line for the new copy

      doc.setFontSize(12); // Adjust font size here
      doc.text("GSU - Motorpool Section", 83, 45);

      doc.setFont("times"); // Set font to Times New Roman
      doc.setFontSize(17); // doc.setFont('helvetica', 'bold'); // Set font to bold
      doc.text("BUKIDNON STATE UNIVERSITY", 57, 25);

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

      const tableData = Object.keys(tripsPerVehicle).map((plateNumber) => {
        const vehicleName = bookingData.find(
          (booking) => booking.plateNumber === plateNumber
        ).vehicleName;
        return [vehicleName, plateNumber, tripsPerVehicle[plateNumber]];
      });
      // const tableData = Object.keys(tripsPerVehicle).map((plateNumber) => {
      //   return [plateNumber, tripsPerVehicle[plateNumber]];
      // });

      ///here taman
      doc.autoTable({
        startY: 78,
        head: [
          [
            { content: "Vehicle", styles: { fontStyle: "bold" } },
            { content: "Plate Number", styles: { fontStyle: "bold" } },
            { content: "TOTAL NO. OF TRIP", styles: { fontStyle: "bold" } },
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

  const handleGenerateReport = () => {
    try {
      const doc = new jsPDF();

      doc.addImage(logo, "PNG", 50, 15, 20, 18);

      // doc.setFont('helvetica', 'bold'); // Set font to bold
      doc.text("Bukidnon State University", 75, 25);

      doc.setFontSize(10); // Adjust font size here
      doc.text("Malaybalay City, Bukidnon", 86, 32);

      doc.setFontSize(12); // Adjust font size here
      doc.text("GENERAL SERVICE UNIT", 83, 50);

      doc.setFontSize(12); // Adjust font size here
      doc.text("TRANSPORTATION SERVICE (Motorpool Section)", 69, 55);

      // doc.setFontSize(13); // Adjust font size here
      // doc.text('Within and Beyond Official Station', 72, 67);

      // const tableData = bookingData.map((booking, index) => [
      //   booking.plateNumber,
      //   booking.boundFor,
      //   booking.destination,
      //   formatDateTime(booking.timeForBound),
      //   formatDateTime(booking.returnDate),
      // ]);
      const rowCount = 18;
      const cellsPerRow = 4;
      const tableData = [];

      // Initialize the table with empty strings
      for (let i = 0; i < rowCount; i++) {
        const row = [];
        for (let j = 0; j < cellsPerRow; j++) {
          row.push("");
        }
        tableData.push(row);
      }

      // Now you can put different text inside each cell as needed
      // For example, to set the text in the first cell of the first row:
      tableData[0][0] = "Text for row 1, cell 1";
      tableData[0][1] = "Text for row 1, cell 2";
      tableData[0][2] = "Text for row 1, cell 2";
      tableData[0][3] = "Text for row 1, cell 2";

      // To set the text in the third cell of the fifth row:
      tableData[4][2] = "Text for row 5, cell 3";

      doc.autoTable({
        startY: 87,
        head: [["MOTOR VEHICLE USED REQUEST FORM"]],
        body: tableData,

        headStyles: {
          fillColor: [255, 255, 255], // White background for header
          textColor: [0, 0, 0], // Black text color for header
          lineColor: [0, 0, 0], // Set header cell border color
          lineWidth: 0.2, // Set header cell border width
          halign: "center", // Center align the header content horizontally
          fontSize: 11, // Adjust font size of the header
          fontStyle: "arialnarrow", // Set font style to Arial Narrow
        },
        bodyStyles: {
          fillColor: false, // Remove background color for body cells
          // fontStyle: 'bold',
          // fontSize: 11,
          textColor: [0, 0, 0], // Black text color for body
          lineColor: [0, 0, 0], // Set body cell border color
          lineWidth: 0.2, // Set body cell border width
        },
        tableLineWidth: 0.2, // Set table border width
        tableLineColor: [0, 0, 0], // Set table border color
        margin: { top: 0 }, // Adjust table margin if needed
        didDrawPage: function (data) {
          // Calculate the height of the table
          const tableHeight = doc.autoTable.previous.finalY;

          // Add "Prepared by:" text
          doc.setFontSize(12); // Adjust font size here
          doc.text("Prepared by:", 15, tableHeight + 20);
        },
      });
      // Convert the PDF content into a data URL
      const dataUri = doc.output("datauristring");

      // Create a new HTML file with the PDF content
      const htmlContent = `<html><head><title>Vehicle Trip Report</title></head><body><iframe width="100%" height="100%" src="${dataUri}"></iframe></body></html>`;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      // Open the new HTML file in a new tab
      window.open(url, "_blank");
      doc.save("individual Report.pdf");
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
        {/* <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="plateNumber">PLATE NO.</option>
          <option value="boundFor"> BOUND FOR</option>
          <option value="destination">DESTINATION</option>
          <option value="timeForBound">DEPARTURE</option>
          <option value="returnDate">RETURN</option>
        </select> */}
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
              <th>BOUND FOR</th>
              <th>DEPARTURE</th>
              <th>RETURN</th>
              <th>ACTION</th>
            </tr>
          </thead>
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
                      value={editableData.destination}
                      onChange={(e) => handleChange(e, "destination")}
                      required
                    />
                  ) : (
                    booking.destination
                  )}
                </td>
                <td>
                  {editableData._id === booking._id ? (
                    <input
                      type="text"
                      value={editableData.timeForBound}
                      onChange={(e) => handleChange(e, "timeForBound")}
                      required
                    />
                  ) : (
                    booking.timeForBound
                  )}
                </td>
                <td>
                  {editableData._id === booking._id ? (
                    <input
                      type="text"
                      value={editableData.returnDate}
                      onChange={(e) => handleChange(e, "returnDate")}
                      required
                    />
                  ) : (
                    booking.returnDate
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
                    onClick={() => handleDeleteBooking(booking.plateNumber)}
                  >
                    Delete
                  </button>
                  <button onClick={handleGenerateReport} className="actionBtn ">
                    <IoDocumentAttachOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
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
    </>
  );
};

export default TripReport;
