import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Logout from "./components/Logout";
import Sidebar from "./components/Sidebar";
import BookingTicket from "./components/booking/BookingTicket";
import DashboardMain from "./components/dashboard/DashboardMain";
import Monitoring from "./components/monitoring/Monitoring";
import Booking from "./components/booking/Booking";
import FuelReport from "./components/reports/FuelReport";
import TripReport from "./components/reports/TripReport";
import AddBook from "./components/booking/addBook";
import SideBar2 from "./components/sidebaraddbooking/Sidebaraddname";
import logoutaddbook from "./components/sidebaraddbooking/Logoutaddbook";
import TripReport2 from "./components/reports/TripReport copy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/booking-ticket" element={<BookingTicket />} />
        <Route path="/addbook" element={<AddBook />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/tripreport" element={<TripReport2 />} />
      </Routes>
      <Sidebar>
        <Routes>
          <Route path="/dashboard" element={<DashboardMain />} />   
          <Route path="/booking" element={<Booking />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/report-fuel_consumption" element={<FuelReport/>}/>
          <Route path="/reports" element={<TripReport/>}/>
        </Routes>
      </Sidebar>
    </Router>
  );
}

export default App;
