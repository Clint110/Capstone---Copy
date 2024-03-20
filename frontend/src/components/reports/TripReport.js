import React , {useEffect, useState} from 'react';
import { FaHistory } from "react-icons/fa";
import { IoDocumentAttachOutline } from "react-icons/io5";
import axios from 'axios';


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
            <h1><strong>Report</strong>    <p className="userName">Administrator</p>
    </h1>
    </div></div>

    <div className="header-wrapper">
<div className='header-container'>   
        <h1><strong>Report</strong>    <p className="userName">Administrator</p>
</h1>
</div></div>
    <div className='Report-container'>
    <div className='report-wrapper'>
      <div className='TableReportContainer'>
      <table className='reportTable'>
  <thead>
    <tr>
      <th>PLATE NO.</th>
      <th>DEPARTURE</th>
      <th>DESTINATION</th>
      <th>DEPARTURE</th>
      <th>RETURN</th>
      <th>KM</th>
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
                    <td>km</td>
                    <td>
                      <FaHistory className='actionBtn' />
                      <IoDocumentAttachOutline className='actionBtn' />
                    </td>
                  </tr>
                ))}
  </tbody>
</table>
      </div>
</div>
    </div>
    </>


  )
}

export default TripReport