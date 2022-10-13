import React from 'react';
import MainNavbar from '../MainPage/components/MainNavbar/MainNavbar';
import { AudioVisualiser } from '../MainPage/MainPageViews/MainPagePlayer/AudioVisualiser';
import MPSidebar from './components/MPSidebar/MPSidebar';

const MusicPlayerPage = () => {
    return (
        <section>
            <div className='grid'>
                <div className='grid-navbar'>
                    <MainNavbar />
                </div>
                <div className='grid-sidebar'>
                    <MPSidebar />
                </div>
                <div className='grid-content'>
                    {/* <MainContent /> */ }
                    {/* <MusicPlayer /> */ }
                    {/* <SeekSlider /> */ }
                    {/* <VolumeSlider /> */ }
                    {/* <AudioVisualiser /> */ }
                </div>
            </div>
        </section >);
}

export default MusicPlayerPage;