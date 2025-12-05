import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerMyBookings.css";
import {toast} from "react-toastify";
import { toastSuccessOptions,toastErrorOptions } from "../toastUtils";
import MyContributions from "./MyContributions.jsx";
import { API_URL } from "../api.js";

export default function VolunteerMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/bookings/my-bookings`, {
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

  const updateStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/bookings/status`,
        { bookingId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Booking marked as ${status}`,toastSuccessOptions);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update booking",toastErrorOptions);
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
      <div className="profile-box container my-4 p-4 shadow-lg rounded">
        <h3 className="mb-3 text-center text-warning fw-bold">My Profile</h3>

        {user && (
          <div className="card mb-4 shadow-sm bg-dark text-light border-0">
            <div className="card-body">
              <h5 className="card-title mb-3 text-warning">User Information</h5>
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

        {/* MY BOOKINGS */}
        <h4 className="mb-3 text-warning text-center">My Bookings</h4>
        {loading && <div>Loading...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && bookings.length === 0 && (
          <div className="alert alert-info text-center">No bookings yet.</div>
        )}

        {bookings.map((b) => {
          const isPast = b.status === "cancelled" || b.status === "delivered";
          return (
            <div
              key={b._id}
              className={`card mb-3 shadow-sm ${
                isPast ? "border-secondary" : "border-success"
              }`}
            >
              <div className="card-body bg-dark text-light">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title text-light">
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
                      <li
                        key={idx}
                        className="list-group-item d-flex justify-content-between bg-dark text-light border-secondary"
                      >
                        <span>{listingItem?.name || "Item"}</span>
                        <span>
                          {it.quantity} {listingItem?.unit || ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>

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

        
        <div className="mt-5">
          <h4 className="text-warning text-center mb-3">My Contributions</h4>
          <div className="bg-dark p-3 rounded">
            <MyContributions />
          </div>
        </div>
      </div>
    </div>
  );
}
