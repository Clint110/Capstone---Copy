import React, { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import { IoDocumentAttachOutline } from "react-icons/io5";
import axios from "axios";
import SidebarMenu from "../SidebarMenu";
import { NavLink } from "react-router-dom";
import { BiLogOut, BiSearch } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import logo from "../sidebaraddbooking/images/buksu-logo.png";
import { FaBars } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

function TripReport() {
  const [isOpen, setIsOpen] = useState(false);
  const [editableData, setEditableData] = useState({});
  const toggle = () => {
    setIsOpen(!isOpen);
  };

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

  const routes = [
    {
      path: "/addbook",
      name: "Booking",
      icon: <FaRegCalendarCheck className="iconSidebar" />,
    },
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

  // const TripReport = () => {
  const [bookingData, setBookingData] = useState([]);

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      doc.addImage(logo, "PNG", 50, 15, 20, 18);

      // doc.setFont('helvetica', 'bold'); // Set font to bold
      doc.text("Bukidnon State University", 75, 25);

      doc.setFontSize(10); // Adjust font size here
      doc.text("Malaybalay City, Bukidnon", 86, 32);

      doc.setFontSize(12); // Adjust font size here
      doc.text("GSU - Motorpool Section", 83, 50);

      doc.setFontSize(14); // Adjust font size here
      doc.text("NUMBER OF TRIP VEHICLE FOR THE MONTH OF APRIL 2024", 35, 60);

      doc.setFontSize(13); // Adjust font size here
      doc.text("Within and Beyond Official Station", 72, 67);

      const tableData = bookingData.map((booking, index) => [
        booking.plateNumber,
        booking.boundFor,
        booking.destination,
        formatDateTime(booking.timeForBound),
        formatDateTime(booking.returnDate),
      ]);

      doc.autoTable({
        startY: 87,
        head: [
          [
            "Plate Number",
            "Bound For",
            "Destination",
            "Time For Bound",
            "Return Date",
          ],
        ],
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
      doc.text("GSU - Motorpool Section", 83, 50);

      doc.setFontSize(14); // Adjust font size here
      doc.text("NUMBER OF TRIP VEHICLE FOR THE MONTH OF APRIL 2024", 35, 60);

      doc.setFontSize(13); // Adjust font size here
      doc.text("Within and Beyond Official Station", 72, 67);

      const tableData = bookingData.map((booking, index) => [
        booking.plateNumber,
        booking.boundFor,
        booking.destination,
        formatDateTime(booking.timeForBound),
        formatDateTime(booking.returnDate),
      ]);

      doc.autoTable({
        startY: 87,
        head: [
          [
            "Plate Number",
            "Bound For",
            "Destination",
            "Time For Bound",
            "Return Date",
          ],
        ],
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
      });

      // Save the PDF
      doc.save("Monthly Trip Report.pdf");
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
            className="rounded-circle usr-image"
            height="150"
            width="150"
          /> <div className="logo-text">MoniTour</div>
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
        <div>
          <button onClick={generatePDF} className="generate-button">
            Generate Report
          </button>
        </div>
        <div className="header-wrapper">
          <div className="header-container">
            <h4>
              <strong>REPORT</strong>{" "}
            </h4>{" "}
            <span className="userName"><span className="userName-text">Secretary</span>   <FontAwesomeIcon icon={faCircleUser} className="icon-circle" /></span>
          </div>
        </div>
        {/* <div className='Report-container'>
    <div className='report-wrapper'> */}

        <div className="TableReportContainer">
          <table className="reportTable">
            <thead>
              <tr>
                <th>PLATE NO.</th>
                <th>DEPARTURE</th>
                <th>DESTINATION</th>
                <th>DEPARTURE</th>
                <th>RETURN</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {bookingData.map((booking, index) => (
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
                    {/* &nbsp;
                    <button type="button" class="btn btn-danger btn-sm">
                      Delete
                    </button> */}
                    &nbsp;{" "}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteBooking(booking.plateNumber)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleGenerateReport}
                      className="actionBtn "
                    >
                      <IoDocumentAttachOutline />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* </div>
</div> */}
        </div>
      </main>
    </div>
  );
}

export default TripReport;
