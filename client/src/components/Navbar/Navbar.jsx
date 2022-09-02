import React from 'react';
import './navbar.css';
import '../../variables.css';

const Navbar = () => {
    return (
        <header className='navbar-header'>
            <nav className='navbar'>
                <img className='music-app-logo' src="./assets/app-images/music-app-logo.png" alt="application logo" />
                <button className='login-button shine'>Log in</button>
                <button className='signup-button shine'>Sign up</button>
            </nav>
        </header>
    );
}

export default Navbar;