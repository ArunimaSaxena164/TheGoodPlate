import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Navbar.css";
function Navbar() {
    return ( 
      <nav className="navbar navbar-expand-lg navbar-light stylenav">
           <div className="container">
             <Link className="navbar-brand fontnav" to="/">The Good Plate</Link>
             <div>
               <ul className="navbar-nav ms-auto">
                 <li className="nav-item">
                   <Link className="nav-link" to="/">Home</Link>
                 </li>
                 <li className="nav-item">
                   <Link className="nav-link" to="/login">Login</Link>
                 </li>
                 <li className="nav-item">
                   <Link className="nav-link" to="/signup">Signup</Link>
                 </li>
               </ul>
             </div>
           </div>
         </nav>

);
}

export default Navbar;