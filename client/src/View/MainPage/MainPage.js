import React from 'react';
import MainNavbar from './components/MainNavbar/MainNavbar';
import SideBar from './components/SideBar/SideBar';
import MainContent from './components/MainContent/MainContent';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import { AudioVisualiser } from './MainPageViews/MainPagePlayer/AudioVisualiser';
import SeekSlider from './MainPageViews/MainPagePlayer/Components/SeekSlider';
import VolumeSlider from './MainPageViews/MainPagePlayer/Components/VolumeSlider';
import MainPageHome from './MainPageViews/MainPageHome/MainPageHome';


const MainPage = () => {
    if (window.location.pathname === '/main-page' || window.location.pathname === '/main-page/') window.location.replace('/main-page/home');

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
                    {/* <MusicPlayer /> */ }
                    {/* <SeekSlider /> */ }
                    {/* <VolumeSlider /> */ }
                    <AudioVisualiser />
                </div>
            </div>
        </section>
    );
}

export default MainPage;