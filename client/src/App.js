import './App.css';
import LandingPage from './View/LandingPage/LandingPage';
import RegistrationPage from './View/RegistrationPage/RegistrationPage';
import LoginPage from './View/LoginPage/LoginPage';
import MainPage from './View/MainPage/MainPage';
import { Route, Routes } from 'react-router-dom';

function App ()
{
  return (
    <Routes>
      <Route path="/" element={ <LandingPage /> } />
      <Route path="/log-in" element={ <LoginPage /> } />
      <Route path="/registration" element={ <RegistrationPage /> } />
    </Routes>
  );
}

export default App;
