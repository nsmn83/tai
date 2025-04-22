import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"
import Rides from './Rides';


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

    return (
        <div>
            {isLoggedIn ? (
                <>
                <h2> Witaj użytkowniku {username}!</h2>
                    <Rides />
                </>
            ):(
                <>
                    <h1 className="title">
                        DriveBud
                    </h1>
                </>
            )}
        </div>
    )
}