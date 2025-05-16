import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/auth';

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      console.log("access:", accessToken);
      console.log("refresh:", refreshToken);

      if (accessToken && refreshToken) {
        const config = {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        };
        await axios.post("http://127.0.0.1:8000/api/logout/", { "refresh": refreshToken }, config);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");


        console.log("Wylogowanie powiodło się!");
        navigate('/login');  
      }
    } catch (error) {
      console.error("Failed to logout", error.response?.data || error.message);
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Strona główna</Link></li>
          <li><Link to="#" onClick={handleLogout}>Wyloguj się</Link></li>
          <li><Link to="/myrides">Profil kierowcy</Link></li>
          <li><Link to="/myrequests">Profil pasażera</Link></li>
        </ul>
        <h2 className="navigation-title">DRIVEBUD</h2>
      </nav>
      <Outlet />
    </>
  );
}
