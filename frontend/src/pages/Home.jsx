import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"

export default function Home() {
    const [username, setUsername] = useState("")
    const [isLoggedIn, setLoggedIn] = useState(false)
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
    return (
        <div>
            {isLoggedIn ? (
                <>
                <h2> Witaj użytkowniku {username}!</h2>
                <button onClick={handleLogout}>Logout</button>
                </>
            ):(<h2>Zaloguj się!</h2>)}
        </div>
    )
}