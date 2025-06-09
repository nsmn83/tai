import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/auth';

 const isLoggedIn = !!localStorage.getItem("accessToken");

const handleLogout = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      await axiosInstance.post("logout/", { refresh: refreshToken });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      console.log("Wylogowanie powiodło się!");
      navigate('/login');
    } else {
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

          {isLoggedIn ? (
            <>
              <li><Link to="#" onClick={handleLogout}>Wyloguj się</Link></li>
              <li><Link to="/myrides">Profil kierowcy</Link></li>
              <li><Link to="/myrequests">Profil pasażera</Link></li>
            </>
          ) : (
            <li><Link to="/login">Zaloguj się</Link></li>
          )}
        </ul>
        <h2 className="navigation-title">DRIVEBUD</h2>
      </nav>
      <Outlet />
    </>
  );
}
