import { useLocation, useParams } from "react-router-dom";
import React from 'react'


export default function MyRequests() {
    const { state } = useLocation(); 
    const { przejazd } = state || {}; 

    const przejazdy = [
        {
            id: 1,
            start: "Warszawa",
            koniec: "Kraków",
            kierowca: "Jan Kowalski",
            data: "2025-04-22",
            godzina: "08:30",
            status: "accepted",
        },
        {
            id: 2,
            start: "Gdańsk",
            koniec: "Poznań",
            kierowca: "Anna Nowak",
            data: "2025-04-23",
            godzina: "14:15",
            status: "accepted",
        },
        {
            id: 3,
            start: "Wrocław",
            koniec: "Łódź",
            kierowca: "Piotr Zieliński",
            data: "2025-04-24",
            godzina: "10:00",
            status: "rejected",
        },
        {
            id: 4,
            start: "Warszawa",
            koniec: "Wrocław",
            kierowca: "Jan Kowalski",
            data: "2025-04-22",
            godzina: "08:30",
            status: "waiting",
        },
        {
            id: 5,
            start: "Gdańsk",
            koniec: "Warszawa",
            kierowca: "Anna Nowak",
            data: "2025-04-23",
            godzina: "14:15",
            status: "waiting",
        },
        {
            id: 6,
            start: "Wrocław",
            koniec: "Warszawa",
            kierowca: "Piotr Zieliński",
            data: "2025-04-24",
            godzina: "10:00",
            status: "waiting"
        }
    ];


    //obsluga wcisniecia guzika
    const handleClick = (przejazd) => {

    }

    return (
        <div className="content-container">
            <div className="titlebox">
                <h2>STATUS WYSŁANYCH PRÓŚB</h2>
            </div>
            <ul>
                {przejazdy.map(przejazd => (
                    <li key={przejazd.id} className={`list-element status-${przejazd.status}`} onClick={() => handleClick(przejazd)}>
                        <p><strong className='list-element-subelement'>Trasa: {przejazd.start} - {przejazd.koniec}</strong></p>
                        <p><strong className='list-element-subelement'> Data: {przejazd.data}</strong></p>
                        <p><strong className='list-element-subelement'> Godzina wyjazdu: {przejazd.godzina}</strong></p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
