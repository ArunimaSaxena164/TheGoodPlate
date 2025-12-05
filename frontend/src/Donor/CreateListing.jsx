import React, { useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import { toastSuccessOptions,toastErrorOptions } from "../toastUtils";
import { API_URL } from "../api";
 import './CreateListing.css'

const CreateListing = () => {
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [foodDetails, setFoodDetails] = useState([
    { name: "", quantity: "", unit: "", shelfLife: "", description: "" },
  ]);

  // Add new food item
  const addFoodItem = () => {
    setFoodDetails([
      ...foodDetails,
      { name: "", quantity: "", unit: "", shelfLife: "", description: "" },
    ]);
  };

  // Remove food item
  const removeFoodItem = (index) => {
    if (foodDetails.length === 1) return; // prevent empty state
    const updated = [...foodDetails];
    updated.splice(index, 1);
    setFoodDetails(updated);
  };

  // Handle input changes
  const handleFoodChange = (index, e) => {
    const newFoodDetails = [...foodDetails];
    newFoodDetails[index][e.target.name] = e.target.value;
    setFoodDetails(newFoodDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/listings`,
        {
          address,
          coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
          foodDetails,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Listing created successfully!",toastSuccessOptions);  
      console.log(response.data);

      // clear form
      setAddress("");
      setLat("");
      setLng("");
      setFoodDetails([
        { name: "", quantity: "", unit: "", shelfLife: "", description: "" },
      ]);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error creating listing",toastErrorOptions);
    }
  };

  return (
    <div className="create-listing-page">
    <div className="listing-box mt-4 mb-5">
      <h2 className="text-center mb-4">List your food donation</h2>
      <form onSubmit={handleSubmit} className="p-4 rounded shadow-sm ">

        {/* Address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Coordinates */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Latitude</label>
            <input
              type="number"
              step="any"
              className="form-control"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Longitude</label>
            <input
              type="number"
              step="any"
              className="form-control"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              required
            />
          </div>
        </div>

        <hr />
        <h5 className="mt-3">Food Details</h5>

        {foodDetails.map((item, index) => (
          <div key={index} className=" p-3 mb-3 position-relative">

            {/* Remove / Delete button */}
            <button
              type="button"
              className="btn-close position-absolute  p-2 rounded-circle shadow-sm"
              onClick={() => removeFoodItem(index)}
              disabled={foodDetails.length === 1}
            ></button>

            <div className="row">
              <div className="col-md-3 mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Food Name"
                  value={item.name}
                  onChange={(e) => handleFoodChange(index, e)}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-2 mb-2">
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleFoodChange(index, e)}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-2 mb-2">
                <select
                  name="unit"
                  value={item.unit}
                  onChange={(e) => handleFoodChange(index, e)}
                  className="form-select"
                  required
                >
                  <option value="">Unit</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="litre">litre</option>
                  <option value="ml">ml</option>
                  <option value="packets">packets</option>
                  <option value="plates">plates</option>
                  <option value="units">units</option>
                </select>
              </div>

              <div className="col-md-2 mb-2">
                <input
                  type="text"
                  name="shelfLife"
                  placeholder="Shelf Life (e.g., 2 days)"
                  value={item.shelfLife}
                  onChange={(e) => handleFoodChange(index, e)}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-3 mb-2">
                <input
                  type="text"
                  name="description"
                  placeholder="Description (optional)"
                  value={item.description}
                  onChange={(e) => handleFoodChange(index, e)}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={addFoodItem}
          >
            + Add Another Item
          </button>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Create Listing
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateListing;
