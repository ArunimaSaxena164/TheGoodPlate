import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function VolunteerSelectItems() {
  const { id } = useParams(); // listing id
  const [listing, setListing] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListing(res.data);
      } catch (err) {
        alert("Error fetching listing details");
      }
    };
    fetchListing();
  }, [id]);

  const handleQuantityChange = (itemId, value) => {
    setSelectedItems({
      ...selectedItems,
      [itemId]: parseFloat(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected:", selectedItems);
    // 🔜 later we’ll send this to backend as a booking request
    alert("Booking feature coming soon!");
    navigate("/volunteer/nearby");
  };

  if (!listing) return <div className="container my-4">Loading...</div>;

  return (
    <div className="container my-4">
      <h3 className="mb-3">Select from {listing.address}</h3>

      <form onSubmit={handleSubmit}>
        {listing.foodDetails.map((item) => (
          <div key={item._id} className="card mb-3 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{item.name}</strong> <br />
                <small className="text-muted">
                  {item.remainingQuantity} {item.unit} available • expires{" "}
                  {new Date(item.expiresAt).toLocaleString("en-GB")}
                </small>
              </div>
              <input
                type="number"
                min="0"
                max={item.remainingQuantity}
                step="any"
                className="form-control"
                style={{ width: 120 }}
                value={selectedItems[item._id] || ""}
                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                placeholder="Enter qty"
              />
            </div>
          </div>
        ))}

        <button type="submit" className="btn btn-primary w-100">
          Confirm Selection
        </button>
      </form>
    </div>
  );
}
