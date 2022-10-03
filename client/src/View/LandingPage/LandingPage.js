import React from 'react';
import '../../App.css';
import Navbar from './components/Navbar/Navbar';
import Headline from './components/Headline/Headline';
import Info from './components/Info/Info';
import Footer from './components/Footer/Footer';

const LandingPage = () => {
    if (window.localStorage.token && window.localStorage.user) {
        // already logged in so redirect to main-page
        window.location.replace('/main-page');
    }

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