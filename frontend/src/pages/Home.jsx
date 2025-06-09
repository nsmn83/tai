import React from 'react';
import { jwtDecode } from 'jwt-decode';
import Rides from './Rides';

export default function Home() {
  const isLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return false;
    }

    try {
      const decoded = jwtDecode(accessToken);
      const now = Math.floor(Date.now() / 1000);
      const isTokenValid = decoded.exp > now; 
      return isTokenValid;
    } catch (error) {
      console.error('Błąd podczas dekodowania tokena:', error);
      return false;
    }
  };

  return (
    <div>
      {isLoggedIn() ? <Rides /> : <h1>DRIVEBUD</h1>}
    </div>
  );
}