import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastSuccessOptions, toastErrorOptions } from "../toastUtils";
import { API_URL } from "../api";
import './EditListing.css'
export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fixed = {
          ...res.data,
          coordinates: res.data.coordinates || { lat: 0, lng: 0 },
          foodDetails: res.data.foodDetails || [],
        };

        setListing(fixed);
      } catch (err) {
        console.error(err);
        toast.error("Cannot load listing", toastErrorOptions);
      }
      setLoading(false);
    };
    fetchListing();
  }, [id]);

  const handleFoodChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...listing.foodDetails];
    updated[index] = {
      ...updated[index],
      [name]: name === "quantity" ? Number(value) || 0 : value,
    };

    setListing({ ...listing, foodDetails: updated });
  };

  const removeFoodItem = (index) => {
    if (listing.foodDetails.length <= 1) {
      toast.error("A listing must have at least one item", toastErrorOptions);
      return;
    }

    const updated = listing.foodDetails.filter((_, i) => i !== index);
    setListing({ ...listing, foodDetails: updated });
  };

  const addFoodItem = () => {
    const newItem = {
      // no _id → Mongoose will generate
      name: "New item",
      quantity: 1,
      remainingQuantity: 1,
      unit: "kg",
      shelfLife: "1 day", // valid for your shelfLife parser
      description: "",
      // expiresAt will be recalculated in pre("save")
    };

    setListing({
      ...listing,
      foodDetails: [...(listing.foodDetails || []), newItem],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // send only fields that are meant to be edited
      const payload = {
        address: listing.address,
        coordinates: listing.coordinates,
        foodDetails: listing.foodDetails,
      };

      await axios.put(`${API_URL}/api/listings/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Listing updated!", toastSuccessOptions);
      navigate("/volunteer/all"); // or wherever your donor dashboard is
    } catch (err) {
      console.error(err);
      toast.error("Update failed", toastErrorOptions);
    }
  };

  if (loading || !listing) return <div>Loading...</div>;

  return (
    <div className="edit-listing-page">
    <div className="edit-listing-box container my-4">
      <h3>Edit Listing</h3>

      <form onSubmit={handleSubmit}>
        {/* Address */}
        <label className="form-label">Address</label>
        <input
          className="form-control mb-3"
          value={listing.address}
          onChange={(e) => setListing({ ...listing, address: e.target.value })}
        />

        {/* Coordinates */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Latitude</label>
            <input
              className="form-control"
              value={listing.coordinates.lat}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                setListing({
                  ...listing,
                  coordinates: {
                    ...listing.coordinates,
                    lat: Number.isNaN(num) ? 0 : num,
                  },
                });
              }}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Longitude</label>
            <input
              className="form-control"
              value={listing.coordinates.lng}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                setListing({
                  ...listing,
                  coordinates: {
                    ...listing.coordinates,
                    lng: Number.isNaN(num) ? 0 : num,
                  },
                });
              }}
            />
          </div>
        </div>

        <h4>Food Items</h4>

        {listing.foodDetails.map((item, idx) => (
          <div key={item._id || idx} className="card p-3 my-2 ">
            {listing.foodDetails.length > 1 && (
              <button
                type="button"
                className="remove-item-btn"
                onClick={() => removeFoodItem(idx)}
              >
                X
              </button>

            )}

            <input
              name="name"
              placeholder="Name"
              className="form-control mb-2"
              value={item.name}
              onChange={(e) => handleFoodChange(idx, e)}
            />

            <input
              name="quantity"
              placeholder="Quantity"
              className="form-control mb-2"
              value={item.quantity}
              onChange={(e) => handleFoodChange(idx, e)}
            />

            <input
              name="unit"
              placeholder="Unit (e.g., kg, plates)"
              className="form-control mb-2"
              value={item.unit}
              onChange={(e) => handleFoodChange(idx, e)}
            />

            <input
              name="shelfLife"
              placeholder='Shelf Life (e.g. "1 day", "6 hours")'
              className="form-control mb-2"
              value={item.shelfLife}
              onChange={(e) => handleFoodChange(idx, e)}
            />

            <input
              name="description"
              placeholder="Description"
              className="form-control mb-2"
              value={item.description || ""}
              onChange={(e) => handleFoodChange(idx, e)}
            />
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary mt-2"
          onClick={addFoodItem}
        >
          + Add More Items
        </button>

        <br />

        <button className="btn btn-primary mt-3" type="submit">
          Save Changes
        </button>
      </form>
    </div>
    </div>
  );
}
