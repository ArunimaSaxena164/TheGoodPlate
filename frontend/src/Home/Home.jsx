import React from 'react';
import Feature from './Feature';
import Hero from './Hero';
import Impact from './Impact';
import Footer from '../boilerplate/Footer'
function Home() {
    return ( 
       <div>
        <Hero/>
        <Feature/>
        <Impact/>
        <Footer/>
       </div>
     );
}

export default Home;
