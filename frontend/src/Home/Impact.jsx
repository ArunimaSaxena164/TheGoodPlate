import React from "react";
import "./Impact.css";

const Impact = () => {
  return (
    <section className="impact-section text-center">
      <div className="container">
        <h2 className="impact-heading">Our Impact</h2>
     <p className="impact-description">
  At <span className="highlight-text">The Good Plate</span>, we bridge the gap between abundance and need — 
  connecting those who can share with those who truly need it. 
  Every shared meal carries warmth, dignity, and hope. 
  Together, we’re creating a community where no food goes to waste, 
  and every act of kindness makes the world a little better.
</p>


        <div className="row justify-content-center mt-5">
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="impact-box">
              <i className="bi bi-people-fill impact-icon"></i>
              <h3>Meals Donated</h3>
              <p>Data coming soon....</p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="impact-box">
              <i className="bi bi-geo-alt-fill impact-icon"></i>
              <h3>Communities Served</h3>
              <p> Data coming soon....</p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="impact-box">
              <i className="bi bi-person-heart impact-icon"></i>
              <h3>Active Volunteers</h3>
              <p>Data coming soon....</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
