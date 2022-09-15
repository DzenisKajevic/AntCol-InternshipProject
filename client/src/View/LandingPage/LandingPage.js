import React from 'react';
import '../../App.css';
import Navbar from '../../components/Navbar/Navbar';
import Headline from '../../components/Headline/Headline';
import Info from '../../components/Info/Info';
import Footer from '../../components/Footer/Footer';

const LandingPage = () => {
    return (
        <main className='components-wrapper-lp'>
            <Navbar />
            <Headline />
            <Info />
            <Footer />
        </main>
    );
}

export default LandingPage;