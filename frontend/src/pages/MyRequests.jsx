import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function MyRequests() {
    const navigate = useNavigate();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

      // Navigate to ride detail
    const handleClick = (ride) => {
        navigate(`/przejazd/${ride.id}`, { state: { przejazd: ride } });
    };


    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            navigate('/login');
            return;
        }

        axios.get('http://127.0.0.1:8000/api/rides/requested/', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => {
            setRides(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Błąd podczas ładowania przejazdów:', error);
            setError('Nie udało się załadować przejazdów.');
            setLoading(false);
        });
    }, [navigate]);

    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="content-container">
            <div className="titlebox">
                <h2>STATUS WYSŁANYCH PRÓŚB</h2>
            </div>
            <ul>
                {rides.map(ride => (
<li
  key={ride.id}
  className={`list-element request-status-${ride.request_status}`}
  onClick={() => handleClick(ride)}
>

                        <p><strong className='list-element-subelement'>Trasa: {ride.start_address} - {ride.end_address}</strong></p>
                        <p><strong className='list-element-subelement'>Data: {ride.start_time?.slice(0, 10)}</strong></p>
                        <p><strong className='list-element-subelement'>Godzina wyjazdu: {ride.start_time?.slice(11, 16)}</strong></p>
                        <p><strong className='list-element-subelement'>Status prośby: {ride.request_status}</strong></p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
