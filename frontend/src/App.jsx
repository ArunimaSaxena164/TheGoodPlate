import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Home from './Home/Home.jsx';
import Login from './Login/Login.jsx';
import Signup from './Login/Signup.jsx';
import Navbar from "./boilerplate/Navbar.jsx";
import Footer from "./boilerplate/Footer.jsx";
import CreateListing from "./Donor/CreateListing.jsx";
function App() {
  return (
 
    <Router>
        
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/donor/create-listing" element={<CreateListing />} />
        </Routes>
        <Footer/>
    </Router>
  );
}

export default App;
