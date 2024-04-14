import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FaHistory } from "react-icons/fa";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import logo from "../logo.png";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function formatDateTime(dateTimeString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  return new Date(dateTimeString).toLocaleDateString('en-US', options);
}

const TripReport = () => {
  const [bookingData, setBookingData] = useState([]);

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
  
      doc.addImage(logo, 'PNG', 50, 15, 20, 18);

      // doc.setFont('helvetica', 'bold'); // Set font to bold
      doc.text('Bukidnon State University', 75, 25);
      
  
      doc.setFontSize(10); // Adjust font size here
      doc.text('Malaybalay City, Bukidnon', 86, 32);

      doc.setFontSize(12); // Adjust font size here
      doc.text('GSU - Motorpool Section', 83, 50);

      doc.setFontSize(14); // Adjust font size here
      doc.text('NUMBER OF TRIP VEHICLE FOR THE MONTH OF APRIL 2024', 35, 60);

      doc.setFontSize(13); // Adjust font size here
      doc.text('Within and Beyond Official Station', 72, 67);

      const tableData = bookingData.map((booking, index) => [
        booking.plateNumber,
        booking.boundFor,
        booking.destination,
        formatDateTime(booking.timeForBound),
        formatDateTime(booking.returnDate)
      ]);

      doc.autoTable({
        startY: 87,
        head: [['Plate Number', 'Bound For', 'Destination', 'Time For Bound', 'Return Date']],
        body: tableData,
        headStyles: {
          fillColor: [255, 255, 255], // White background for header
          textColor: [0, 0, 0],       // Black text color for header
          lineColor: [0, 0, 0],       // Set header cell border color
          lineWidth: 0.2,             // Set header cell border width
          halign: 'center',           // Center align the header content horizontally
          fontSize: 11,               // Adjust font size of the header
          fontStyle: 'arialnarrow'    // Set font style to Arial Narrow
        },
        bodyStyles: {
          fillColor: false,           // Remove background color for body cells
          // fontStyle: 'bold',
          // fontSize: 11, 
          textColor: [0, 0, 0],       // Black text color for body
          lineColor: [0, 0, 0],       // Set body cell border color
          lineWidth: 0.2              // Set body cell border width
        },
        tableLineWidth: 0.2,          // Set table border width
        tableLineColor: [0, 0, 0],    // Set table border color
        margin: { top: 0 }            // Adjust table margin if needed
      });
      // Convert the PDF content into a data URL
      const dataUri = doc.output('datauristring');

      // Create a new HTML file with the PDF content
      const htmlContent = `<html><head><title>Monthly Trip Report</title></head><body><iframe width="100%" height="100%" src="${dataUri}"></iframe></body></html>`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // Open the new HTML file in a new tab
      window.open(url, '_blank');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleGenerateReport = () => {
    try {
      const doc = new jsPDF();
  
      doc.addImage(logo, 'PNG', 50, 15, 20, 18);

      // doc.setFont('helvetica', 'bold'); // Set font to bold
      doc.text('Bukidnon State University', 75, 25);
      
  
      doc.setFontSize(10); // Adjust font size here
      doc.text('Malaybalay City, Bukidnon', 86, 32);

      doc.setFontSize(12); // Adjust font size here
      doc.text('GSU - Motorpool Section', 83, 50);

      doc.setFontSize(14); // Adjust font size here
      doc.text('NUMBER OF TRIP VEHICLE FOR THE MONTH OF APRIL 2024', 35, 60);

      doc.setFontSize(13); // Adjust font size here
      doc.text('Within and Beyond Official Station', 72, 67);

      const tableData = bookingData.map((booking, index) => [
        booking.plateNumber,
        booking.boundFor,
        booking.destination,
        formatDateTime(booking.timeForBound),
        formatDateTime(booking.returnDate)
      ]);

      doc.autoTable({
        startY: 87,
        head: [['Plate Number', 'Bound For', 'Destination', 'Time For Bound', 'Return Date']],
        body: tableData,
        headStyles: {
          fillColor: [255, 255, 255], // White background for header
          textColor: [0, 0, 0],       // Black text color for header
          lineColor: [0, 0, 0],       // Set header cell border color
          lineWidth: 0.2,             // Set header cell border width
          halign: 'center',           // Center align the header content horizontally
          fontSize: 11,               // Adjust font size of the header
          fontStyle: 'arialnarrow'    // Set font style to Arial Narrow
        },
        bodyStyles: {
          fillColor: false,           // Remove background color for body cells
          // fontStyle: 'bold',
          // fontSize: 11, 
          textColor: [0, 0, 0],       // Black text color for body
          lineColor: [0, 0, 0],       // Set body cell border color
          lineWidth: 0.2              // Set body cell border width
        },
        tableLineWidth: 0.2,          // Set table border width
        tableLineColor: [0, 0, 0],    // Set table border color
        margin: { top: 0 }            // Adjust table margin if needed
      });

      // Save the PDF
      doc.save('Monthly Trip Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  useEffect(() => {
    // Fetch booking data from the server
    const fetchBookingData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/allbook'); // Replace with your actual API endpoint
        const data = response.data;

        // Update the state with the fetched data
        setBookingData(data);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    // Call the fetch function
    fetchBookingData();
  }, []);

  return (
    <>
      <div>
      <button onClick={generatePDF} className="generate-button">Generate Report</button>
      </div>
      <div className="header-wrapper">
        <div className='header-container'>
          <h4><strong>REPORT</strong>  </h4>   <span className="userName">Administrator <FontAwesomeIcon icon={faCircleUser} /></span>

        </div>
      </div>
      {/* <div className='Report-container'>
        <div className='report-wrapper'> */}
        <div className='TableReportContainer'>
      <table className='reportTable'>
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
  {bookingData.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.plateNumber}</td>
                    <td>{booking.boundFor}</td>
                    <td>{booking.destination}</td>
                    <td>{formatDateTime(booking.timeForBound)}</td>
                    <td>{formatDateTime(booking.returnDate)}</td>
                
                    <td>
                      <button type="button" class="btn btn-warning btn-sm">Edit</button>&nbsp; 
                      <button type="button" class="btn btn-danger btn-sm">Delete</button>
                      <button onClick={handleGenerateReport} className='actionBtn '
                      ><IoDocumentAttachOutline />
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
