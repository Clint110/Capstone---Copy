import React, { useState, useEffect } from 'react';
import map from "../images/map.jpg";
import Reminder from './Reminder';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import io from 'socket.io-client';
import { BsExclamationLg } from "react-icons/bs";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { MdDangerous } from "react-icons/md";

function Map() {
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  // const [coordinates, setCoordinates] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [mapKey, setMapKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prevVisible) => !prevVisible);
  };

  const containerStyle = {
    width: '900px',
    height: '500px',
  };

  useEffect(() => {
    const fetchDataFromDatabase = async () => {
      try {
        const response = await fetch('http://localhost:3000/get-data');
        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          // Check if responseData contains 'data' array and it has at least one element
          if (responseData.data && responseData.data.length > 0) {
            const { longitude, latitude } = responseData.data[0];
            console.log(longitude, latitude);
            setCoordinates({ longitude, latitude });

            setMapKey(prevKey => prevKey + 1);
          } else {
            console.error('Latitude or longitude data is undefined');
          }
        } else {
          console.error('Failed to fetch data from the server');
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };
  
    fetchDataFromDatabase();

  // useEffect(() => {
  //   const fetchDataFromDatabase = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3000/get-latest-data');
  //       if (response.ok) {
  //         const responseData = await response.json();
  //         console.log(responseData);
  //         if (responseData.data) {
  //           const { longitude, latitude } = responseData.data;
  //           console.log(longitude, latitude);
  //           setCoordinates([{ longitude, latitude }]); 
  //         } else {
  //           console.error('Latitude or longitude data is undefined');
  //         }
  //       } else {
  //         console.error('Failed to fetch data from the server');
  //       }
  //     } catch (error) {
  //       console.error('Error during fetch:', error);
  //     }
  //   };
  
  //   fetchDataFromDatabase();

    ////BRENDYL BRENDYL BRENDYL 
    // Set up interval to fetch data every 20 seconds
    const interval = setInterval(fetchDataFromDatabase, 20000);
     
 
  // Establish connection with Flask SocketIO server
  const socket = io('http://192.168.1.243:8766'); // Adjust the URL to match your Flask server's IP and port

  // Handle connection
  socket.on('connect', () => {
    console.log('Connected to Flask SocketIO server');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Disconnected from Flask SocketIO server');
  });

  // Handle received message
  socket.on('received_message', (messageData) => {
    console.log('Received message from Flask SocketIO server: kani', messageData);
    // Handle the received message as needed in your React component

  if (
    messageData &&
    messageData.longitude === 125.1253695 &&
    messageData.latitude === 8.1569808
    
  ) {
    // alert("The vehicle is now outside the school area or premises");
    setShowModal(true);
  }
});

  // Cleanup function
  return () => {
    socket.disconnect(); // Disconnect the socket when the component unmounts
  };
}, []); // Empty dependency array ensures this effect runs only once



// useEffect(() => {
//   // Establish connection with Flask SocketIO server
//   const socket = io('http://192.168.1.243:8765'); // Adjust the URL to match your Flask server's IP and port

//   // Handle connection
//   socket.on('connect', () => {
//     console.log('Connected to Flask SocketIO server');
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('Disconnected from Flask SocketIO server');
//   });

//   // Handle received message
//   socket.on('received_message', async (messageData) => {
//     console.log('Received message from Flask SocketIO server:', messageData);
    
//     // Extract required fields from the received message data
//     const { content } = messageData;
//     const lines = content.split('\n');
//     let plateNumber, latitude, longitude;

//     lines.forEach(line => {
//       const parts = line.split(':');
//       const key = parts[0].trim();
//       const value = parts[1].trim();

//       if (key.toLowerCase() === 'platenumber') {
//         plateNumber = value;
//       } else if (key.toLowerCase() === 'latitude') {
//         latitude = value;
//       } else if (key.toLowerCase() === 'longitude') {
//         longitude = value;
//       }
//     });

//     // Upload extracted data to the database
//     try {
//       const response = await fetch('http://localhost:3000/store-data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ plateNumber, latitude, longitude })
//       });

//       if (response.ok) {
//         console.log('Data uploaded to the database successfully');
//       } else {
//         console.error('Failed to upload data to the database');
//       }
//     } catch (error) {
//       console.error('Error during fetch:', error);
//     }
//   });

//   // Cleanup function
//   return () => {
//     socket.disconnect(); // Disconnect the socket when the component unmounts
//   };
// }, []);

  
useEffect(() => {
  // Establish connection with Flask SocketIO server
  const socket = io('http://192.168.1.243:8766'); // Adjust the URL to match your Flask server's IP and port

  // Handle connection
  socket.on('connect', () => {
    console.log('Connected to Flask SocketIO server');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Disconnected from Flask SocketIO server');
  });

  // Handle received message
  socket.on('received_message', async (messageData) => {
    console.log('Received message from Flask SocketIO server:', messageData);

    // if (
    //   messageData &&
    //   messageData.longitude === 125.1253695 &&
    //   messageData.latitude === 8.1569808
    // ) {
    //   // If coordinates match, set showModal to true
    //   setShowModal(true);
    // }

    
    if (messageData && typeof messageData.content === 'string') {
    // Extract required fields from the received message data
    const { content } = messageData;
    const { time } = messageData;

    // const parts = content.split('\n'); 
    const parts = content.split(/(?<=\d)(?=[a-zA-Z])/);

    console.log('Parts:', parts);

    let plateNumber, latitude, longitude;
  
    parts.forEach(part => {
      const keyValue = part.split(':');
      if (keyValue.length === 2) { // Check if keyValue array has exactly 2 elements
        const key = keyValue[0].trim();
        const value = keyValue[1].trim();
  
        if (key.toLowerCase() === 'plat') {
          plateNumber = value;
        } else if (key.toLowerCase() === 'lat') {
          latitude = parseFloat(value);
        } else if (key.toLowerCase() === 'long') {
          longitude = parseFloat(value);
        }
      }
    });

    console.log('Plate Number:', plateNumber); // Log plateNumber to check its value
    console.log('Latitude:', latitude); // Log latitude to check its value
    console.log('Longitude:', longitude);

    // Extract the hour, minute, and second from the time
    const timeParts = time.split(':');
    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);
    const second = parseInt(timeParts[2]);
  
    console.log('Time:', hour, minute, second);

    if(longitude ==125.1253695 && latitude == 8.1569808) {
      setShowModal(true);
      // setShowConfirmationModal(true);
    }

    // Check if plateNumber exists in the database
    if (longitude !== undefined && latitude !== undefined && plateNumber !== undefined) {
      // Upload extracted data to the database
    try {
      const response = await fetch(`http://localhost:3000/check-plate/${plateNumber}`);
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          // Plate number exists in the database, update latitude and longitude
          const updateResponse = await fetch(`http://localhost:3000/update-data/${plateNumber}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ latitude, longitude })
          });
          if (updateResponse.ok) {
            console.log(`Data for plate number ${plateNumber} updated successfully`);
            //window.location.reload();
          } else {
            console.error(`Failed to update data for plate number ${plateNumber}`);
          }
        } else {
          console.log(`Plate number ${plateNumber} does not exist in the database`);
        }
      } else {
        console.error('Failed to check plate number in the database');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  } else {
    // Alert if any required field is missing
    console.log('No data for longitude, latitude, or plateNumber');
  }
} else {
  // Handle the case when 'content' is not a string or does not exist
  console.error('Invalid message format:', messageData);
}
  });
  
  // Cleanup function
  return () => {
    socket.disconnect(); // Disconnect the socket when the component unmounts
  };
}, []);



  // const googleMapUrl = `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;

  const latitude = coordinates.latitude.toString();
  const longitude = coordinates.longitude.toString();

  // Google Maps URL
  const googleMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}&t=&z=17&ie=UTF8&iwloc=B&output=embed`;
  

  // const googleMapUrl = `https://www.google.com/maps/embed/v1/view?key=empty&zoom=10&center=0,0${coordinates.length > 0 ? coordinates.map(coordinate => `&markers=${coordinate.latitude},${coordinate.longitude}`).join('') : ''}`;
  return (
    <>
    <div className='Map-container'>
{/* <button onClick={toggleVisibility} style={{ zIndex: 4, position: 'absolute' }}>
        {isVisible ? 'Hide Containers' : 'Show Containers'}
      </button> */}

        {/* <img className="map" src={map}  style={{ width: '900px', height: '500px' }} /> */}

        <iframe
          key={mapKey} // Use key prop to force re-render of the map
            width="900"
            height="500"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={googleMapUrl}
          >
            <a href="https://www.maps.ie/population/">Calculate population in area</a>
          </iframe>
       
    </div>
    {/* </div> */}
    {showModal && (
   
    <div class="container">
      <input type="checkbox" id="check"/>


      <div class="show_button" for="check"> 
      <header>Departure Confirmation 
        <p>Plate number [insert plate number] has successfully exited the premise. Thank you!</p></header>
        <div class="btns">
          <label for="check" onClick={() => setShowModal(false)}>Proceed</label>
      </div>
      
      {/* <div class="background"></div>
      <div class="alert_box show_button" for="check">
        <div class="iconNi">
        <BsExclamationLg style={{
      color: "#000000" , fontSize:"90px"
    }} />
        </div>
        <header>Departure Confirmation</header>
        <p>Plate number [insert plate number] has successfully exited the premise. Thank you!</p>
        <div class="btns">
          <label for="check" onClick={() => setShowModal(false)}>Proceed</label>
        </div>
      </div> */}
    </div>
    </div>
  
       )}
    </>
  );
}

export default Map;