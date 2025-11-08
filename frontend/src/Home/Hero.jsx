import React from "react";
import {Link} from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero-section d-flex align-items-center justify-content-center text-center">
      <div className="container">

        {/* MAIN HEADING */}
        <h1 className="hero-title mb-5">The Good Plate</h1>

        <div className="row justify-content-center">
          {/* Donor Card */}
          <div className="col-md-5 mx-3 my-3">
            <div className="card hero-card shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-success">Be a Donor</h3>
                <p className="card-text text-muted">
                  Share your excess food.Spread smiles.
                  Join our community of kind donors making a real difference.
                </p>
                 <Link
                  to="/donor/create-listing"
                  className="start-link text-decoration-none fw-bold"
                >
                  Start as a Donor →
                </Link>
              </div>
            </div>
          </div>

          {/* Volunteer Card */}
          <div className="col-md-5 mx-3 my-3">
            <div className="card hero-card shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-warning">Be a Volunteer</h3>
                <p className="card-text text-muted">
                  Help us collect, package, and deliver food to those in need.
                  Your small effort can have a huge impact.
                </p>
                 <Link
                  to="/volunteer/nearby"
                  className="start-link text-decoration-none fw-bold"
                >
                  Start as a Volunteer →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
       
    <div className="section-divider"></div>

    </section>
    
  );
};

export default Hero;
