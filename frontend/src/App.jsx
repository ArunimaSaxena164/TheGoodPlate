import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Home from './Home/Home.jsx';
import Login from './Login/Login.jsx';
import Signup from './Login/Signup.jsx';

function App() {
  return (
    <Router>
      <div>
        {/* Simple Navbar for navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">TheGoodPlate</Link>
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

        {/* Route definitions */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
