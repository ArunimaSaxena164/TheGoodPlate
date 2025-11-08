import React, { useEffect, useState } from "react";
import axios from "axios";
import './VolunteerMyBookings.css'
export default function VolunteerMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  //  Load user from localStorage (from login)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  //  Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  //  Update booking status (Cancel / Delivered)
  const updateStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/bookings/status",
        { bookingId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Booking marked as ${status}`);
      // Refresh bookings
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status } : b
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update booking");
    }
  };

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "-";

  return (
    <div className="profile-page">
    <div className=" profile-box container my-4">
      <h3 className="mb-3 text-center">My Profile</h3>

      {/* user Info Section */}
      {user && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">User Information</h5>
            <div className="row">
              <div className="col-md-4">
                <strong>Name:</strong> {user.name}
              </div>
              <div className="col-md-4">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="col-md-4">
                <strong>Phone:</strong> {user.phone}
              </div>
            </div>
          </div>
        </div>
      )}

      <h4 className="mb-3 text-center">My Bookings</h4>

      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && bookings.length === 0 && (
        <div className="alert alert-info text-center">
          No bookings yet.
        </div>
      )}

      {/*  Bookings List */}
      {bookings.map((b) => {
        const isPast = b.status === "cancelled" || b.status === "delivered";
        return (
          <div
            key={b._id}
            className={`card mb-3 shadow-sm ${
              isPast ? "border-secondary" : "border-success"
            }`}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title">
                    {b.listing?.address || "Listing deleted"}
                  </h5>
                  <p className="text-muted small mb-2">
                    Status:{" "}
                    <span
                      className={`badge ${
                        b.status === "reserved"
                          ? "bg-success"
                          : b.status === "cancelled"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {b.status}
                    </span>
                  </p>
                </div>
                <small className="text-muted">
                  Booked on {formatDate(b.createdAt)}
                </small>
              </div>

              <ul className="list-group list-group-flush mb-3">
                {b.items.map((it, idx) => {
                  const listingItem = b.listing?.foodDetails?.find(
                    (fd) => fd._id === it.itemId
                  );
                  return (
                    <li key={idx} className="list-group-item d-flex justify-content-between">
                      <span>{listingItem?.name || "Item"}</span>
                      <span>
                        {it.quantity} {listingItem?.unit || ""}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* Buttons */}
              {b.status === "reserved" && (
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => updateStatus(b._id, "cancelled")}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => updateStatus(b._id, "delivered")}
                  >
                    Mark as Delivered
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}

