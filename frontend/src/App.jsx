import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Home from './Home/Home.jsx';
import Login from './Login/Login.jsx';
import Signup from './Login/Signup.jsx';
import Footer from "./boilerplate/Footer.jsx";
import Navbar from "./boilerplate/navbar.jsx";
import CreateListing from "./Donor/CreateListing.jsx";
import VolunteerNearby from "./Volunteer/VolunteerNearby";
import VolunteerAllListings from "./Volunteer/VolunteerAllListings";
function App() {
  return (
 
    <Router>
        
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/donor/create-listing" element={<CreateListing />} />
          <Route path="/volunteer/nearby" element={<VolunteerNearby />} />
          <Route path="/volunteer/all" element={<VolunteerAllListings />} />
        </Routes>
        <Footer/>
    </Router>
  );
}

export default App;
