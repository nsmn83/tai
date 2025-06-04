import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

function MyRides() {
  const navigate = useNavigate();

  const [allRides, setAllRides] = useState([]);
  const [przejazd, setPrzejazd] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [searchVal2, setSearchVal2] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchTime, setSearchTime] = useState('');
  const [searchEndTime, setSearchEndTime] = useState(''); // New state for end_time
  const [searchPas, setSearchPas] = useState('');
  const [searchMaxPas, setSearchMaxPas] = useState(''); // New state for max_passengers
  const [searchDesc, setDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigate to ride detail
  const handleClick = (ride) => {
    navigate(`/przejazd/${ride.id}`, { state: { przejazd: ride } });
  };

  // Fetch rides from backend
  const fetchRides = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    axiosInstance.get('rides/my')
      .then((res) => {
        setAllRides(res.data);
        setPrzejazd(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Nie udało się załadować przejazdów.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRides();
  }, [navigate]);

  const clearForm = () => {
    setSearchVal('');
    setSearchVal2('');
    setSearchDate('');
    setSearchTime('');
    setSearchEndTime('');
    setSearchPas('');
    setSearchMaxPas('');
    setDesc('');
  };

  const handleAddRide = () => {
    // Validate inputs
    if (!searchVal || !searchVal2 || !searchDate || !searchTime || !searchEndTime || !searchPas || !searchMaxPas) {
      alert('Wszystkie pola są wymagane!');
      return;
    }

    const passengerCount = parseInt(searchPas, 10);
    const maxPassengers = parseInt(searchMaxPas, 10);
    if (isNaN(passengerCount) || passengerCount < 0) {
      alert('Liczba pasażerów musi być liczbą dodatnią!');
      return;
    }
    if (isNaN(maxPassengers) || maxPassengers <= 0) {
      alert('Maksymalna liczba pasażerów musi być liczbą dodatnią!');
      return;
    }
    if (passengerCount > maxPassengers) {
      alert('Liczba pasażerów nie może przekraczać maksymalnej liczby pasażerów!');
      return;
    }

    // Ensure start_time and end_time are in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
    const startTime = `${searchDate}T${searchTime}:00`;
    const endTime = `${searchDate}T${searchEndTime}:00`;
    if (!startTime.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
      alert('Nieprawidłowy format daty lub godziny rozpoczęcia!');
      return;
    }
    if (!endTime.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
      alert('Nieprawidłowy format daty lub godziny zakończenia!');
      return;
    }

    const rideData = {
      start_address: searchVal,
      end_address: searchVal2,
      start_time: startTime,
      end_time: endTime, // Added end_time
      passenger_count: passengerCount,
      max_passengers: maxPassengers, // Added max_passengers
      description: searchDesc || '', // Ensure description is not null
    };

    console.log('Sending rideData:', rideData); // Log payload for debugging

    axiosInstance
      .post('rides/create/', rideData)
      .then(() => {
        alert('Przejazd został dodany!');
        clearForm();
        fetchRides();
      })
      .catch((err) => {
        console.error('Błąd podczas dodawania przejazdu:', err.response?.data);
        if (err.response?.data) {
          const errors = err.response.data;
          if (errors.start_address) {
            alert('Błąd: ' + errors.start_address.join(', '));
          } else if (errors.end_address) {
            alert('Błąd: ' + errors.end_address.join(', '));
          } else if (errors.start_time) {
            alert('Błąd: ' + errors.start_time.join(', '));
          } else if (errors.end_time) {
            alert('Błąd: ' + errors.end_time.join(', '));
          } else if (errors.passenger_count) {
            alert('Błąd: ' + errors.passenger_count.join(', '));
          } else if (errors.max_passengers) {
            alert('Błąd: ' + errors.max_passengers.join(', '));
          } else {
            alert('Błąd podczas dodawania przejazdu: ' + JSON.stringify(errors));
          }
        } else {
          alert('Błąd podczas dodawania przejazdu: ' + err.message);
        }
      });
  };

  return (
    <div className="content-container">
      <h2 className="title">MOJE PRZEJAZDY</h2>

      <div className="searchbox">
        <input
          placeholder="Miejsce wyjazdu"
          className="search-input"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <input
          placeholder="Miejsce docelowe"
          className="search-input"
          value={searchVal2}
          onChange={(e) => setSearchVal2(e.target.value)}
        />
        <input
          className="search-input"
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <input
          className="search-input"
          type="time"
          value={searchTime}
          onChange={(e) => setSearchTime(e.target.value)}
        />
        <input
          className="search-input"
          type="time"
          placeholder="Godzina zakończenia"
          value={searchEndTime}
          onChange={(e) => setSearchEndTime(e.target.value)}
        />
        <input
          className="search-input"
          placeholder="Liczba pasażerów"
          type="number"
          value={searchPas}
          onChange={(e) => setSearchPas(e.target.value)}
        />
        <input
          className="search-input"
          placeholder="Maksymalna liczba pasażerów"
          type="number"
          value={searchMaxPas}
          onChange={(e) => setSearchMaxPas(e.target.value)}
        />
        <textarea
          className="description-input"
          placeholder="Opis przejazdu (max 200 znaków)"
          value={searchDesc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className="filter-button" onClick={handleAddRide}>
          Dodaj przejazd
        </button>
      </div>

      {loading && <p>Ładowanie...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {przejazd.map((ride) => (
          <li key={ride.id} className="list-element" onClick={() => handleClick(ride)}>
            <p>
              <strong className='list-element-subelement'>Trasa: {ride.start_address} - {ride.end_address}</strong>
              <strong className='list-element-subelement'> Data: {ride.start_time.slice(0, 10)}</strong>
              <strong className='list-element-subelement'> Godzina wyjazdu: {ride.start_time.slice(11, 16)}</strong>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyRides;