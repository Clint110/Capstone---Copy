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
import { IoCarSportOutline } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "react-bootstrap";
import {  DropdownButton, Dropdown } from "react-bootstrap";

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [filter, setFilter] = useState("active"); 
  const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [driverName, setDriverName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [editedDriverName, setEditedDriverName] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Handler function for filter buttons
  const handleFilter = (selectedFilter) => {
    setFilter(selectedFilter);
  };
  

  const isActive = (selectedFilter) => {
    return selectedFilter === filter ? "active" : "";
  };

  const [formData, setFormData] = useState({
    name: "",
  });

  console.log(formData);

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const response = await axios.post("/drivers", { name: formData.name });
  //     console.log("Driver added:", response.data);
  //     handleClose();
  //   } catch (error) {
  //     console.error("Error adding driver:", error);
  //     // setError("Error adding driver");
  //   }
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:3000/add", formData);
  //     console.log("Driver added:", response.data);
  //     // Reset the form after successful submission
  //     setFormData({ name: "" });
  //   } catch (error) {
  //     console.error("Error adding driver:", error);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/add", formData);
      console.log("Driver added:", response.data);
      setFormData({ name: "" });
      setShow(false);
      fetchDrivers(); // Refresh the driver list
    } catch (error) {
      console.error("Error adding driver:", error);
    }
  };

  // useEffect(() => {
  //   fetchDrivers();
  // }, []);

  // const fetchDrivers = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3000/drivers");
  //     setDrivers(response.data);
  //   } catch (error) {
  //     console.error("Error fetching drivers:", error);
  //   }
  // };


  const fetchDrivers = async () => {
    try {
      let response;
      if (filter === "active") {
        response = await axios.get("http://localhost:3000/drivers/active");
      } else if (filter === "archived") {
        response = await axios.get("http://localhost:3000/drivers/archived");
      } else {
        response = await axios.get("http://localhost:3000/drivers");
      }
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [filter]);

  const handleClose = () => {
    setShow(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleShowEditModal = (driver) => {
    setSelectedDriver(driver);
  setEditedDriverName(driver.name); 
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/drivers/${selectedDriver._id}`, { name: editedDriverName });
      console.log("Edit driver:", response.data);
      fetchDrivers();
      setShowEditModal(false); // Close the edit modal after editing
    } catch (error) {
      console.error("Error editing driver:", error);
    }
  };

  const handleArchive = async (driver) => {
    console.log("Selected Driver for Archiving:", driver);
    try {
      if (driver) { // Check if selectedDriver is not null
        const response = await axios.put(`http://localhost:3000/drivers/${driver._id}/archive`);
        console.log("Archive driver:", response.data);
        fetchDrivers();
        handleClose();
      }
    } catch (error) {
      console.error("Error archiving driver:", error);
    }
  };

  const handleActivate = async (driver) => {
    try {
      if (driver && driver._id) { // Check if the driver object and its _id property are not null
        const response = await axios.put(
          `http://localhost:3000/drivers/${driver._id}/activate`
        );
        console.log("Activate driver:", response.data);
        fetchDrivers();
        handleClose();
      } else {
        console.error("Driver or its ID is null");
      }
    } catch (error) {
      console.error("Error activating driver:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Delete functionality here
      console.log("Delete driver:", selectedDriver);
      handleClose();
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  const handleChanges = (event) => {
    setSearchInput(event.target.value);
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="header-wrapper">
        <div className="header-container">
          <h4>
            <strong>DRIVERS</strong>{" "}
          </h4>{" "}
          <span className="userName">
            <span className="userName-text">Administrator</span>{" "}
            <FontAwesomeIcon icon={faCircleUser} className="icon-circle" />
          </span>
        </div>
      </div>

      <div className="driver-container">
        <div className="Container row"></div>
        <div className="driver-wrapper">
          <div>
            <h4>
              BukSU Drivers
              <div className="search-container">
                <form action="#" method="get">
                  <input
                    className="search expandright"
                    id="searchright"
                    type="search"
                    name="q"
                    placeholder="Search Driver's Name"
                    value={searchInput}
                    onChange={handleChanges}
                  />
                  <label className="button searchbutton" htmlFor="searchright">
                    <TfiSearch className="searchcon" />
                  </label>
                </form>
              </div>
              <CiSquarePlus className="plusdriver" onClick={handleShow} />
            </h4>
            <div>
              {" "}
              <p className="noDriver">
                <IoCarSportOutline />
                {/* {filteredVehicleList.length} */}
                Total of Drivers {filteredDrivers.length}
              </p>
            </div>

           
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
                On Travel
              </button>

              <div className="filter-dropdown">
          <DropdownButton id="dropdown-basic-button" title="Filter">
            {/* <Dropdown.Item onClick={() => handleFilter("all")}>Show All</Dropdown.Item> */}
            <Dropdown.Item onClick={() => handleFilter("active")}>Show Active Drivers</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilter("archived")}>Show Archived Drivers</Dropdown.Item>
          </DropdownButton>
        </div>
            </div>

            <div className="ListDriver">
              <div class="container">
                <table className="tableDriverList">
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderTopLeftRadius: "10px",
                          borderBottomLeftRadius: "10px",
                        }}
                        scope="col"
                      >
                        DRIVER
                      </th>
                      <th scope="col">STATUS</th>
                      <th
                        style={{
                          borderTopRightRadius: "10px",
                          borderBottomRightRadius: "10px",
                        }}
                        scope="col"
                      >
                        ACTION
                      </th>
                    </tr>
                  </thead>
                </table>
                <div className="driver-container">
                  <table className="tableDriver">
                    <tbody className="driver-tbody">
                    {filteredDrivers.map((driver) => (
                      <tr>
                        <td>
                          <strong>{driver.name}</strong>
                        </td>
                        <td>
                        {driver.isActive ? "Active" : "Inactive"}
                        </td>
                        <td>
                          {/* Edit and Delete Buttons */}
                          <Button
                            variant="primary"
                            onClick={() => handleShowEditModal(driver)}
                          >
                            Edit
                          </Button>{" "}
                          {/* <Button
                            variant="danger"
                            onClick={() =>
                              handleShowDeleteModal({ name: "Dr. Jose Rizal" })
                            }
                          >
                            Delete
                          </Button> */}
                          { filter === "active" && (
                                  <Button variant="warning" onClick={() => handleArchive(driver)}>Archive</Button>
                              )}
                          {filter === "archived" && (
                          <Button variant="success" onClick={ () => handleActivate(driver)}>
                            Activate
                          </Button>
                        )}
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
      </div>

      {/* INNSERT DRIVER FORM */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>DRIVERS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <label>
              Drivers Name
              <input
                type="text"
                className="addVehicle"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            {/* <Button variant="primary" type="submit">
              Submit
            </Button> */}
          </form>
        </Modal.Body>
        <Modal.Footer>
        <Button
        style={{
          backgroundColor: '#6c757d',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          cursor: 'pointer',
          
        }}
        onClick={handleClose}
      >
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
      Save
    </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Driver Modal */}
      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Body>
          {/* <form
          //</Modal.Body> onSubmit={handleSubmit}
          > */}
           <form onSubmit={handleEdit}> {/* Update onSubmit to handleEdit */}
            <label>
              Driver's Name
              <input
                type="text"
                className="addVehicle"
                value={editedDriverName}
          onChange={(e) => setEditedDriverName(e.target.value)}
              />
            </label>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Driver Modal */}
      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the driver{" "}
          <strong>{selectedDriver && selectedDriver.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Drivers;
