import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home/Home.jsx";
import Login from "./Login/Login.jsx";
import Signup from "./Login/Signup.jsx";
import Footer from "./boilerplate/footer.jsx";
import Navbar from "./boilerplate/navbar.jsx";
import CreateListing from "./Donor/CreateListing.jsx";
import VolunteerNearby from "./Volunteer/VolunteerNearby";
import VolunteerAllListings from "./Volunteer/VolunteerAllListings";
import VolunteerListingsDetails from "./Volunteer/VolunteerListingDetails.jsx";
import VolunteerSelectItems from "./Volunteer/VolunteerSelectItems.jsx";
import ProtectedRoute from "./protectedRoute.jsx";
import VolunteerMyBookings from "./Volunteer/VolunteerMyBookings.jsx";
import EditListing from "./Donor/EditListing.jsx";

import bgImage from "./assets/bg.jpg";   // <-- ADD THIS

function App() {
  return (
    <div
      className="app-root"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/donor/create-listing"
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteer/nearby"
            element={
              <ProtectedRoute>
                <VolunteerNearby />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteer/all"
            element={
              <ProtectedRoute>
                <VolunteerAllListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteer/listing/:id"
            element={
              <ProtectedRoute>
                <VolunteerListingsDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/volunteer/listing/:id/select"
            element={
              <ProtectedRoute>
                <VolunteerSelectItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/my-bookings"
            element={
              <ProtectedRoute>
                <VolunteerMyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/edit-listing/:id"
            element={
              <ProtectedRoute>
                <EditListing />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
