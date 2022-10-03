import './App.css';
import LandingPage from './View/LandingPage/LandingPage';
import RegistrationPage from './View/RegistrationPage/RegistrationPage';
import LoginPage from './View/LoginPage/LoginPage';
import MainPage from './View/MainPage/MainPage';
import { Route, Routes } from 'react-router-dom';
import MainPageHome from './View/MainPage/MainPageViews/MainPageHome/MainPageHome';
import MainPageSearch from "./View/MainPage/MainPageViews/MainPageSearch/MainPageSearch";
import MainPageCreatePlaylist from "./View/MainPage/MainPageViews/MainPageCreatePlaylist/MainPageCreatePlaylist";
import MainPageFavorites from "./View/MainPage/MainPageViews/MainPageFavorites/MainPageFavorites";
import { AudioVisualiser } from './View/MainPage/MainPageViews/MainPagePlayer/AudioVisualiser';

function App ()
{
  return (
    <Routes>
      <Route path="/" element={ <LandingPage /> } />
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="/registration" element={ <RegistrationPage /> } />
      <Route path="/main-page" element={ <MainPage /> }>
        <Route path="/main-page/home" element={ <MainPageHome /> } />
        <Route path="/main-page/search" element={ <MainPageSearch /> } />
        <Route
          path="/main-page/create-playlist"
          element={ <MainPageCreatePlaylist /> }
        />
        <Route path='/main-page/audio-player' element={ <AudioVisualiser /> } />
        <Route path="/main-page/favorites" element={ <MainPageFavorites /> } />
      </Route>
    </Routes >
  );
}

export default App;
