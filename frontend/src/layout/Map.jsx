import React, { useState, useEffect } from 'react';
import map from "../images/map.jpg";
import Reminder from './Reminder';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

function Map() {
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [isVisible, setIsVisible] = useState(true);

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
            setCoordinates({ longitude, latitude });
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
    <div className="container-xl text-success 
                text-center p-2 
                border 
                fw-bolder alert-success">

{/* <button onClick={toggleVisibility} style={{ zIndex: 4, position: 'absolute' }}>
        {isVisible ? 'Hide Containers' : 'Show Containers'}
      </button> */}

        {/* <img className="map" src={map}  style={{ width: '900px', height: '500px' }} /> */}

        <iframe
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

<div style={{ display: isVisible ? 'flex' : 'none'}}>

 
        {/* <div className='speed-container' style={{  position: 'absolute', bottom: 0,  width: '100%', height:"190px", zIndex: isVisible ? 1 : -1 }}> */}
        {/* First Container */}
        {/* <div className="your-first-container" style={{ display: 'inline-block', width: '37%', height: '100%', backgroundColor: 'white' }}> */}
          <h1>Content of the first container </h1>          
          <h1>Content of the first container </h1>          
          <h1>Content of the first container </h1>          
          <h1>Content of the first container </h1>          

        {/* </div> */}

        {/* Second Container */}
        <div className="your-second-container" style={{ display: 'inline-block', width: '37%', height: '100%', backgroundColor: 'white'}}>
          <h1>Content of the second container </h1>
          <h1>Content of the first container </h1>          
          <h1>Content of the first container </h1>          
          <h1>Content of the first container </h1>          
          <h1>Content of the first container </h1>  <h1>Content of the first container </h1>          
          <h1>Content of the first container </h1>          
          <h1>Content of the first container </h1>          
          <h1>Content of the first container </h1> 

        </div>
      </div>

      {/* Button to Toggle Visibility */}
     


        </div>
       
    </div>
    {/* </div> */}
    </>
  );
}

export default Map;