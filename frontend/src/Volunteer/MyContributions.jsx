import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyContributions() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchMyListings = async () => {
      setLoading(true);
      setErr("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/listings/my-listings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(res.data);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load your listings");
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  const formatDateTime = (iso) =>
    new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  if (loading) return <div className="container my-4">Loading...</div>;
  if (err) return <div className="container my-4 alert alert-danger">{err}</div>;

  return (
    <div className="container my-4">
    
      {listings.length === 0 ? (
        <div className="alert alert-info">You haven’t added any listings yet.</div>
      ) : (
        <div className="row">
          {listings.map((l) => (
            <div key={l._id} className="col-md-6 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{l.address}</h5>
                  <p className="text-muted small mb-1">
                    Added: {formatDateTime(l.createdAt)}
                  </p>
                  <p className="text-muted small mb-1">
                    Expires: {formatDateTime(l.overallExpiresAt)}
                  </p>
                  <p className="mb-1">
                    Items: {l.remainingItems}/{l.totalItems} active
                  </p>
                  <p>
                    Status:{" "}
                    <span
                      className={`badge ${
                        l.isActive ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {l.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                  <Link
                    to={`/volunteer/listing/${l._id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
