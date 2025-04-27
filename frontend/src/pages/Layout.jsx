import React, {useEffect, useState} from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './style.css';
import axios from "axios";

export default function Layout() {
    const [username, setUsername] = useState("")
    const [isLoggedIn, setLoggedIn] = useState(false)

    const location = useLocation();

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (accessToken && refreshToken) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                };
                await axios.post("http://127.0.0.1:8000/api/logout/", { "refresh": refreshToken }, config);
            }

            // Remove tokens and update state
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setLoggedIn(false);
            setUsername("");
            window.location.href = "/login"; // przeladowanie strony
            console.log("Wylogowanie powiodło się!");

            // Navigate to login page after logout
            window.location.href = "/login"; // Quick reload
        } catch (error) {
            console.error("Failed to logout", error.response?.data || error.message);
        }
    };

    useEffect (()=>{
        const checkLoggedInUser = async () => {
            try{
                const token = localStorage.getItem("accessToken")
                if(token) {
                    //jesli jest token robimy get request
                    const config = {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    };
                    const response = await axios.get("http://127.0.0.1:8000/api/user/", config)
                    setLoggedIn(true)
                    setUsername(response.data.username)
                }
                else{
                    setLoggedIn(false);
                    setUsername("");
                }
            }
            catch(error){
                setLoggedIn(false);
                setUsername("");
            }
        };
        checkLoggedInUser()
    }, [])

    return (
        <>
                <nav className={isLoggedIn ? "" : "hide-navbar"}>
                    <ul>
                        <li><Link to="/">Strona główna</Link></li>
                        <li><Link to="#" onClick={handleLogout}>Wyloguj się</Link></li>
                        <li><Link to="/myrides">Moje przejazdy</Link></li>
                    </ul>
                </nav>
            <Outlet />
        </>
    );
}
