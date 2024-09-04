import React, { useState, useEffect } from "react";
import loginImage from "../images/login.png";
// import logo from "../images/buksu-new-logo.png";
import logo from "../images/BRAND LOGO-03.png";
import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import motorpoolBusImage from "../images/Motorpool-bus.jpg";
import $ from "jquery";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple email validation
    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }

    // Simple password validation
    if (!password.trim()) {
      setErrorMessage("Password is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 401) {
        setErrorMessage("Invalid credentials");
        return;
      }
      const data = await response.json();
      
      if (!data.success) {
        if (data.message === "Incorrect password") {
          setErrorMessage("Incorrect password");
        } else if (data.message === "User not found") {
          setErrorMessage("User not found");
        } else {
          setErrorMessage("Login failed: " + data.message);
        }
        return;
      }

      console.log("Login successful", data.user);

      // Check the role and redirect accordingly
      if (data.user.role === "admin") {
        navigate("/dashboard");
      } else if (data.user.role === "addbooker") {
        navigate("/addbook");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during login", error);
      setErrorMessage("Error during login");
    }
  };

  useEffect(() => {
    return () => {
      $(".modal-backdrop").remove();
    };
  }, []);

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#loginModal").modal("show");
    document.querySelector(function () {
      document.querySelector('[data-toggle="tooltip"]').tooltip();
    });
  });

  useEffect(() => {
    return () => {
      $(".modal-backdrop").remove();
    };
  }, []);

  return (
    <div
      className="Loginheader"
      style={{ backgroundImage: `url(${motorpoolBusImage})` }}
    >
      <div
        className="modal fade"
        id="loginModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-bottom-0">
              <div
                className="close-btn"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </div>
            </div>
            <div className="modal-body">
              <div className="form-title text-center">
                <h3>Log in to your account</h3>
                <p>Access your account securely by logging in with your credentials</p>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
              </div>
              <div className="d-flex flex-column text-center">
                <form className="ml-4" onSubmit={handleSubmit}>
                  <div className="input-group mb-3 col-10 position-relative">
                    <TfiEmail className="iIcon" />
                    <input
                      type="text"
                      className="EmaiL"
                      name="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="input-group mb-1 col-10 position-relative">
                    <RiLockPasswordLine className="iIcon" />
                    <input
                      type="password"
                      className="PassworD"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="input-group d-flex justify-content-between">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="formCheck"
                      />
                      <label
                        htmlFor="formCheck"
                        className="form-check-label text-secondary"
                      >
                        <small>Remember Me</small>
                      </label>
                    </div>
                  </div>
                  <div className="input-group  mr-5 mb-3">
                    <button type="submit" className="LoginBtn">Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Logincontainer">
        <nav>
          <a href="#login" className="logos">BukSU MoniTour</a>
          <img src={logo} alt="Logo" className="logo-right" />
        </nav>
        <div className="content">
          <h1>University Vehicle Tracking &amp; Monitoring</h1>
          <p>
            Stay on track with our university vehicle tracking and monitoring system! <br />
            Ensure safety, efficiency, and accountability for all campus vehicles.
          </p>
          <a data-toggle="modal" data-target="#loginModal" className="btn">Login</a>
        </div>
      </div>
    </div>
  );
}

export default Login;