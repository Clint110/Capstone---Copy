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

function Drivers() {
  const [filter, setFilter] = useState("all");
  const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [driverName, setDriverName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [editedDriverName, setEditedDriverName] = useState("");

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/drivers", { name: formData.name });
      console.log("Driver added:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error adding driver:", error);
      // setError("Error adding driver");
    }
  };

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
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };

  const handleEdit = async () => {
    // Edit functionality here
    console.log("Edit driver:", selectedDriver);
    handleClose();
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
                    placeholder="Search. . ."
                    // value={searchInput}
                    // onChange={(e) => setSearchInput(e.target.value)}
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
                Total of Drivers{" "}
              </p>
            </div>

            <div>
              <button
                className="button-all"
                // className={`button-all ${isActive("all")}`}
                // onClick={() => handleFilter("all")}
              >
                All
              </button>
              <button
                className="button-all"
                // className={`button-available ${isActive("available")}`}
                // onClick={() => handleFilter("available")}
              >
                Available
              </button>
              <button
                className="button-all"
                // className={`button-used ${isActive("used")}`}
                // onClick={() => handleFilter("used")}
              >
                On Travel
              </button>
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
                      <tr>
                        <td>
                          <strong>Dr.Jose Rizal</strong>
                        </td>
                        <td>
                          {/* {vehicleStatus[plateNumber] === "Used"
                                ? "Used"
                                : "Available"} */}
                        </td>
                        <td>
                          {/* Edit and Delete Buttons */}
                          <Button
                            variant="primary"
                            onClick={() =>
                              handleShowEditModal({ name: "Dr. Jose Rizal" })
                            }
                          >
                            Edit
                          </Button>{" "}
                          <Button
                            variant="danger"
                            onClick={() =>
                              handleShowDeleteModal({ name: "Dr. Jose Rizal" })
                            }
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
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
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Driver Modal */}
      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
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
