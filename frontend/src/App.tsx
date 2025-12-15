import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.svg';
import { routes } from './constants/routes';
import { AppRoute } from './constants/routes';
import Navbar from './components/Navbar';
// import './App.css';

function App() {
  const location = useLocation();
  const currentRoute = routes.find((route: AppRoute) => route.path === location.pathname);
  const showNavbar = currentRoute?.showNavbar !== false;

  return (
    // <div className='min-h-screen bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400  text-slate-800'>
    <div className='min-h-screen bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300  text-slate-800'>
      {showNavbar && <Navbar />}
      <Routes>
        {routes.map((route: AppRoute) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
