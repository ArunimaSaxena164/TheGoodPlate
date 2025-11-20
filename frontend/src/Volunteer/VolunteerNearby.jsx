import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './VolunteerNearby.css'

export default function VolunteerNearby() {
  const [coords, setCoords] = useState(null);
  const [radiusKm, setRadiusKm] = useState(10);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");

  //  Prevent overwriting manual coords
  const manualOverride = useRef(false);

  // AUTO DETECTION (only runs if manualOverride is false)
  useEffect(() => {
    if (manualMode || manualOverride.current) return; // skip if manual mode active or manually set
    if (!("geolocation" in navigator)) {
      setErr("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setErr("Location permission denied. You can set it manually."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [manualMode]);

  // FETCH LISTINGS WHEN COORDS/RADIUS CHANGE
  useEffect(() => {
    const fetchNearby = async () => {
      if (!coords) return;
      setLoading(true);
      setErr("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/listings/near?lat=${coords.lat}&lng=${coords.lng}&radius=${radiusKm}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setListings(res.data);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load nearby listings");
      } finally {
        setLoading(false);
      }
    };
    fetchNearby();
  }, [coords, radiusKm]);

  // MANUAL SUBMIT
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualLat || !manualLng) {
      alert("Please enter both latitude and longitude.");
      return;
    }
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    setCoords({ lat, lng });
    manualOverride.current = true;
    setManualMode(false);
  };

  // SWITCH BACK TO AUTO MODE
  const handleUseCurrentLocation = () => {
    manualOverride.current = false;
    setManualMode(false);
    setManualLat("");
    setManualLng("");
    setErr("");
    setCoords(null); // force re-fetch
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setErr("Unable to access your location automatically.")
    );
  };

  console.log(" Using coordinates:", coords);

  return (
    <div className="listings-page">
    <div className="listings-box container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="mb-3">
          <Link to="/volunteer/all" className="btn btn-secondary btn-sm me-2">
            View All Listings
          </Link>
         
        </div>
        <h3>Nearby Food Listings</h3>
        <div className="d-flex align-items-center">
          <label className="me-2">Radius (km)</label>
          <select
            className="form-select"
            style={{ width: 120 }}
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        {!manualMode ? (
          <button
            className="btn btn-outline-secondary btn-sm me-2"
            onClick={() => setManualMode(true)}
          >
            🗺️ Select Location Manually
          </button>
        ) : (
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={handleUseCurrentLocation}
          >
            📍 Use My Current Location
          </button>
        )}

        {coords && (
          <span className="text-muted small">
            Current: {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
          </span>
        )}
      </div>

      {/* 🗺️ Manual Input */}
      {manualMode && (
        <form
          onSubmit={handleManualSubmit}
          className="rounded p-3 mb-3 dark-bg"
        >
          <div className="row">
            <div className="col-md-5 mb-2">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-md-5 mb-2">
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-md-2 mb-2">
              <button type="submit" className="btn btn-primary w-100">
                Set Location
              </button>
            </div>
          </div>
        </form>
      )}

      {err && <div className="alert alert-danger">{err}</div>}
      {loading && <div>Loading...</div>}

      {!loading && listings.length === 0 && !err && (
        <div className="alert alert-info">No listings found nearby.</div>
      )}

      <div className="row">
        {listings.map((l) => (
          <div key={l._id} className="col-md-6 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title mb-1">{l.address}</h5>
                  <span className="badge bg-primary">
                    {l.distanceKm.toFixed(2)} km
                  </span>
                </div>
                <div className="text-muted small mb-2">
                  Items available: {l.itemsCount} •{" "}
                  Soonest expiry:{" "}
                  {new Date(l.soonestExpiry).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                     hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </div>

                <ul className="list-group list-group-flush mb-3">
                  {l.activeItems.slice(0, 3).map((it, idx) => (
                    <li
                      key={idx}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <div>
                        <strong>{it.name}</strong>
                      </div>
                      <div className="text-muted small">
                        {it.remainingQuantity} {it.unit}
                      </div>
                    </li>
                  ))}
                  {l.activeItems.length > 3 && (
                    <li className="list-group-item text-center text-muted small">
                      + {l.activeItems.length - 3} more items
                    </li>
                  )}
                </ul>

                <div className="d-flex justify-content-end">
                  <Link
                    to={`/volunteer/listing/${l._id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

