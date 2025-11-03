import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Home from './Home/Home.jsx';
import Login from './Login/Login.jsx';
import Signup from './Login/Signup.jsx';
import Navbar from "./boilerplate/Navbar.jsx";
import Footer from "./boilerplate/Footer.jsx";
function App() {
  return (
 
    <Router>
        
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Footer/>
    </Router>
  );
}

export default App;
