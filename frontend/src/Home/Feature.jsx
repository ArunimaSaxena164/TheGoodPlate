import React from "react";
import "./Feature.css";

const Feature = () => {
  return (
    <section className="feature-section text-light py-5">
      <div className="container">
        <h2 className="feature-heading text-center mb-5">Our Features</h2>

        <div className="feature-item d-flex align-items-start mb-4">
          <i className="bi bi-person-check-fill feature-icon text-warning"></i>
          <div>
            <h4>Easy User Accounts</h4>
            <p>
              Donors and volunteers can sign up quickly. One-time donor accounts
              auto-expire after their food is delivered.
            </p>
          </div>
        </div>

        <div className="feature-item d-flex align-items-start mb-4">
          <i className="bi bi-box-seam feature-icon text-success"></i>
          <div>
            <h4>Smart Food Listings</h4>
            <p>
              Donors can add food details with shelf life. Listings auto-delete
              when expired — ensuring freshness and safety.
            </p>
          </div>
        </div>

        <div className="feature-item d-flex align-items-start mb-4">
          <i className="bi bi-geo-alt-fill feature-icon text-danger"></i>
          <div>
            <h4>Volunteer Matching</h4>
            <p>
              Volunteers instantly see nearby food donations, helping reduce
              response time and food waste.
            </p>
          </div>
        </div>

        <div className="feature-item d-flex align-items-start mb-4">
          <i className="bi bi-bell-fill feature-icon text-info"></i>
          <div>
            <h4>Real-time Notifications</h4>
            <p>
              Donors and volunteers stay updated with instant alerts for pickup,
              delivery, and new listings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
