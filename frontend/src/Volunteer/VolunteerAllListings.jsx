import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './VolunteerAllListings.css'
import { API_URL } from "../api";

export default function VolunteerAllListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/listings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(res.data);
      } catch (e) {
        setErr(e.response?.data?.message || "Unable to load listings");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="listings-page">
      <div className="listings-box container my-4">
      <h3 className="mb-3">All Active Listings</h3>
<div className="mb-3"> <Link to="/volunteer/nearby" className="btn btn-primary btn-sm">
            View Nearby Listings
          </Link></div>
      {err && <div className="alert alert-danger">{err}</div>}
      {loading && <div>Loading...</div>}
      {!loading && listings.length === 0 && (
        <div className="alert alert-info">No listings found.</div>
      )}

      <div className="row">
        {listings.map((l) => (
          <div key={l._id} className="col-md-6 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-1">{l.address}</h5>
                <div className="text-muted small mb-2">
                  Items available: {l.itemsCount} • &nbsp;Soonest expiry:{" "}
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
                  {l.activeItems.map((it, idx) => (
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
