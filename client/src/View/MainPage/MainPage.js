import React from 'react';
import MainNavbar from './components/MainNavbar/MainNavbar';
import SideBar from './components/SideBar/SideBar';
import MainContent from './components/MainContent/MainContent';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';

const MainPage = () =>
{
    return (
        <section>
            <div className='grid'>
                <div className='grid-navbar'>
                    <MainNavbar />
                </div>
                <div className='grid-sidebar'>
                    <SideBar />
                </div>
                <div className='grid-content'>
                    <MainContent />
                    <MusicPlayer />
                </div>
            </div>
        </section>
    );
}

export default MainPage;