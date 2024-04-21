import React, { useEffect, useState, useMemo } from "react";
import car1 from "../car1.png";
import axios from "axios";
import { MdDangerous } from "react-icons/md";
// import Data from "../Data.json"
import "bootstrap/dist/css/bootstrap.css";
import DataTable from "react-data-table-component";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
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
} from "mdb-react-ui-kit";
import { IoCarSportOutline } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

function Monitoring() {
  const [centredModal, setCentredModal] = useState(false);
  const [vehicleDetailsModalOpen, setVehicleDetailsModalOpen] = useState(false);
  const toggleOpen = () => setCentredModal(!centredModal);
  const [selectedPlateNumber, setSelectedPlateNumber] = useState(null);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);
  const [isHistoryVisible, setHistoryVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredVehicleList, setFilteredVehicleList] = useState([]);
  const [role, setUserRole] = useState("");
  const [plateNumberStatuses, setPlateNumberStatuses] = useState({});
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  // const [plateNumberToDelete, setPlateNumberToDelete] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVecModal, setShowVecModal] = useState(false);
  const [editedPlateNumber, setEditedPlateNumber] = useState("");
  const [notPlateNumber, setnotPlateNumber] = useState("");
  const [editedVehicle, setEditedVehicle] = useState("");
  const [editedCarImage, setEditedCarImage] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [plateNumber, setPlateNumber] = useState("");
  const [mapKey, setMapKey] = useState(0);

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
        const response = await axios.get("http://localhost:3000/vehiclestatus");
        const vehicleStatusData = response.data;
        setVehicleStatus(vehicleStatusData);
      } catch (error) {
        console.error("Error fetching vehicle status:", error);
      }
    };
    fetchVehicleStatus();
  }, []);

  const userToken = "123abcdef";

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
        const response = await axios.get("/api/user");
        console.log("Server response:", response.data); // Log the entire response for debugging
        const { role } = response.data.user;
        console.log("User role:", role); // Log the user role for debugging
        setUserRole(role);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
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
  //       const response = await axios.get(http://localhost:3000/vehicle/details/${plateNumber});
  //       const details = response.data;

  //       console.log('Details:', details);
  //       // Update the state with the selected plate number and its details
  //       setSelectedPlateNumber(plateNumber);
  //       setSelectedVehicleDetails(details);
  //     } else {
  //       // Vehicle is available, show alert
  //       alert(Vehicle with the Plate Number: ${plateNumber} is available and not in use.);
  //       // You can also use a modal alert or any other way to display the message
  //     }
  //   } catch (error) {
  //     console.error('Error fetching vehicle details:', error);
  //   }
  // };

  const [vehicleStatus, setVehicleStatus] = useState({});

  // Define the fetchVehicleStatus function outside of the useEffect hook
  const fetchVehicleStatus = async () => {
    try {
      const response = await axios.get("http://localhost:3000/vehiclestatus");
      const vehicleStatusData = response.data;
      console.log(vehicleStatusData);
      setVehicleStatus(vehicleStatusData);

      // Update plateNumberStatuses with the latest status data
      const statusObject = {};
      Object.keys(vehicleStatusData).forEach((plateNumber) => {
        statusObject[plateNumber] = vehicleStatusData[plateNumber]
          ? "Used"
          : "Available";
      });
      console.log(statusObject);
      setPlateNumberStatuses(statusObject);
    } catch (error) {
      console.error("Error fetching vehicle status:", error);
    }
  };

  useEffect(() => {
    setFilteredVehicleList(
      Object.keys(vehicleStatus).filter((plateNumber) =>
        plateNumber.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, vehicleStatus]);

  // const handlePlateNumberClick = async (plateNumber) => {
  //   try {
  //     // Fetch booking details for the selected plate number
  //     const response = await axios.get(http://localhost:3000/booking-details/${plateNumber});
  //     const bookingDetails = response.data;

  //     // Check if the booking has ended
  //     const returnDate = new Date(bookingDetails.returnDate);
  //     const currentDate = new Date();

  //     if (currentDate > returnDate) {
  //       // Make a request to mark the vehicle as available again
  //       await axios.post(http://localhost:3000/mark-available/${plateNumber});
  //       // Refresh the list of vehicles
  //       await fetchVehicleStatus();
  //       // Show alert indicating that the vehicle is now available
  //       alert(Vehicle with the Plate Number: ${plateNumber} is now available.);
  //     } else {
  //       // Vehicle is still in use, show alert
  //       alert(Vehicle with the Plate Number: ${plateNumber} is currently in use.);
  //     }
  //   } catch (error) {
  //     // If there's an error or the booking details are not found, it means the vehicle is available
  //     alert(Vehicle with the Plate Number: ${plateNumber} is available and not in use.);
  //   }
  // };

  const handlePlateNumberClick = async (plateNumber) => {
    try {
      // Fetch booking details for the selected plate number
      const response = await axios.get(
        `http://localhost:3000/booking-details/${plateNumber}`
      );
      const bookingDetails = response.data;

      // Check if the booking has ended
      console.log("Return Date:", bookingDetails.returnDate);
      const returnDate = new Date(bookingDetails.returnDate);
      const currentDate = new Date();

      if (currentDate <= returnDate) {
        // Vehicle is still in use
        const detailsResponse = await axios.get(
          `http://localhost:3000/vehicle/details/${plateNumber}`
        );
        const details = detailsResponse.data;

        console.log("Details:", detailsResponse.data.vehicle.vehicleName);
        // alert(`Vehicle with the Plate Number: ${plateNumber} is in use.`);
        // Fetch latitude and longitude based on plate number
        const locationResponse = await axios.get(
          `http://localhost:3000/get-data-plate/${plateNumber}`
        );
        const locationData = locationResponse.data;

        console.log("Details: is this:", details);
        console.log("Latitude:", locationData.latitude);
        console.log("Longitude:", locationData.longitude);

        console.log("Details plate:", details.vehicle.vehicleName);

        setSelectedPlateNumber(plateNumber);
        setSelectedVehicleDetails(details);

        console.log("Selected Vehicle Details:", selectedVehicleDetails);
        setShowVecModal(true);
        // alert(Vehicle with the Plate Number: ${plateNumber} is currently in use.);
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
      if (status === "Used") {
        const detailsResponse = await axios.get(
          `http://localhost:3000/vehicle/details/${plateNumber}`
        );
        const details = detailsResponse.data;

        // Fetch latitude and longitude based on plate number
        const locationResponse = await axios.get(
          `http://localhost:3000/get-data-plate/${plateNumber}`
        );
        const locationData = locationResponse.data;

        console.log("Details: is this:", details.vehicleName);
        console.log("Latitude:", locationData.latitude);
        console.log("Longitude:", locationData.longitude);

        const vehicleNames = details.vehicleName;

        console.log("name: ", vehicleNames);

        console.log("Details for plate:", details.plateNumber);
        //alert(Vehicle with the Plate Number: ${plateNumber} is in use.);
        setSelectedPlateNumber(plateNumber);
        setSelectedVehicleDetails(details);
        setShowVecModal(true);
      } else {
        //alert(Vehicle with the Plate Number: ${plateNumber} is available and not in use.);
        const detailsResponse = await axios.get(
          `http://localhost:3000/vehicle-details/${plateNumber}`
        );
        const details = detailsResponse.data;

        console.log("Details:", details);
        setSelectedPlateNumber(plateNumber);
        setSelectedVehicleDetails(details);
      }
    }
  };

  const [locationData, setLocationData] = useState(null);

  // Function to fetch location data based on plate number
  const fetchLocationData = async (plateNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/get-data-plate/${plateNumber}`
      );
      setLocationData(response.data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  // Call fetchLocationData when selectedPlateNumber changes
  useEffect(() => {
    if (selectedPlateNumber) {
      fetchLocationData(selectedPlateNumber);
    }
  }, [selectedPlateNumber]);

  const [formData, setFormData] = useState({
    plateNumber2: "",
    addvehicles: "",
    carImage: null,
  });

  console.log(formData);

  const handlesubmitvec = async (e) => {
    e.preventDefault();

    // Use FormData to handle file uploads
    const formDataForUpload = new FormData();
    formDataForUpload.append("plateNumber2", formData.plateNumber2);
    formDataForUpload.append("addvehicles", formData.addvehicles);
    formDataForUpload.append("carImage", formData.carImage); // Use formData.carImage here

    try {
      const response = await axios.post(
        "http://localhost:3000/addvehicle",
        formDataForUpload
      );

      if (response.data.success) {
        // Handle success, e.g., clear the form or close the modal
        setFormData({
          plateNumber2: "",
          addvehicles: "",
          carImage: null,
        });
        setCentredModal(!setCentredModal);
        window.location.reload();
      } else {
        // Handle error
        console.error("Error while submitting the form");
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };

  const formatDate = (date) => {
    // Convert date to string format
    const formattedDate = new Date(date).toLocaleDateString();
    return formattedDate;
  };

  const [filter, setFilter] = useState("all"); // Default filter is 'all'

  // Handler function for filter buttons
  const handleFilter = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  // Function to determine if a button should be active based on the current filter
  const isActive = (selectedFilter) => {
    return selectedFilter === filter ? "active" : "";
  };

  // Filter the vehicles based on the selected filter and search input
  useEffect(() => {
    console.log("Filter:", filter); // Log selected filter
    console.log("Search input:", searchInput); // Log search input

    setFilteredVehicleList(
      Object.keys(vehicleStatus).filter((plateNumber) => {
        if (filter === "all" || filter === "") {
          return plateNumber.toLowerCase().includes(searchInput.toLowerCase());
        } else if (filter === "available") {
          return (
            vehicleStatus[plateNumber] === "Available" &&
            plateNumber.toLowerCase().includes(searchInput.toLowerCase())
          );
        } else if (filter === "used") {
          return (
            vehicleStatus[plateNumber] === "Used" &&
            plateNumber.toLowerCase().includes(searchInput.toLowerCase())
          );
        }
      })
    );
  }, [filter, searchInput, vehicleStatus]);

  // const handleCancelDelete = () => {
  //   console.log("Delete canceled");
  //   setShowConfirmationModal(false);
  // };

  // const handleEditButtonClick = async (plateNumber) => {
  //   try {
  //     const response = await fetch(/api/vehicle/details/${plateNumber});
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
    console.log("Plate Number:", plateNumber);
    try {
      const response = await axios.get(
        `http://localhost:3000/vehicle/details/${plateNumber}`
      );
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

          setShowEditModal(true);
        } else {
          console.error(
            "Error fetching vehicle details: Invalid response format"
          );
        }
      } else {
        console.error("Error fetching vehicle details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  const handleOrigPlateNumberChange = (event) => {
    setnotPlateNumber(event.target.value);
  };

  const handleEditPlateNumberChange = (event) => {
    setEditedPlateNumber(event.target.value);
    // onChange={(e) => setFormData2({ ...formData2, editedPlateNumber: e.target.value })}
  };

  const handleEditVehicleChange = (event) => {
    setEditedVehicle(event.target.value);
  };

  const handleEditCarImageChange = (event) => {
    setEditedCarImage(event.target.files[0]);
  };

  const handleConfirmEdit = async () => {
    try {
      console.log("Edited Plate Number:", editedPlateNumber);
      console.log("Edited Vehicle:", editedVehicle);
      console.log("Edited Car Image:", editedCarImage.name);

      const updatedData = {
        newPlateNumber: editedPlateNumber,
        vehicleName: editedVehicle,
        carImage: editedCarImage.name,
        // Remove the carImage property if you don't want to edit the image
      };

      console.log("Updated data:", updatedData);

      const response = await axios.put(
        `http://localhost:3000/vehicle/edit/${notPlateNumber}`,
        updatedData
      );
      if (response.status === 200) {
        setShowEditModal(false);
        await fetchVehicleStatus();
      } else {
        console.error("Error editing vehicle details:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing vehicle details:", error);
    }
  };

  // const handleConfirmEdit = async (e) => {
  //   e.preventDefault();

  //   // const formDataforedit = new FormData();
  //   // formDataforedit.append('newPlateNumber', formData2.editedPlateNumber2);
  //   // formDataforedit.append('vehicleName', formData2.editedVehicle2);
  //   // formDataforedit.append('carImage', formData2.editedCarImage2);

  //   // Create a new FormData object
  //   const formDataForEdit = new FormData();
  //   formDataForEdit.append('newPlateNumber', editedPlateNumber);
  //   formDataForEdit.append('vehicleName', editedVehicle);
  //   formDataForEdit.append('carImage', editedCarImage);

  //   console.log('Form Data:', formDataForEdit);

  //   try {
  //     console.log('Edited Plate Number:', editedPlateNumber);
  //     console.log('Edited Vehicle:', editedVehicle);
  //     console.log('Edited Car Image:', editedCarImage);

  //     const response = await axios.put(http://localhost:3000/vehicle/edit/${notPlateNumber}, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     if (response.status === 200) {

  //       setFormData2({
  //         editedPlateNumber: '',
  //         editedVehicle: '',
  //         editedCarImage: null,
  //       });
  //       setShowEditModal(false);
  //       await fetchVehicleStatus();
  //     } else {
  //       console.error('Error editing vehicle details:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error editing vehicle details:', error);
  //   }
  // };

  // Function to handle canceling the edit operation and close the modal
  const handleCancelEdit = () => {
    setShowEditModal(false); // Close the edit modal
    setShowVecModal(false);
  };

  const handleEditVehicle = async () => {
    try {
      // Implement the logic to save the edited vehicle details
      const editedVehicleData = {
        plateNumber: editedPlateNumber,
        addvehicles: editedVehicle,
        // Note: You need to handle image editing separately, depending on your implementation
        // For now, let's assume you're not editing the image
        carImage: editedCarImage,
      };

      console.log("Editing vehicle with data:", editedVehicleData);

      const response = await axios.put(
        `http://localhost:3000/vehicle/edit/${editedPlateNumber}, editedVehicleData`
      );
      if (response.status === 200) {
        // Close the edit modal
        setShowEditModal(false);
        // Optionally, you can refresh the vehicle list after editing
        await fetchVehicleStatus();
      } else {
        console.error("Error editing vehicle details:", response.statusText);
      }
    } catch (error) {
      // Handle any errors that occur during the editing process
      console.error("Error editing vehicle details:", error);
    }
  };

  const handleDeleteButtonClick = async (plateNumber) => {
    try {
      // Show confirmation dialog
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this vehicle?"
      );

      // If user confirms deletion
      if (confirmDelete) {
        // Send delete request
        const response = await axios.delete(
          `http://localhost:3000/vehicle/delete/${plateNumber}`
        );
        console.log(response.data);

        // Close the vehicle details modal
        setVehicleDetailsModalOpen(false);

        // Optionally, you can perform any additional actions after successful deletion
        window.location.reload();
      } else {
        // If user cancels deletion
        console.log("Deletion canceled");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      // Optionally, handle the error or show a notification to the user
    }
  };

  const handleCloseFirstModal = () => {
    const firstModal = document.querySelector(".firstmodal");
    if (firstModal) {
      firstModal.remove(); // Remove the first modal from the DOM
    }
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove(); // Remove the modal backdrop from the DOM
    }
  };

  // Function to fetch coordinates based on selected plate number
  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/get-coordinates?plateNumber=${selectedPlateNumber}`
        );
        if (response.ok) {
          const { latitude, longitude } = await response.json();
          setCoordinates({ latitude, longitude });
        } else {
          console.error("Failed to fetch coordinates");
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    if (selectedPlateNumber) {
      fetchCoordinates();
    }
  }, [selectedPlateNumber]);

  // const latitude = coordinates.latitude.toString();
  // const longitude = coordinates.longitude.toString();

  const latitude = 8.1569808;
  const longitude = 125.1253695;

  // Google Maps URL
  const googleMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    latitude
  )},${encodeURIComponent(longitude)}&t=&z=17&ie=UTF8&iwloc=B&output=embed`;

  return (
    <>
      <div className="header-wrapper">
        <div className="header-container">
          <h4>
            <strong>MONITORING</strong>{" "}
          </h4>{" "}
          <span className="userName">
            <span className="userName-text">Administrator</span>{" "}
            <FontAwesomeIcon icon={faCircleUser} className="icon-circle" />
          </span>
        </div>
      </div>
      <div className="Monitoring-container">
        <div className="Container row"></div>
        <div className="monitoring-wrapper">
          <div>
            {/* className='vehicleList' */}
            <h4>
              BukSU Vehicle
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
                    <TfiSearch className="searchcon" />
                  </label>
                </form>
              </div>
              <CiSquarePlus className="pluscar" onClick={toggleOpen} />
            </h4>
            <div>
              {" "}
              <p className="noCars">
                <IoCarSportOutline /> {filteredVehicleList.length} Vehicle Total{" "}
              </p>
            </div>
            {/* <button className='button-all'>All </button>
<button className='button-all'>Available </button>
<button className='button-all'>Used</button> */}

            <div>
              <button
                className={`button-all ${isActive("all")}`}
                onClick={() => handleFilter("all")}
              >
                All
              </button>
              <button
                className={`button-available ${isActive("available")}`}
                onClick={() => handleFilter("available")}
              >
                Available
              </button>
              <button
                className={`button-used ${isActive("used")}`}
                onClick={() => handleFilter("used")}
              >
                Used
              </button>
            </div>

            <div className="ListVehicle">
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
                            style={{ cursor: "pointer" }}
                          >
                            <td>
                              <strong>{plateNumber}</strong>
                            </td>
                            <td
                              style={{
                                textDecoration:
                                  vehicleStatus[plateNumber] === "Used"
                                    ? "underline"
                                    : "none",
                                cursor: "pointer",
                                color:
                                  vehicleStatus[plateNumber] === "Used"
                                    ? "#f80f0f"
                                    : "#1adf1a",
                              }}
                            >
                              {vehicleStatus[plateNumber] === "Used"
                                ? "Used"
                                : "Available"}
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

          <div
            className="firstmodal"
            style={{ display: showEditModal ? "none" : "block" }}
          >
            <MDBModal
              tabIndex="-1"
              open={selectedPlateNumber !== null || isHistoryVisible}
              setOpen={setVehicleDetailsModalOpen}
            >
              <MDBModalDialog>
                <MDBModalContent>
                  <MDBModalHeader>
                    <MDBModalTitle>
                      {isHistoryVisible ? "History" : "Vehicle Details"}
                    </MDBModalTitle>
                    <button
                      className="btn-close"
                      onClick={() => {
                        setSelectedPlateNumber(null);
                        setHistoryVisible(false);
                      }}
                    ></button>
                  </MDBModalHeader>
                  <MDBModalBody>
                    {/* Vehicle Details */}
                    {selectedPlateNumber &&
                      selectedVehicleDetails &&
                      !isHistoryVisible && (
                        <div>
                          <div className="pictureArea">
                            <div className="Picture">
                              {/* <p>image here:</p>  */}
                              <img
                                width="150px"
                                height="100px"
                                style={{ float: "left" }}
                                src={`${selectedVehicleDetails.vehicle.carImage}`}
                                alt="Car"
                              />
                            </div>
                            <div className="picText">
                              <h3 className="plate-number">
                                {" "}
                                {selectedPlateNumber}
                              </h3>{" "}
                              {/* Added class name for plate number */}
                              <h4 className="vehicle-details">
                                {selectedVehicleDetails.vehicle.vehicleName}{" "}
                                {/* Display vehicle name */}
                              </h4>
                            </div>
                          </div>
                          <div className="button-container">
  <button
    onClick={() => {
      handleEditButtonClick(selectedPlateNumber);
      handleCloseFirstModal();
    }}
    className="btn btn-primary wide-button" // Added wide-button class
  >
    Edit
  </button>{" "}
  &nbsp; &nbsp;
  <button
    onClick={() => {
      handleDeleteButtonClick(selectedPlateNumber);
      handleCloseFirstModal();
    }}
    className="btn btn-danger wide-button" // Added wide-button class
  >
    Delete
  </button>
</div>

                          {/* <button onClick={() => handleDeleteConfirmation(selectedPlateNumber)} className="btn btn-danger">Delete</button>  */}
                          <div>
                            <div
                              style={{
                                display: "block",
                                width: 600,
                                padding: 10,
                              }}
                            >
                              {/* Display additional details */}
                              <Row>{/* Remaining content */}</Row>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* History */}
                    {isHistoryVisible && (
                      <div className="historyRight">
                        <div className="pictureArea">
                          <div className="Picture">
                            <img
                              width="120px"
                              style={{ float: "left" }}
                              src={car1}
                            />
                          </div>
                          <div className="picText">
                            <h3 className="plate-number">
                              {selectedPlateNumber}
                            </h3>{" "}
                            {/* Added class name for plate number */}
                            <p className="vehicle-details">
                              {selectedVehicleDetails.addvehicles}
                            </p>{" "}
                            {/* Added class name for vehicle details */}
                          </div>
                        </div>
                        <div className="historyTables">
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
        <div></div>

        {/* INNSERT VEHICLE FORM */}
        <div>
          <MDBModal tabIndex="-1" open={centredModal} setOpen={setCentredModal}>
            <MDBModalDialog>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>Add Vehicle</MDBModalTitle>
                </MDBModalHeader>
                <MDBModalBody>
                  <form id="addvec" onSubmit={handlesubmitvec}>
                    <label>
                      Plate Number
                      <input
                        type="text"
                        className="addVehicle"
                        required
                        value={formData.plateNumber2}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            plateNumber2: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Vehicle
                      <input
                        type="text"
                        className="addVehicle"
                        required
                        value={formData.addvehicles}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            addvehicles: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Insert Image
                      {/* <input type="file" className='addVehicle' accept="image/*" onChange={handleImageChange}/> */}
                      <input
                        type="file"
                        name="carImage"
                        className="addVehicle"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            carImage: e.target.files[0],
                          })
                        }
                      />
                    </label>
                    <div className="btnDown">
                      <button className="closeM mt-2 " onClick={toggleOpen}>
                        {" "}
                        Cancel
                      </button>
                      <button className="saveCar"> Save</button>
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

      {/* Vehicle details MODAL */}
      <div
        className="secondmodal"
        style={{ display: showVecModal ? "block" : "none" }}
      >
        <MDBModal tabIndex="-1" open={showVecModal} setOpen={setShowVecModal}>
          <MDBModalDialog style={{ maxWidth: "750px" }}>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Vehicle's Wherabouts</MDBModalTitle>
                <button
                  className="btn-close"
                  onClick={handleCancelEdit}
                ></button>
              </MDBModalHeader>
              <MDBModalBody>
                {/* Display vehicle name and plate number */}
                {selectedVehicleDetails && (
                  <div>
                    {/* <h5>Vehicle Name: {selectedVehicleDetails.vehicleName}</h5> */}
                    <h5>Plate Number: {selectedPlateNumber}</h5>
                    {/* Add your map component here */}
                    {/* Below is just a placeholder */}
                    {locationData && (
                      <div
                        style={{ height: "250px", backgroundColor: "#f0f0f0" }}
                      >
                        {/* Map Component Goes Here */}
                        <iframe
                          width="680"
                          height="360"
                          frameBorder="0"
                          scrolling="no"
                          marginHeight="0"
                          marginWidth="0"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            locationData.latitude
                          )},${encodeURIComponent(
                            locationData.longitude
                          )}&t=&z=17&ie=UTF8&iwloc=B&output=embed`}
                        >
                          <a href="https://www.maps.ie/population/">
                            Calculate population in area
                          </a>
                        </iframe>
                      </div>
                    )}
                  </div>
                )}
              </MDBModalBody>
              <br />
              <br />
              <br />
              <br />
              <MDBModalFooter>
                <button
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Back
                </button>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </div>

      {/* EDIT MODAL */}
      <div className="secondmodal" style={{ display: showEditModal ? "block" : "none" }}>
  <MDBModal tabIndex="-1" open={showEditModal} setOpen={setShowEditModal}>
    <MDBModalDialog>
      <MDBModalContent>
        <MDBModalHeader>
          <MDBModalTitle>Edit Vehicle</MDBModalTitle>
          <button className="btn-close" onClick={handleCancelEdit}></button>
        </MDBModalHeader>
        <MDBModalBody>
          {/* Form for editing vehicle details */}
          <form onSubmit={handleEditVehicle}>
            <div className="form-group">
              <label htmlFor="originalPlateNumber">Original Plate Number</label>
              <input
                type="text"
                id="originalPlateNumber"
                className="form-control"
                value={notPlateNumber}
                onChange={handleOrigPlateNumberChange}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="editedPlateNumber">Edited Plate Number</label>
              <input
                type="text"
                id="editedPlateNumber"
                className="form-control"
                value={editedPlateNumber}
                onChange={handleEditPlateNumberChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="editedVehicle">Vehicle</label>
              <input
                type="text"
                id="editedVehicle"
                className="form-control"
                value={editedVehicle}
                onChange={handleEditVehicleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="carImage">Insert Image</label>
              <input
                type="file"
                id="carImage"
                name="carImage"
                className="form-control-file"
                onChange={handleEditCarImageChange}
              />
            </div>
          </form>
        </MDBModalBody>
        <MDBModalFooter>
          <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
          <button type="submit" className="btn btn-primary" onClick={handleConfirmEdit}>Save Changes</button>
        </MDBModalFooter>
      </MDBModalContent>
    </MDBModalDialog>
  </MDBModal>
</div>

    </>
  );
}

export default Monitoring;
