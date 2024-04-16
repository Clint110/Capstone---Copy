import React, { useEffect, useState, useMemo} from 'react';
import car1 from "../car1.png"
import axios from 'axios'
import { MdDangerous } from "react-icons/md";
// import Data from "../Data.json"




import 'bootstrap/dist/css/bootstrap.css';
import DataTable from 'react-data-table-component'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
 import { CiSquarePlus } from "react-icons/ci";
 import { TfiSearch } from "react-icons/tfi";
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
import { IoCarSportOutline } from "react-icons/io5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

function Monitoring() {
  const [centredModal, setCentredModal] = useState(false);
  const [vehicleDetailsModalOpen, setVehicleDetailsModalOpen] = useState(false);
  const toggleOpen = () => setCentredModal(!centredModal);
  const [selectedPlateNumber, setSelectedPlateNumber] = useState(null);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);
  const [isHistoryVisible, setHistoryVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredVehicleList, setFilteredVehicleList] = useState([]);
  const [role, setUserRole] = useState('');

  const [plateNumberStatuses, setPlateNumberStatuses] = useState({});

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [plateNumberToDelete, setPlateNumberToDelete] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedPlateNumber, setEditedPlateNumber] = useState('');
  const [notPlateNumber, setnotPlateNumber] = useState('');
  const [editedVehicle, setEditedVehicle] = useState('');
  const [editedCarImage, setEditedCarImage] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [plateNumber, setPlateNumber] = useState(''); 



  const toggleVehicleDetailsModalOpen = () => {
    setVehicleDetailsModalOpen(!vehicleDetailsModalOpen);
  };

//   const toggleShowConfirmationModal = () => {
//     setShowConfirmationModal(!showConfirmationModal);
// };
  useEffect(() => {
    // Fetch vehicle status data from your server
    const fetchVehicleStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3000/vehiclestatus');
        const vehicleStatusData = response.data;
        setVehicleStatus(vehicleStatusData);
      } catch (error) {
        console.error('Error fetching vehicle status:', error);
      }
    };
    fetchVehicleStatus();
  }, []);


  const userToken = '123abcdef';


  // useEffect(() => {
  //   // Make an API call to fetch user details
  //   axios.get('/user')
  //     .then(response => {
  //       const { role } = response.data;
  //       // Update the state with the fetched role
  //       setRole(role);
  //       console.log(role);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching user details:', error);
  //     });
  // }, []);


  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('/api/user');
        console.log('Server response:', response.data); // Log the entire response for debugging
        const { role } = response.data.user;
        console.log('User role:', role); // Log the user role for debugging
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
    };
 
    fetchUserRole();
  }, []);


   


  const toggleHistory = () => {
    setHistoryVisible(!isHistoryVisible);
  };


  // const handlePlateNumberClick = async (plateNumber) => {
  //   try {
  //     // Check if the vehicle is available
  //     if (vehicleStatus[plateNumber] === 'Used') {
  //       const response = await axios.get(`http://localhost:3000/vehicle/details/${plateNumber}`);
  //       const details = response.data;
 
  //       console.log('Details:', details);
  //       // Update the state with the selected plate number and its details
  //       setSelectedPlateNumber(plateNumber);
  //       setSelectedVehicleDetails(details);
  //     } else {
  //       // Vehicle is available, show alert
  //       alert(`Vehicle with the Plate Number: ${plateNumber} is available and not in use.`);
  //       // You can also use a modal alert or any other way to display the message
  //     }
  //   } catch (error) {
  //     console.error('Error fetching vehicle details:', error);
  //   }
  // };


  // const hideVehicleList = () => {
  //   // You can add logic to hide the vehicleListRight here
  //   // For example, you might want to set a state to control its visibility
  // };






//   const [vehicleStatus, setVehicleStatus] = useState({});


//  // Define the fetchVehicleStatus function outside of the useEffect hook
//  const fetchVehicleStatus = async () => {
//   try {
//     const response = await axios.get('http://localhost:3000/vehiclestatus');
//     const vehicleStatusData = response.data;
//     setVehicleStatus(vehicleStatusData);
//   } catch (error) {
//     console.error('Error fetching vehicle status:', error);
//   }
// };

// useEffect(() => {
//   // Call the fetchVehicleStatus function inside the useEffect hook
//   fetchVehicleStatus();
// }, []);


