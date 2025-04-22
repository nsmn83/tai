import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"

function Rides() {
    const przejazdy = [
        {
            id: 1,
            start: "Warszawa",
            koniec: "Kraków",
            kierowca: "Jan Kowalski",
            data: "2025-04-22",
            godzina: "08:30"
        },
        {
            id: 2,
            start: "Gdańsk",
            koniec: "Poznań",
            kierowca: "Anna Nowak",
            data: "2025-04-23",
            godzina: "14:15"
        },
        {
            id: 3,
            start: "Wrocław",
            koniec: "Łódź",
            kierowca: "Piotr Zieliński",
            data: "2025-04-24",
            godzina: "10:00"
        }
    ];
    return (
        <div className="rides-container">
            <h2 className="text-xl font-bold mb-4">Lista przejazdów</h2>
            <ul>
                {przejazdy.map(przejazd => (
                    <li key={przejazd.id} className="ride-item">
                        <p><strong>Trasa: </strong> {przejazd.start} - {przejazd.koniec}
                        <strong> Data: </strong> {przejazd.data}
                        <strong> Godzina: </strong> {przejazd.godzina}</p>
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default Rides;