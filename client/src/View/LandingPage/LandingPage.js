import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Headline from '../../components/Headline/Headline';
import Info from '../../components/Info/Info';
import Footer from '../../components/Footer/Footer';

const MainPage = () => {
    return (
        <>
            <Navbar />
            <Headline />
            <Info />
            <Footer />
        </>
    );
}

export default MainPage;