import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
 
} from 'mdb-react-ui-kit';
import format from "date-fns/format";
 import DatePicker from "react-datepicker";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
  
  // "fil-PH": require("date-fns/locale/fil-PH"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});



export default function AddBooking() {
    const [scrollableModal, setScrollableModal] = useState(false);
    
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });

  // const [allEvents, setAllEvents] = useState(events);
  const [allEvents, setAllEvents] = useState([
    {
      title: "Big Meeting",
      allDay: true,
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 1),
    },
    // Add other events as needed...
  ]);



  const [formData, setFormData] = useState({
    plateNumber: '',
    driverName: '',
    clientName: '',
    passengerQuantity: '',
    destination: 'WOS',
    boundFor: '',
    timeAndDate: '',
    returnDate: '',
    purpose: '',
  });

  function handleAddEvent() {
    setAllEvents([...allEvents, newEvent]);
  }


  const handlebookingsub = async (e) => {
  e.preventDefault();


   // Send a POST request to the server
   try {
    const response = await fetch('http://localhost:3000/addbook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Handle success, e.g., clear the form or close the modal
      setFormData({
        plateNumber: '',
        driverName: '',
        clientName: '',
        passengerQuantity: '',
        destination: 'WOS',
        boundFor: '',
        timeAndDate: '',
        returnDate: '',
        purpose: '',
      });
      setScrollableModal(!setScrollableModal);
    } else {
      // Handle error
      console.error('Error while submitting the form');
    }
  } catch (error) {
    // Handle network error
    console.error('Network error:', error);
  }

  };


// function AddBooking() {
  return (
    <>
    {/* <MDBBtn onClick={() => setScrollableModal(!scrollableModal)}>LAUNCH DEMO MODAL</MDBBtn>

    <MDBModal open={scrollableModal} setOpen={setScrollableModal} tabIndex='-1' className='addB_Container'> */}
      {/* <MDBModalDialog className=' mt-0 '  size='fullscreen-xl-down' position='right' side > */}
      <MDBModalDialog className=' mt-0 '  size='fullscreen-xl-down' position='right'  >

        <MDBModalContent >
          <MDBModalHeader>
            <MDBModalTitle>Add Booking</MDBModalTitle>
            <button
              className='btn-close'
              color='none'
              onClick={() => setScrollableModal(!setScrollableModal)}
             > </button>
          </MDBModalHeader>
          <MDBModalBody className='addbookingscroll'>
          <div>
  <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Add Title" style={{ width: "20%", marginRight: "10px" }} 
                value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />

                <DatePicker placeholderText="Start Date" style={{ marginRight: "10px" }} 
                selected={newEvent.start} onChange={(start) => setNewEvent({ ...newEvent, start })} />

                <DatePicker placeholderText="End Date" selected={newEvent.end}
                 onChange={(end) => setNewEvent({ ...newEvent, end })} />


                <button style={{ marginTop: "10px" }} onClick={handleAddEvent}>
                    Add Event
                </button>

                </form>
            </div>
           <form id='addbook' onSubmit={handlebookingsub}>
                <label>
                    PLATE NUMBER
                    <input type="text" className='bookingInput'  value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} />
                </label>
                <label>
                 DRIVER’s NAME
                    <input type="text" className='bookingInput'  value={formData.driverName} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}/>
                </label>
                <label>
                    CLIENT NAME
                    <input type="text" className='bookingInput' value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} />
                </label>
                <label>
                PASSENGER QUANTITY
                    <input type="number" className='bookingInput' value={formData.passengerQuantity} onChange={(e) => setFormData({ ...formData, passengerQuantity: e.target.value })} />
                </label>
                <label>
                DESTINATION
                <select className='bookingInput' value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })}>
                    <option value='WOS'>Within Official Station </option>
                    <option value='BOS'>Beyond Official Station </option>
                </select>
                </label>
                <label>
                    BOUND FOR
                    <input type="text" className='bookingInput' value={formData.boundFor} onChange={(e) => setFormData({ ...formData, boundFor: e.target.value })}/>
                </label>
                <label>
                TIME & DATE
                    <input type="datetime-local" className='bookingInput' value={formData.timeAndDate} onChange={(e) => setFormData({ ...formData, timeAndDate: e.target.value })}/>
                </label>
                <label>
                RETURN DATE
                    <input type="datetime-local" className='bookingInput' value={formData.returnDate} onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}/>
                </label>
                <label>
                PURPOSE
                    <input type="text" className='bookingInput' style={{ height: '250px' }} value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} />
                </label>
                <button type='submit' className='submitBooking'>Add</button>
                <button className='cancelBooking' onClick={() => setScrollableModal(!setScrollableModal)}>
              Cancel </button>
           
            

            </form>
 
   
          </MDBModalBody>

        </MDBModalContent>
      </MDBModalDialog>
    {/* </MDBModal> */}
  </>
// );
// }
  )
}

// export default AddBooking