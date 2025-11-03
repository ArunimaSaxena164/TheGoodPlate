<<<<<<< HEAD
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section text-center text-white py-4">
      <div className="container">
        {/* Logo / Title */}
        <h3 className="footer-title mb-3">The Good Plate</h3>

        {/* Tagline */}
        <p className="footer-text mb-4">
          Sharing food, spreading hope. Because every plate counts. 🍽️
        </p>

        {/* Social Icons */}
        <div className="social-icons mb-3">
          <a href="#" className="social-link">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" className="social-link">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#" className="social-link">
            <i className="bi bi-twitter-x"></i>
          </a>
          <a href="#" className="social-link">
            <i className="bi bi-envelope-fill"></i>
          </a>
        </div>

        {/* Copyright */}
        <p className="footer-bottom mb-0">
          © {new Date().getFullYear()} The Good Plate. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
=======
import React from 'react';
function Footer() {
    return ( <>Footer</> );
}

export default Footer;
>>>>>>> 04bfc5a12595b86f762417fbb9aa9b63368987f8
