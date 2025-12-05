import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './VolunteerListingDetails.css'
import { useAuth } from "../context/authContext"; 
import {toast} from "react-toastify";
import { toastSuccessOptions,toastErrorOptions } from "../toastUtils";
import { API_URL } from "../api";
import Swal from "sweetalert2";

export default function VolunteerListingDetails() {
  const { id } = useParams();
  const {user} =useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setErr("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_URL}/api/listings/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setListing(res.data);
      } catch (e) {
        setErr(e.response?.data?.message || "Unable to load listing");
        toast.error(e.response?.data?.message||"Unable to load listing",toastErrorOptions);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <div className="container my-4">Loading...</div>;
  if (err)
    return <div className="container my-4 alert alert-danger">{err}</div>;
  if (!listing) return <div className="container my-4">Listing not found</div>;

  const formatDateTime = (iso) =>
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
const handleDeleteConfirm = () => {
  Swal.fire({
    title: "Delete this listing?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/listings/${listing._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Listing deleted successfully!", toastSuccessOptions);
      navigate("/volunteer/all"); // or /donor/my-listings if you prefer
    } catch (err) {
      toast.error("Failed to delete listing", toastErrorOptions);
    }
  });
};

  return (
    <div className="listing-details-page">
    <div className=" listing-details-box container my-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <Link
            to="/volunteer/nearby"
            className="btn btn-outline-secondary btn-sm me-2"
          >
            ← Back to Nearby
          </Link>
          <Link
            to="/volunteer/all"
            className="btn btn-outline-secondary btn-sm"
          >
            View All
          </Link>
        </div>

        <div className="text-end">
          <small className="text-muted d-block">Listed on</small>
          <strong>{formatDateTime(listing.createdAt)}</strong>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title">{listing.address}</h4>
          <div className="mb-2 text-muted small">
            {listing.itemsCount ?? listing.foodDetails.length} items • Soonest
            expiry:{" "}
            {listing.soonestExpiry
              ? formatDateTime(listing.soonestExpiry)
              : "—"}
          </div>

          <hr />

          <h5>Food items</h5>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Qty (total)</th>
                  <th>Remaining</th>
                  <th>Unit</th>
                  <th>Shelf life</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {listing.foodDetails.map((it) => {
                  const expired = new Date(it.expiresAt) <= new Date();
                  const unavailable = it.remainingQuantity <= 0 || expired;

                  return (
                    <tr
                      key={it._id}
                      className={
                        unavailable
                          ? "table-secondary text-muted position-relative"
                          : ""
                      }
                    >
                      <td>
                        <strong>{it.name}</strong>
                        <div className="small text-muted">{it.description}</div>

                        {/*  Show “Expired” label below the name if expired */}
                        {expired && (
                          <span
                            className="badge bg-danger mt-1"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Expired
                          </span>
                        )}
                      </td>

                      <td>{it.quantity}</td>
                      <td>{it.remainingQuantity}</td>
                      <td>{it.unit}</td>
                      <td>{it.shelfLife}</td>
                      <td>{formatDateTime(it.expiresAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 d-flex justify-content-between align-items-center"></div>
          <div className="p-3 bg-light rounded">
            <h6>Donor Contact Details:</h6>
            <div className="row">
              <div className="col-md-4">
                <p className="mb-1">
                  <strong>Name:</strong>
                </p>
                <p>{listing.donor?.name || "Not available"}</p>
              </div>
              <div className="col-md-4">
                <p className="mb-1">
                  <strong>Phone:</strong>
                </p>
                <p>{listing.donor?.phone || "Not available"}</p>
              </div>
              <div className="col-md-4">
                <p className="mb-1">
                  <strong>Email:</strong>
                </p>
                <p>{listing.donor?.email || "Not available"}</p>
              </div>
            </div>
          </div>
          <div>
            <small className="text-muted">Coordinates:</small>{" "}
            <code>
              {listing.coordinates?.lat ?? "-"},{" "}
              {listing.coordinates?.lng ?? "-"}
            </code>
          </div>
          <Link
            to={`/volunteer/listing/${listing._id}/select`}
            className="btn btn-primary w-100 mt-3"
          >
            Select from this Listing
          </Link>
                    {listing.donor?._id === user?.id && (
            <Link
              to={`/donor/edit-listing/${listing._id}`}
              className="btn btn-warning w-100 mt-2"
            >
              Edit Listing
            </Link>
          )}
          {listing.donor?._id === user?.id && (
            <button
              className="btn btn-danger w-100 mt-2"
              onClick={handleDeleteConfirm}
            >
              Delete Listing
            </button>
          )}
        </div>      


      </div>
    </div>
    </div>
  );
}
