import React, { useEffect, useState, useMemo} from 'react';
import car1 from "../car1.png"
import axios from 'axios'
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

  const toggleVehicleDetailsModalOpen = () => {
    setVehicleDetailsModalOpen(!vehicleDetailsModalOpen);
  };

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


  const handlePlateNumberClick = async (plateNumber) => {
    try {
      // Check if the vehicle is available
      if (vehicleStatus[plateNumber] === 'Used') {
        const response = await axios.get(`http://localhost:3000/vehicle/details/${plateNumber}`);
        const details = response.data;
 
        console.log('Details:', details);
        // Update the state with the selected plate number and its details
        setSelectedPlateNumber(plateNumber);
        setSelectedVehicleDetails(details);
      } else {
        // Vehicle is available, show alert
        alert(`Vehicle with the Plate Number: ${plateNumber} is available and not in use.`);
        // You can also use a modal alert or any other way to display the message
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    }
  };

  const handleDeleteVehicle = (plateNumber) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete the vehicle with plate number ${plateNumber}?`);
    
    // Check if the user confirmed the action
    if (isConfirmed) {
      // Filter out the deleted vehicle from the list and update the state
      setFilteredVehicleList(filteredVehicleList.filter((plate) => plate !== plateNumber));
      // Example: You might want to send a DELETE request to your server
      console.log(`Deleting vehicle with plate number ${plateNumber}`);
  
      // Check if the plate number being deleted matches the one in the form
      if (formData.plateNumber === plateNumber) {
        // Reset the form data to clear the input field
        setFormData({ ...formData, plateNumber: '' });
      }
    } else {
      // User cancelled the action
      console.log('Deletion cancelled.');
    }
  };
  


  const hideVehicleList = () => {
    // You can add logic to hide the vehicleListRight here
    // For example, you might want to set a state to control its visibility
  };






  const [vehicleStatus, setVehicleStatus] = useState({});


  useEffect(() => {
    // Fetch vehicle status data from your server
    const fetchVehicleStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3000/vehiclestatus'); // Replace with your actual API endpoint
        const vehicleStatusData = response.data;


        // Update the vehicleStatus state with the fetched data
        setVehicleStatus(vehicleStatusData);
      } catch (error) {
        console.error('Error fetching vehicle status:', error);
      }
    };


    // Call the fetch function
    fetchVehicleStatus();
  }, []);




  useEffect(() => {
    setFilteredVehicleList(
      Object.keys(vehicleStatus).filter(
        (plateNumber) => plateNumber.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, vehicleStatus]);


 






  // const column= [
  //   // Add your reduced data here
  //   // Include only the rows you want to display
  //   {
  //     name: 'Time & Date',
  //     selector: row => row.timeDate,
  //     sortable:true
  //   },
  //   {
  //     name: 'Destination',
  //     selector: row => row.destination,
  //     sortable:true
  //   },
  //   {
  //     name: 'Kilometer',
  //     selector: row => row.km,
  //     sortable:true
  //   },
  //   {
  //     name: 'Fuel Used',
  //     selector: row => row.emailadd,
  //     sortable:true
  //   },
   
  // ];


  // useEffect(()=> {
  //   const fetData = async () => {
  //     // CHANGE LANG DAYON NI SA IYANG DATABASE JUD GI TRY TRY RA NKO NI
  //     axios.get('http://localhost:3001/accounts')
  //     .then(res=> Data(res.data))
  //     .catch(err => console.log(err));
 
  //   }
  //   fetData();
  // }, [])


  // const customStyle = {
  //   headRow:{
  //     style:{
  //       backgroundColor: 'blue',
  //       color:'white'
  //     }
  //   },
  //   headCells:{
  //     style:{
  //       fontSize:'15px',
  //       textTransform:'uppercase'
  //     }
  //   },
  //   cells:{
  //     style:{
  //       fontSize:'15px'
  //     }
  //   }
  // }


 
  // const [records, setRecords] = useState([])
  // const recordsPerPage = 5;
  // const [currentPage, setCurrentPage] = useState(1)
  // const lastIndex= currentPage * recordsPerPage;
  // const firstIndex = lastIndex - recordsPerPage;
  // const records = Data.slice(firstIndex,lastIndex);
  // const npage = Math.ceil(Data.lenght/ recordsPerPage);
  // const numbers = [...Array(npage + 1).keys()].slice(1)




  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setFormData({ ...formData, carImage: file });
  // };




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




// const [filter, setFilter] = useState('all'); // Default filter is 'all'


// // Filter the vehicles based on the selected filter
// const filteredVehicles = useMemo(() => {
//   if (filter === 'all') {
//     return Object.keys(vehicleStatus);
//   } else if (filter === 'available') {
//     return Object.keys(vehicleStatus).filter((plateNumber) => vehicleStatus[plateNumber] === 'Available');
//   } else if (filter === 'used') {
//     return Object.keys(vehicleStatus).filter((plateNumber) => vehicleStatus[plateNumber] === 'Used');
//   }
// }, [filter, vehicleStatus]);


// // Handler function for filter buttons
// const handleFilter = (selectedFilter) => {
//   setFilter(selectedFilter);
// };


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
  <div className="container">
    <div className="container">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Plate Number</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
      </table>
      <div className="scrollable-container">
        <table className="table table-bordered">
          <tbody className="scrollable-tbody">
            {filteredVehicleList.map((plateNumber) => (
              <tr key={plateNumber} style={{ cursor: 'pointer' }}>
                <td>{plateNumber}</td>
                <td style={{
                  textDecoration: vehicleStatus[plateNumber] === 'Used' ? 'underline' : 'none',
                  cursor: 'pointer',
                  color: vehicleStatus[plateNumber] === 'Used' ? '#f80f0f' : '#1adf1a'
                }}>
                  {vehicleStatus[plateNumber] === 'Used' ? 'Used' : 'Available'}
                </td>
                <td>
                  <button onClick={() => handleDeleteVehicle(plateNumber)} className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  </div>
</div>
   
  </div>
</div>




 </div>




 {/* {isHistoryVisible || (
 <div className='vehicleListRight'>
  <div className='pictureArea'>
    <div className='Picture'>
      <img width="150px" style={{float:"left"}} src={car1} />
    </div>


    <div className='picText'>
    <h3>KDC 099 S</h3>
    <p>Toyota Fortuner</p>
    <p> White</p>
    </div>
  </div>
 <div>
 <div style={{ display: 'block', width: 600, padding: 10 }}>
      <Row>
        <Col className="column3" style={{
          backgroundColor: 'white', margin: 5, padding:10, lineHeight:0.5
        }}>
        <p className='detail'> Engine </p>
        <p className='detailAnswer'> Running</p>
        <p className='detail'> Speed</p>
        <p className='detailAnswer'> 42 km/h</p>
        <p className='detail'> Mileage </p>
        <p className='detailAnswer'> 3.7 km</p>


        <button className='detailButton'onClick={() => { hideVehicleList(); toggleHistory(); }} >History</button>
      </Col>




        <Col className="column3" style={{
          backgroundColor: 'white', margin: 5,  padding:10, lineHeight:0.5
        }}>
         
        <p className='detail'> Client  Name </p>
        <p className='detailAnswer'> ComSoc Officer</p>
        <p className='detail'> Quantity</p>
        <p className='detailAnswer'> 42 </p>
        <p className='detail'> Destination  </p>
        <p className='detailAnswer'> Cagayan De Oro</p>
        <p className='detail'> Date</p>
        <p className='detailAnswer'> Nov 7, 2023</p>
        <p className='detail'> Return Date  </p>
        <p className='detailAnswer'> Nov 8, 2023 </p>




      </Col>




        <Col className="column3" style={{
          backgroundColor: 'white', margin: 5
        }}>


        <button className='detailButton'>Full Transit</button>


      </Col>




      </Row>
    </div>
 </div>
 </div> )} */}
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
  <div>
  <MDBModal tabIndex='-1' open={centredModal} setOpen={setCentredModal}>
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
            <input type="text" className='addVehicle' value={formData.addvehicles} onChange={(e) => setFormData({ ...formData, addvehicles: e.target.value })}/>
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
    </>
  )


  // function prePage(){


  // }
  // function nextPage(){


  // }


  // function changeCPage(id){


  // }
}


export default Monitoring
