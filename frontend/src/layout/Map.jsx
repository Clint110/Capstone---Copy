import React, { useState } from 'react';
import map from "../images/map.jpg";
import Reminder from './Reminder';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

function Map() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible((prevVisible) => !prevVisible);
  };

  const containerStyle = {
    width: '900px',
    height: '500px',
  };

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

        <LoadScript googleMapsApiKey="EMPTY">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: -34.397, lng: 150.644 }}
              zoom={8}
            />
          </LoadScript>

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