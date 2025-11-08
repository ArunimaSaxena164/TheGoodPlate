import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/authContext"; 
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear token + user from context & localStorage
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light stylenav">
      <div className="container-fluid">
        <Link className="navbar-brand fontnav" to="/">
          The Good Plate
        </Link>

        {/* Toggle button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible part */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* Show Login/Signup if not logged in */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Signup
                  </Link>
                </li>
              </>
            )}

            {/* Show Logout if logged in */}
            {user && (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-danger-reverse btn-sm ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* Profile icon is always visible (optional — you can hide if not logged in) */}
            <li className="nav-item profile-icon">
              <Link className="nav-link" to="/profile/my-bookings">
                <FaUserCircle size={24} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
