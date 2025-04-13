import React from 'react'
import { Outlet, Link} from 'react-router-dom'

export default function Home() {
    return (
        <>
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
            </ul>
        </nav>
        <Outlet/>
        </>
    )
}