const [vehicleStatus, setVehicleStatus] = useState({});

// Define the fetchVehicleStatus function outside of the useEffect hook
const fetchVehicleStatus = async () => {
  try {
    const response = await axios.get('http://localhost:3000/vehiclestatus');
    const vehicleStatusData = response.data;
    console.log(vehicleStatusData);
    setVehicleStatus(vehicleStatusData);

    // Update plateNumberStatuses with the latest status data
    const statusObject = {};
    Object.keys(vehicleStatusData).forEach((plateNumber) => {
      statusObject[plateNumber] = vehicleStatusData[plateNumber] ? 'Used' : 'Available';
    });
    console.log(statusObject);
    setPlateNumberStatuses(statusObject);
  } catch (error) {
    console.error('Error fetching vehicle status:', error);
  }
};




  useEffect(() => {
    setFilteredVehicleList(
      Object.keys(vehicleStatus).filter(
        (plateNumber) => plateNumber.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, vehicleStatus]);



// const handlePlateNumberClick = async (plateNumber) => {
//   try {
//     // Fetch booking details for the selected plate number
//     const response = await axios.get(`http://localhost:3000/booking-details/${plateNumber}`);
//     const bookingDetails = response.data;

//     // Check if the booking has ended
//     const returnDate = new Date(bookingDetails.returnDate);
//     const currentDate = new Date();

//     if (currentDate > returnDate) {
//       // Make a request to mark the vehicle as available again
//       await axios.post(`http://localhost:3000/mark-available/${plateNumber}`);
//       // Refresh the list of vehicles
//       await fetchVehicleStatus();
//       // Show alert indicating that the vehicle is now available
//       alert(`Vehicle with the Plate Number: ${plateNumber} is now available.`);
//     } else {
//       // Vehicle is still in use, show alert
//       alert(`Vehicle with the Plate Number: ${plateNumber} is currently in use.`);
//     }
//   } catch (error) {
//     // If there's an error or the booking details are not found, it means the vehicle is available
//     alert(`Vehicle with the Plate Number: ${plateNumber} is available and not in use.`);
//   }
// };


const handlePlateNumberClick = async (plateNumber) => {
  try {
    // Fetch booking details for the selected plate number
    const response = await axios.get(`http://localhost:3000/booking-details/${plateNumber}`);
    const bookingDetails = response.data;

    // Check if the booking has ended
    console.log('Return Date:', bookingDetails.returnDate);
    const returnDate = new Date(bookingDetails.returnDate);
    const currentDate = new Date();

    if (currentDate <= returnDate) {
      // Vehicle is still in use
      const detailsResponse = await axios.get(`http://localhost:3000/vehicle/details/${plateNumber}`);
      const details = detailsResponse.data;

      console.log('Details:', details);
      //alert(`Vehicle with the Plate Number: ${plateNumber} is in use.`);
      setSelectedPlateNumber(plateNumber);
      setSelectedVehicleDetails(details);
      // alert(`Vehicle with the Plate Number: ${plateNumber} is currently in use.`);
      return;
    }

    // Make a request to mark the vehicle as available again
    await axios.post(`http://localhost:3000/mark-available/${plateNumber}`);
    // Refresh the list of vehicles
    await fetchVehicleStatus();
    // Show alert indicating that the vehicle is now available
    alert(`Vehicle with the Plate Number: ${plateNumber} is now available.`);
  } catch (error) {
    // If there's an error or the booking details are not found, it means the vehicle is available
    // Check the status of the vehicle to determine the alert message
    const status = plateNumberStatuses[plateNumber];
    if (status === 'Used') {
      const detailsResponse = await axios.get(`http://localhost:3000/vehicle/details/${plateNumber}`);
      const details = detailsResponse.data;

      console.log('Details:', details);
      //alert(`Vehicle with the Plate Number: ${plateNumber} is in use.`);
      setSelectedPlateNumber(plateNumber);
      setSelectedVehicleDetails(details);
    } else {
      //alert(`Vehicle with the Plate Number: ${plateNumber} is available and not in use.`);
      const detailsResponse = await axios.get(`http://localhost:3000/vehicle-details/${plateNumber}`);
      const details = detailsResponse.data;

      console.log('Details:', details);
      setSelectedPlateNumber(plateNumber);
      setSelectedVehicleDetails(details);
    }
  }
};


  const [formData, setFormData] = useState({
    plateNumber2: '',
    addvehicles: '',
    carImage: null,
  });


  console.log(formData)


   
  const handlesubmitvec  = async (e) => {
    e.preventDefault();


    // Use FormData to handle file uploads
  const formDataForUpload = new FormData();
  formDataForUpload.append('plateNumber2', formData.plateNumber2);
  formDataForUpload.append('addvehicles', formData.addvehicles);
  formDataForUpload.append('carImage', formData.carImage); // Use formData.carImage here


  try {
    const response = await axios.post('http://localhost:3000/addvehicle', formDataForUpload);


    if (response.data.success) {
      // Handle success, e.g., clear the form or close the modal
      setFormData({
        plateNumber2: '',
        addvehicles: '',
        carImage: null,
      });
      setCentredModal(!setCentredModal);
      window.location.reload();
    } else {
      // Handle error
      console.error('Error while submitting the form');
    }
  } catch (error) {
    // Handle network error
    console.error('Network error:', error);
  }
         
    };




    const formatDate = (date) => {
      // Convert date to string format
      const formattedDate = new Date(date).toLocaleDateString();
      return formattedDate;
    };




const [filter, setFilter] = useState('all'); // Default filter is 'all'


  // Handler function for filter buttons
  const handleFilter = (selectedFilter) => {
    setFilter(selectedFilter);
  };


  // Function to determine if a button should be active based on the current filter
  const isActive = (selectedFilter) => {
    return selectedFilter === filter ? 'active' : '';
  };






// Filter the vehicles based on the selected filter and search input
useEffect(() => {
  console.log("Filter:", filter); // Log selected filter
  console.log("Search input:", searchInput); // Log search input


  setFilteredVehicleList(
    Object.keys(vehicleStatus).filter((plateNumber) => {
      if (filter === 'all' || filter === '') {
        return plateNumber.toLowerCase().includes(searchInput.toLowerCase());
      } else if (filter === 'available') {
        return vehicleStatus[plateNumber] === 'Available' && plateNumber.toLowerCase().includes(searchInput.toLowerCase());
      } else if (filter === 'used') {
        return vehicleStatus[plateNumber] === 'Used' && plateNumber.toLowerCase().includes(searchInput.toLowerCase());
      }
    })
  );
}, [filter, searchInput, vehicleStatus]);



const handleDeleteConfirmation = async (plateNumber) => {
  // Logic for confirming deletion
  console.log('Delete confirmed for plate number:', plateNumber);
  setShowConfirmationModal(true);

};


const handleCancelDelete = () => {
  // Logic for canceling deletion
  console.log('Delete canceled');
  // Close the modal
  setShowConfirmationModal(false);
};


// const handleEditButtonClick = async (plateNumber) => {
//   try {
//     const response = await fetch(`/api/vehicle/details/${plateNumber}`);
//     if (response.ok) {
//       const data = await response.json();
//       // Check if the response contains the expected vehicle data
//       if (data && data.vehicle) {
//         // Set the initial values for editing based on the selected vehicle's details
//         setEditedPlateNumber(data.vehicle.plateNumber);
//         setEditedVehicle(data.vehicle.vehicleName);
//         setEditedCarImage(data.vehicle.carImage);
//         // Open the edit modal
//         setShowEditModal(true);
//       } else {
//         console.error('Error fetching vehicle details: Invalid response format');
//       }
//     } else {
//       console.error('Error fetching vehicle details:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error fetching vehicle details:', error);
//   }
// };


const handleEditButtonClick = async (plateNumber) => {
  console.log('Plate Number:', plateNumber);
  try {
    const response = await axios.get(`http://localhost:3000/vehicle/details/${plateNumber}`);
    if (response.status === 200) {
      const data = response.data;
      console.log(data);
      // Check if the response contains the expected vehicle data
      if (data && data.vehicle) {
        // Set the initial values for editing based on the selected vehicle's details
        setnotPlateNumber(data.vehicle.plateNumber);
        setEditedPlateNumber(data.vehicle.plateNumber);
        setEditedVehicle(data.vehicle.vehicleName);
        // Note: You need to handle image editing separately, depending on your implementation
        // For now, let's assume you're not editing the image
        setEditedCarImage(data.vehicle.carImage);
        // Open the edit modal
        setShowEditModal(true);
      } else {
        console.error('Error fetching vehicle details: Invalid response format');
      }
    } else {
      console.error('Error fetching vehicle details:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
  }
};


const handleOrigPlateNumberChange = (e) => {
  setnotPlateNumber(e.target.value);
};


const handleEditPlateNumberChange = (e) => {
  setEditedPlateNumber(e.target.value);
};

const handleEditVehicleChange = (e) => {
  setEditedVehicle(e.target.value);
};

const handleEditCarImageChange = (e) => {
  setEditedCarImage(e.target.files[0]);
};



const handleConfirmEdit = async () => {
  try {
    console.log('Edited Plate Number:', editedPlateNumber);
    console.log('Edited Vehicle:', editedVehicle);
    console.log('Edited Car Image:', editedCarImage);

    const updatedData = {
      newPlateNumber: editedPlateNumber,
      vehicleName: editedVehicle,
      // Remove the carImage property if you don't want to edit the image
    };

    console.log('Updated data:', updatedData);

    const response = await axios.put(`http://localhost:3000/vehicle/edit/${notPlateNumber}`, updatedData);
    if (response.status === 200) {
      setShowEditModal(false);
      await fetchVehicleStatus();
    } else {
      console.error('Error editing vehicle details:', response.statusText);
    }
  } catch (error) {
    console.error('Error editing vehicle details:', error);
  }
};





// Function to handle canceling the edit operation and close the modal
const handleCancelEdit = () => {
  setShowEditModal(false); // Close the edit modal
};


// const handleEditVehicle = async () => {
//   try {
//     // Implement the logic to save the edited vehicle details
//     // This can involve sending a request to update the vehicle details in the database, for example
//     // After saving, you can close the edit modal
//     setShowEditModal(false);
//   } catch (error) {
//     // Handle any errors that occur during the editing process
//     console.error('Error editing vehicle details:', error);
//   }
// };

const handleEditVehicle = async () => {
  try {
    // Implement the logic to save the edited vehicle details
    const editedVehicleData = {
      plateNumber: editedPlateNumber,
      addvehicles: editedVehicle,
      // Note: You need to handle image editing separately, depending on your implementation
      // For now, let's assume you're not editing the image
      // carImage: editedCarImage,
    };

    console.log('Editing vehicle with data:', editedVehicleData);
    
    const response = await axios.put(`http://localhost:3000/vehicle/edit/${editedPlateNumber}`, editedVehicleData);
    if (response.status === 200) {
      // Close the edit modal
      setShowEditModal(false);
      // Optionally, you can refresh the vehicle list after editing
      await fetchVehicleStatus();
    } else {
      console.error('Error editing vehicle details:', response.statusText);
    }
  } catch (error) {
    // Handle any errors that occur during the editing process
    console.error('Error editing vehicle details:', error);
  }
};

// const handleDeleteButtonClick = async (plateNumber)  => {
//   const plate = plateNumber;
//   console.log("Plate:" + plate);
// };

const handleDeleteButtonClick = async (plateNumber) => {
  try {
    console.log("Plate"+ plateNumber);
    const response = await axios.delete(`http://localhost:3000/vehicle/delete/${plateNumber}`);
    console.log(response.data);

    setVehicleDetailsModalOpen(false);
    // Optionally, you can perform any additional actions after successful deletion
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    // Optionally, handle the error or show a notification to the user
  }
};




  return (
    <>
    <div className="header-wrapper">
    <div className='header-container'>  
    <h4><strong>MONITORING</strong>  </h4>    <span className="userName">Administrator <FontAwesomeIcon icon={faCircleUser} /></span>
    </div></div>
    <div className='Monitoring-container'>
    <div className='Container row'>
   
</div>
<div className='monitoring-wrapper'>
  <div >
  {/* className='vehicleList' */}
  <h4>BukSU Vehicle  


 <div className="search-container">
  <form action="#" method="get">
    <input
      className="search expandright"
      id="searchright"
      type="search"
      name="q"
      placeholder="Search Plate Number"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
    <label className="button searchbutton" htmlFor="searchright">
      <TfiSearch className='searchcon' />
    </label>
  </form>
</div>


     
      <CiSquarePlus className='pluscar' onClick={toggleOpen}  />
</h4>
<div> <p className='noCars'><IoCarSportOutline />  {filteredVehicleList.length} Vehicle Total </p></div>
{/* <button className='button-all'>All </button>
<button className='button-all'>Available </button>
<button className='button-all'>Used</button> */}




<div>
      <button className={`button-all ${isActive('all')}`} onClick={() => handleFilter('all')}>
        All
      </button>
      <button className={`button-available ${isActive('available')}`} onClick={() => handleFilter('available')}>
        Available
      </button>
      <button className={`button-used ${isActive('used')}`} onClick={() => handleFilter('used')}>
        Used
      </button>
    </div>




   
    <div className='ListVehicle'>
  <div class="container">
    {/* <div class="row"> */}
    <div className="container">
  <table className="table table-bordered">
    <thead>
      <tr>
        <th scope="col">Plate Number</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
  </table>
  <div className="scrollable-container">
    <table className="table table-bordered">
      <tbody className="scrollable-tbody">
        {filteredVehicleList.map((plateNumber) => (
          <tr
            key={plateNumber}
            onClick={() => handlePlateNumberClick(plateNumber)}
            style={{ cursor: 'pointer' }}
          >
            <td><strong>{plateNumber}</strong></td>
            <td style={{
              textDecoration: vehicleStatus[plateNumber] === 'Used' ? 'underline' : 'none',
              cursor: 'pointer',
              color: vehicleStatus[plateNumber] === 'Used' ? '#f80f0f' : '#1adf1a'
            }}>
            {vehicleStatus[plateNumber] === 'Used' ? 'Used' : 'Available'}</td>

          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
   
  </div>
</div>


 </div>



<div>
<MDBModal tabIndex='-1' open={selectedPlateNumber !== null || isHistoryVisible} setOpen={setVehicleDetailsModalOpen}>
  <MDBModalDialog>
    <MDBModalContent>
      <MDBModalHeader>
        <MDBModalTitle>{isHistoryVisible ? 'History' : 'Vehicle Details'}</MDBModalTitle>
        <button className="btn-close" onClick={() => {
          setSelectedPlateNumber(null);
          setHistoryVisible(false);
        }}></button>
      </MDBModalHeader>
      <MDBModalBody>
        {/* Vehicle Details */}
        {selectedPlateNumber && selectedVehicleDetails && !isHistoryVisible && (
  <div>
    <div className='pictureArea'>
      <div className='Picture'>
        {/* <p>image here:</p>  */}
        <img
          width="150px"
          height="100px"
          style={{ float: "left" }}
          src={`${selectedVehicleDetails.vehicle.carImage}`}
          alt='Car'
        />
      </div>
      <div className='picText'>
        <h3 className="plate-number"> Plate Number: {selectedPlateNumber}</h3> {/* Added class name for plate number */}
        <p className="vehicle-details"> {selectedVehicleDetails.addvehicles}</p> 
      </div>
    </div>
     {/* Insert the delete button here */}
     <button onClick={() => handleEditButtonClick(selectedPlateNumber)} className="btn btn-primary">Edit</button> &nbsp; &nbsp;
       <button onClick={() => handleDeleteButtonClick(selectedPlateNumber)} className="btn btn-danger">Delete</button> 
     {/* <button onClick={() => handleDeleteConfirmation(selectedPlateNumber)} className="btn btn-danger">Delete</button>  */}

    <div>
      <div style={{ display: 'block', width: 600, padding: 10 }}>
        {/* Display additional details */}
        <Row>
          {/* Remaining content */}
        </Row>
      </div>
    </div>
  </div>
)}

{/* History */}
{isHistoryVisible && (
  <div className="historyRight">
    <div className='pictureArea'>
      <div className='Picture'>
        <img width="120px" style={{ float: "left" }} src={car1} />
      </div>
      <div className='picText'>
         <h3 className="plate-number">{selectedPlateNumber}</h3> {/* Added class name for plate number */}
        <p className="vehicle-details">{selectedVehicleDetails.addvehicles}</p> {/* Added class name for vehicle details */}
      </div>
    </div>
    <div className='historyTables'>
      {/* Display history tables */}
    </div>
  </div>
)}

      </MDBModalBody>
    </MDBModalContent>
  </MDBModalDialog>
</MDBModal>
</div>
  </div>
  <div>
  </div>

{/* INNSERT VEHICLE FORM */}
  <div>
  <MDBModal tabIndex='-1' open={centredModal} setOpen={setCentredModal} >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Add Vehicle</MDBModalTitle>
             
            </MDBModalHeader>
            <MDBModalBody>
              <form id='addvec' onSubmit={handlesubmitvec}>
               
              <label>
            Plate Number
            <input type="text" className='addVehicle' required value={formData.plateNumber2} onChange={(e) => setFormData({ ...formData, plateNumber2: e.target.value })} />
        </label>
        <label>
         Vehicle
            <input type="text" className='addVehicle' required value={formData.addvehicles} onChange={(e) => setFormData({ ...formData, addvehicles: e.target.value })}/>
        </label>
        <label>
         Insert Image
            {/* <input type="file" className='addVehicle' accept="image/*" onChange={handleImageChange}/> */}
            <input type="file" name="carImage" className='addVehicle' onChange={(e) => setFormData({ ...formData, carImage: e.target.files[0] })} />
        </label>
     <div className='btnDown'>
        <button className="closeM mt-2 " onClick={toggleOpen}> Cancel</button>
              <button className='saveCar'> Save</button>


              </div>
        </form>
       
            </MDBModalBody>
            {/* <MDBModalFooter>
              <button className="closeM" onClick={toggleOpen}> Close</button>
              <button className='saveCar'> Save</button>
             
            </MDBModalFooter> */}


     
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
  </div>
    </div>


{/* DELETEEE MODAL */}
    <div>
<MDBModal tabIndex='-1' setOpen={setShowConfirmationModal}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Confirmation</MDBModalTitle>
              <button className="btn-close" onClick={handleCancelDelete}></button>
            </MDBModalHeader>
            <MDBModalBody>
           <div className="iconNi" style={{ display: 'flex', justifyContent: 'center' }}>
            <MdDangerous style={{color:"#ff0000", fontSize:"90px"}}/>  </div>
            <p style={{ textAlign: 'center', padding: '20px' }}>Are you sure you want to delete vehicle with plate number {selectedPlateNumber}?</p>
            </MDBModalBody>
            <MDBModalFooter>
              <button className="btn btn-secondary" onClick={handleCancelDelete}>Cancel</button>
              {/* <button className='btn btn-danger' onClick={handleConfirmDelete}>Delete</button> */}
              <button className='btn btn-danger' onClick={() => handleDeleteButtonClick(selectedPlateNumber)} >Delete</button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
  </div>


{/* EDIT MODAL */}
        <div>
  <MDBModal tabIndex='-1' open={showEditModal} setOpen={setShowEditModal}>
    <MDBModalDialog>
      <MDBModalContent>
        <MDBModalHeader>
          <MDBModalTitle>Edit Vehicle</MDBModalTitle>
          <button className="btn-close" onClick={handleCancelEdit}></button>
        </MDBModalHeader>
        <MDBModalBody>
          {/* Form for editing vehicle details */}
          <form onSubmit={handleEditVehicle}>
            <label>
              Original Plate Number
              <input
                type="text"
                className='form-control'
                value={notPlateNumber}
                onChange={handleOrigPlateNumberChange}
                disabled="true"
              />
              Edited Plate Number
              <input
                type="text"
                className='form-control'
                value={editedPlateNumber}
                onChange={handleEditPlateNumberChange}
              />
            </label>
            <div>
            <label>
              Vehicle
              <input
                type="text"
                className='form-control '
                value={editedVehicle}
                onChange={handleEditVehicleChange}
              />
            </label>
            </div>
            <label>
              Insert Image
              <input
                type="file"
                name="carImage"
                className='form-control'
                onChange={handleEditCarImageChange}
              />
            </label>
          </form>
        </MDBModalBody>
        <MDBModalFooter>
          <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
          <button type="submit" className='btn btn-primary' onClick={handleConfirmEdit}>Save Changes</button>
        </MDBModalFooter>
      </MDBModalContent>
    </MDBModalDialog>
  </MDBModal>
</div>
   

    </>
  )
}


export default Monitoring
