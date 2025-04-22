import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './style.css';
import axios from "axios";

const handleLogout = async () => {
    try{
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        console.log("access:", localStorage.getItem("accessToken"));
        console.log("refresh:", localStorage.getItem("refreshToken"));


        if(accessToken && refreshToken) {
            const config = {
                headers: {
                    "Authorization":`Bearer ${accessToken}`
                }
            };
            await axios.post("http://127.0.0.1:8000/api/logout/", {"refresh":refreshToken}, config)
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setLoggedIn(false);
            setUsername("");
            console.log("Wylogowanie powiodło się!")
        }
    }
    catch(error){
        console.error("Failed to logout", error.response?.data || error.message)
    }
}

export default function Layout() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/auth';

    return (
        <>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="#" onClick={handleLogout}>Logout</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                </nav>
            <Outlet />
        </>
    );
}
