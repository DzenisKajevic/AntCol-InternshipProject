import './App.css';
import LandingPage from './View/LandingPage/LandingPage';
import RegistrationPage from './View/RegistrationPage/RegistrationPage';
import LoginPage from './View/LoginPage/LoginPage';
import MainPage from './View/MainPage/MainPage';
import MusicPlayerPage from './View/MusicPlayerPage/MusicPlayerPage';
import { Route, Routes } from 'react-router-dom';
import MainPageHome from './View/MainPage/MainPageViews/MainPageHome/MainPageHome';
import MainPageSearch from "./View/MainPage/MainPageViews/MainPageSearch/MainPageSearch";
import MainPageCreatePlaylist from "./View/MainPage/MainPageViews/MainPageCreatePlaylist/MainPageCreatePlaylist";
import MainPageFavorites from "./View/MainPage/MainPageViews/MainPageFavorites/MainPageFavorites";
import { AudioVisualiser } from './View/MainPage/MainPageViews/MainPagePlayer/AudioVisualiser';
import PageNotFound from './View/MainPage/components/PageNotFound/PageNotFound';
import { PrivateRoute } from './View/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={ <LandingPage /> } />
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="/registration" element={ <RegistrationPage /> } />
      <Route path="/main-page" element={
        <PrivateRoute>
          <MainPage />
        </PrivateRoute> }>
        <Route path="/main-page/home" exact element={
          <PrivateRoute>
            <MainPageHome />
          </PrivateRoute> } />
        <Route path="/main-page/search" element={
          <PrivateRoute>
            <MainPageSearch />
          </PrivateRoute> } />
        <Route path="/main-page/music-player" element={
          <PrivateRoute>
            {/* <MusicPlayerPage /> */ }
          </PrivateRoute>
        } />
        <Route
          path="/main-page/create-playlist"
          element={
            <PrivateRoute>
              <MainPageCreatePlaylist />
            </PrivateRoute> }
        />
        {/*<Route path='/main-page/audio-player' element={ <AudioVisualiser /> } />*/ }

        < Route path="/main-page/favorites" element={
          <PrivateRoute>
            <MainPageFavorites />
          </PrivateRoute> } />
      </Route>
      <Route path="*" element={ <PageNotFound /> } />
    </Routes >
  );
}

export default App;
