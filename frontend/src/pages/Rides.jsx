import React from 'react'
import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';

function Rides() {

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
    const [searchVal, setSearchVal] = useState("");
    const [searchVal2, setSearchVal2] = useState("");
    const [searchDate, setSearchDate] = useState("");
    function handleSearchClick() {
        if (searchVal === "" && searchVal2 === "" && searchDate === "") {
            setPrzejazd(przejazdy);
            return;
        }

        const filterBySearch = przejazdy.filter((item) => {
            const matchesStart = item.start.toLowerCase().includes(searchVal.toLowerCase());
            const matchesEnd = item.koniec.toLowerCase().includes(searchVal2.toLowerCase());
            const matchesDate = searchDate === "" || item.data === searchDate;

            return matchesStart && matchesEnd && matchesDate;
        });

        setPrzejazd(filterBySearch);
    }
    
    return (
        <div className="content-container">
                <div className="searchbox">
                    <input
                        placeholder='Miejsce wyjazdu'
                        className=""
                        value={searchVal}
                        onChange={e => setSearchVal(e.target.value)}
                    />
                    <input
                        placeholder='Miejsce docelowe'
                        className=""
                        value={searchVal2}
                        onChange={e => setSearchVal2(e.target.value)}
                    />
                    <input
                        className=""
                        type="date"
                        value={searchDate}
                        onChange={e => setSearchDate(e.target.value)}
                    />
                    <button className="filter-button" onClick={handleSearchClick}>Filtruj</button>
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

export default Rides;