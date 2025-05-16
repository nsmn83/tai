import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyRides() {
  const navigate = useNavigate();

  const [allRides, setAllRides] = useState([]);
  const [przejazd, setPrzejazd] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [searchVal2, setSearchVal2] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchTime, setSearchTime] = useState('');
  const [searchPas, setSearchPas] = useState('');
  const [searchDesc, setDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add axios interceptor to handle 401 globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          alert('Twoja sesja wygasła. Zaloguj się ponownie.');
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor when component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

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
    axios
      .get('http://127.0.0.1:8000/api/rides/my/', {
        headers: { Authorization: `Bearer ${token}` },
      })
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
    setSearchPas('');
    setDesc('');
  };

  const handleAddRide = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Musisz być zalogowany, aby dodać przejazd.');
      navigate('/login');
      return;
    }

    if (!searchVal || !searchVal2 || !searchDate || !searchTime || !searchPas) {
      alert('Wypełnij wszystkie wymagane pola.');
      return;
    }

    const rideData = {
      start_address: searchVal,
      end_address: searchVal2,
      start_time: `${searchDate}T${searchTime}`,
      end_time: `${searchDate}T${searchTime}`,
      max_passengers: parseInt(searchPas),
      description: searchDesc,
    };

    axios
      .post('http://127.0.0.1:8000/api/rides/create/', rideData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        alert('Przejazd został dodany!');
        clearForm();
        fetchRides(); // Refresh list
      })
      .catch((err) => {
      console.error(err);
      if (err.response?.data) {
        if (err.response.data.start_address) {
          alert('Błąd: ' + err.response.data.start_address);
        } else if (err.response.data.end_address) {
          alert('Błąd: ' + err.response.data.end_address);
        } else {
          alert('Błąd podczas dodawania przejazdu.');
        }
      } else {
        alert('Błąd podczas dodawania przejazdu.');
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
          placeholder="Liczba pasażerów"
          type="number"
          value={searchPas}
          onChange={(e) => setSearchPas(e.target.value)}
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
