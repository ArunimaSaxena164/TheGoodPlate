import React from 'react';
import Feature from './Feature';
import Hero from './Hero';
import Impact from './impact';
import './Home.css';

//import Footer from '../boilerplate/Footer.jsx'
function Home() {
    return ( 
       <div>
        <Hero/>
        <Feature/>
        <Impact/>
        {/* <Footer/> */}
       </div>
     );
}

export default Home;
