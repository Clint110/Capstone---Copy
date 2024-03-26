import React , {useEffect, useState} from 'react';
import { FaHistory } from "react-icons/fa";
import { IoDocumentAttachOutline } from "react-icons/io5";
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


function formatDateTime(dateTimeString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  return new Date(dateTimeString).toLocaleDateString('en-US', options);
}


function TripReport() {

  const [bookingData, setBookingData] = useState([]);

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
    
    <div className="header-wrapper">
<div className='header-container'>   
        <h3><strong>REPORT</strong>    <p className="userName">Administrator</p>
</h3>
</div></div>
<div className='Report-container'>
    <div className='report-wrapper'>

    <DataTable value={bookingData}
        size="large"
        showGridlines
        removableSort
        paginator rows={9}>
            <Column field="plateNumber" header="Plate No."  />
            <Column field="boundFor" header="Departure" />
            <Column field="destination" header="Destination" />
            <Column field="timeForBound" header="Departure" body={(rowData) => formatDateTime(rowData.timeForBound)} sortable/>
            <Column field="returnDate" header="Return" body={(rowData) => formatDateTime(rowData.returnDate)} sortable/>
            <Column header="Action" body={() => (
              <React.Fragment>
                <FaHistory className='actionBtn' />
                <IoDocumentAttachOutline className='actionBtn' />
              </React.Fragment>
            )} />
          </DataTable>
          
   
      </div>
      </div>
    </>



  )
}

export default TripReport