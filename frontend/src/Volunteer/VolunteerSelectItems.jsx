import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './VolunteerSelectItems.css'
import {toast} from "react-toastify";
import { toastSuccessOptions,toastErrorOptions } from "../toastUtils";
import { API_URL } from "../api";

export default function VolunteerSelectItems() {
  const { id } = useParams(); // listing id
  const [listing, setListing] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();

  // Fetch listing details
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListing(res.data);
      } catch (err) {
        toast.error("Error fetching listing details",toastErrorOptions);
      }
    };
    fetchListing();
  }, [id]);

  const handleQuantityChange = (itemId, value) => {
    setSelectedItems({
      ...selectedItems,
      [itemId]: parseFloat(value) || 0,
    });
  };

  // Select full quantity for an item
  const handleSelectFull = (itemId, qty) => {
    setSelectedItems({
      ...selectedItems,
      [itemId]: qty,
    });
  };

  // Select full listing (all items)
  const handleSelectAll = () => {
    const allSelected = {};
    listing.foodDetails.forEach((item) => {
      if (item.remainingQuantity > 0 && new Date(item.expiresAt) > new Date()) {
        allSelected[item._id] = item.remainingQuantity;
      }
    });
    setSelectedItems(allSelected);
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  const selected = Object.entries(selectedItems)
    .filter(([_, qty]) => qty > 0)
    .map(([itemId, quantity]) => ({ itemId, quantity: Number(quantity) }));

  if (selected.length === 0) {
    alert("Please select at least one item!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to book items.",toastErrorOptions);
      navigate("/login", { state: { from: `/volunteer/listing/${id}/select` } });
      return;
    }

    const res = await axios.post(
      `${API_URL}/api/bookings`,
      { listingId: id, items: selected },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Booking successful!",toastSuccessOptions);
    console.log("Booking:", res.data.booking);

    // Optional: redirect to My Bookings (we’ll add this page soon)
    navigate("/profile/my-bookings");

  } catch (err) {
    console.error("Booking error:", err);
    toast.error(err.response?.data?.message || "Error creating booking",toastErrorOptions);
  }
};

  if (!listing) return <div className="container my-4">Loading...</div>;

  return (
    <div className="listing-select-page">
    <div className="listing-select-box container my-4">
      <h3 className="mb-3">Select from {listing.address}</h3>

      <form onSubmit={handleSubmit}>
        {listing.foodDetails.map((item) => {
          const expired = new Date(item.expiresAt) <= new Date();
          const unavailable = item.remainingQuantity <= 0 || expired;

          return (
            <div
              key={item._id}
              className={`card mb-3 p-3 ${
                unavailable ? "bg-light text-muted" : ""
              }`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.name}</strong> <br />
                  <small className="text-muted">
                    {item.remainingQuantity} {item.unit} available • expires{" "}
                    {new Date(item.expiresAt).toLocaleDateString("en-GB")}{" "}
                    {expired && <span className="text-danger fw-bold"> (Expired)</span>}
                  </small>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={item.remainingQuantity}
                    step="any"
                    className="form-control"
                    style={{ width: 120 }}
                    disabled={unavailable}
                    value={selectedItems[item._id] || ""}
                    onChange={(e) =>
                      handleQuantityChange(item._id, e.target.value)
                    }
                    placeholder="Enter qty"
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    disabled={unavailable}
                    onClick={() =>
                      handleSelectFull(item._id, item.remainingQuantity)
                    }
                  >
                    Full
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <div className="d-flex justify-content-between mt-3">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleSelectAll}
          >
            Select Complete Listing
          </button>
          <button type="submit" className="btn btn-primary">
            Confirm Selection
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}
