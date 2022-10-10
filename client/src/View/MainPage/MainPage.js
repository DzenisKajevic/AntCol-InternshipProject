import React from 'react';
import { useState } from 'react';
import MainNavbar from './components/MainNavbar/MainNavbar';
import SideBar from './components/SideBar/SideBar';
import MainContent from './components/MainContent/MainContent';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import { AudioVisualiser } from './MainPageViews/MainPagePlayer/AudioVisualiser';
import SeekSlider from './MainPageViews/MainPagePlayer/Components/SeekSlider';
import VolumeSlider from './MainPageViews/MainPagePlayer/Components/VolumeSlider';
import MainPageHome from './MainPageViews/MainPageHome/MainPageHome';
import UploadImgPopup from './components/MainNavbar/components/UploadImgPopup';


const MainPage = () =>
{
    if ( window.location.pathname === '/main-page' || window.location.pathname === '/main-page/' ) window.location.replace( '/main-page/home' );

    const [ visibility, setVisibility ] = useState( false );

    const popupCloseHandler = () =>
    {
        setVisibility( false );
    };

    return (
        <section>
            <div className='grid'>
                <div className='grid-navbar'>
                    <MainNavbar />
                    <UploadImgPopup
                        onClick={ popupCloseHandler }
                        show={ visibility }
                        title="Upload an image"
                    >
                    </UploadImgPopup>
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
        </section >
    );
}

export default MainPage;