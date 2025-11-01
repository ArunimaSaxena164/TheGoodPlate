// import React from 'react';
// function Hero() {
//     return (  
//         <h1>hero</h1>
//     );
// }

// export default Hero;
import React from "react";
import { Container, Button } from "react-bootstrap";
import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero-section d-flex align-items-center justify-content-center text-center text-white">
      <Container>
        <h1 className="display-4 fw-bold">Welcome to TheGoodPlate</h1>
        <p className="lead mt-3">
          Connecting donors and volunteers to reduce food waste and feed the hungry.
        </p>
        <div className="mt-4">
          <Button variant="success" size="lg" href="/donor-dashboard" className="mx-2">
            Start as Donor
          </Button>
          <Button variant="outline-light" size="lg" href="/volunteer-dashboard" className="mx-2">
            Start as Volunteer
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
