import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';

function MyRides() {


    const navigate = useNavigate();

    const handleClick = (przejazd) => {
        navigate(`/przejazd/${przejazd.id}`, { state: { przejazd } });
    }

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
        },
        {
            id: 4,
            start: "Warszawa",
            koniec: "Wrocław",
            kierowca: "Jan Kowalski",
            data: "2025-04-22",
            godzina: "08:30"
        },
        {
            id: 5,
            start: "Gdańsk",
            koniec: "Warszawa",
            kierowca: "Anna Nowak",
            data: "2025-04-23",
            godzina: "14:15"
        },
        {
            id: 6,
            start: "Wrocław",
            koniec: "Warszawa",
            kierowca: "Piotr Zieliński",
            data: "2025-04-24",
            godzina: "10:00"
        },
        {
            id: 7,
            start: "Warszawa",
            koniec: "Gdynia",
            kierowca: "Jan Kowalski",
            data: "2025-04-22",
            godzina: "08:30"
        },
        {
            id: 8,
            start: "Gdańsk",
            koniec: "Wrocław",
            kierowca: "Anna Nowak",
            data: "2025-04-23",
            godzina: "14:15"
        },
        {
            id: 9,
            start: "Wrocław",
            koniec: "Łódź",
            kierowca: "Piotr Zieliński",
            data: "2025-04-24",
            godzina: "10:00"
        },
        {
            id: 10,
            start: "Warszawa",
            koniec: "Pisczyn",
            kierowca: "Jan Kowalski",
            data: "2025-04-22",
            godzina: "08:30"
        },
        {
            id: 11,
            start: "Gdańsk",
            koniec: "Poznań",
            kierowca: "Anna Nowak",
            data: "2025-04-23",
            godzina: "14:15"
        },
        {
            id: 12,
            start: "Wrocław",
            koniec: "Markuszów",
            kierowca: "Piotr Zieliński",
            data: "2025-04-24",
            godzina: "10:00"
        }
    ];

    const [przejazd, setPrzejazd] = useState(przejazdy);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    function handleAddClick() {
    }
    
    return (
        <div className="content-container">
                <div className="searchbox">
                    <input
                        placeholder='Miejsce wyjazdu'
                        value={start}
                        onChange={e => setStart(e.target.value)}
                    />
                    <input
                        placeholder='Miejsce docelowe'
                        value={end}
                        onChange={e => setEnd(e.target.value)}
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                    <input
                        type="time"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                    />
                    <textarea
                        placeholder='Dodaj opis przejazdu'
                    />
                    <button className="filter-button" onClick={handleAddClick}>Dodaj przejazd</button>
                </div>

            <ul>
                {przejazd.map(przejazd => (
                    <li key={przejazd.id} className="list-element" onClick={() => handleClick(przejazd)}>
                        <p><strong className='list-element-subelement'>Trasa: {przejazd.start} - {przejazd.koniec}</strong></p>
                        <p><strong className='list-element-subelement'> Data: {przejazd.data}</strong></p>
                        <p><strong className='list-element-subelement'> Godzina wyjazdu: {przejazd.godzina}</strong></p>
                    </li>
                ))}
            </ul>
        </div>
    );


}

export default MyRides;