import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.svg';
import { routes } from './constants/routes';
import { AppRoute } from './constants/routes';
import Navbar from './components/Navbar';
// import './App.css';

function App() {

  return (
    <div className=''>
      <Navbar />
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
