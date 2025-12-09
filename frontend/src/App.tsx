import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
// import './App.css';

function App() {
  const [apiMessage, setApiMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

    axios.get(`${apiUrl}/test`)
      .then(response => {
        setApiMessage(response.data.message);
      })
      .catch(err => {
        setError('Failed to connect to Laravel API');
        console.error(err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center">
      <header className="bg-red-500 p-8 rounded-lg shadow-lg border-2 border-amber-400 w-1/2 h-1/2">
        <h1>React + Laravel</h1>
        {apiMessage && <p>API Response: {apiMessage}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
    </div>
  );
}

export default App;
