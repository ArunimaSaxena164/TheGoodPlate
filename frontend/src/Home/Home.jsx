import React from 'react';
import Feature from './Feature';
import Hero from './Hero';
import Impact from './Impact';
import './Home.css';

//import Footer from '../boilerplate/Footer.jsx'
function Home() {
    return ( 
       <div>
        <Hero/>
       <div className="section-divider"></div>
        <Feature/>
       <div className="section-divider"></div>
        <Impact/>
        {/* <Footer/> */}
       </div>
     );
}

export default Home;
