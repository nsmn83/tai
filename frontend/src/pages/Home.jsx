import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"
import Rides from './Rides';


export default function Home() {

    const accessToken = localStorage.getItem("accessToken");


    return (
        <div>
            {!accessToken ? (
                <div>
                <h1 className='title'>DRIVEBUD</h1>
                </div>
            ) : (
                 <Rides />
            )}
        </div>
    )
}