import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';

function Rides() {

    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/przejazd/${id}`);
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

    const [przejazd, setPrzejazd] = useState(przejazdy);
    const [searchVal, setSearchVal] = useState("");
    function handleSearchClick() {
        if(searchVal === "") {setPrzejazd(przejazdy); return;}
        const filterBySearch = przejazdy.filter((item) => {
            if (item.start.toLoweCase().includes(searchVal.toLowerCase())) {return item;}
        })
        setPrzejazd(filterBySearch);
    }
    
    return (
        <div className="rides-container">

            <h2 className='title'> PRZEJAZDY </h2>
            <div>
                <p>FILTROWANIE</p>
                <div>
                <input onChange={e => setSearchVal(e.target.value)}>
                </input>
            </div>
            </div>
            <ul>
                {przejazdy.map(przejazd => (
                    <li key={przejazd.id} className="ride-item" onClick={() => handleClick(przejazd)}>
                        <p><strong>Trasa: </strong> {przejazd.start} - {przejazd.koniec}
                        <strong> Data: </strong> {przejazd.data}
                        <strong> Godzina wyjazdu: </strong> {przejazd.godzina}</p>
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default Rides;