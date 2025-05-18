import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

import { OpenStreetMapProvider } from 'leaflet-geosearch';
// setup
const provider = new OpenStreetMapProvider();
// search


function Rides() {
  const navigate = useNavigate();

  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchVal, setSearchVal] = useState('');
  const [searchVal2, setSearchVal2] = useState('');
  const [searchDate, setSearchDate] = useState('');

   const statusLabels = {
  planned: 'Planned',
  in_progress: 'In Progress',
  done: 'Done',
  deleted: 'Deleted',
};

  // Fetch all rides
const fetchRides = () => {
  const token = localStorage.getItem('accessToken');
  setLoading(true);
  setError(null);

  axios
    .get('http://127.0.0.1:8000/api/rides/all/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setRides(res.data);
      setFilteredRides(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Nie udało się załadować przejazdów.');
      setLoading(false);
    });
};


  useEffect(() => {
    fetchRides();
  }, [navigate]);

  const handleClick = (ride) => {
    navigate(`/przejazd/${ride.id}`, { state: { przejazd: ride } });
  };

  // Filter rides based on search inputs

  const handleSearchClick = ( /*async*/ () => {

    if (searchVal === '' && searchVal2 === '' && searchDate === '') {

      setFilteredRides(rides);

      return;
    }

     /*let  StartResult = ( await provider.search({ query: searchVal }));
     let  EndResult = ( await provider.search({ query: searchVal2 }));

     window.alert(StartResult.y + "   " + StartResult.x);*/
    const filtered =  rides.filter( (ride)  => {
        const limit = 0.2;

        /*window.alert(ride.start_lat + "   " +StartResult.y);
        const matchesStartCord = Math.sqrt((ride.start_lat - StartResult.y)**2 + (ride.start_lat - StartResult.x)**2) <limit;
        const matchesEndCord = Math.sqrt((ride.end_lat - EndResult.y)**2 + (ride.end_lat - EndResult.x)**2) <limit;
        */
      const matchesStart = ride.start_address?.toLowerCase().includes(searchVal.toLowerCase());
      const matchesEnd = ride.end_address?.toLowerCase().includes(searchVal2.toLowerCase());
      const matchesDate = searchDate === '' || ride.start_time?.slice(0, 10) === searchDate;

      return matchesStart && matchesEnd && matchesDate /*&& matchesStartCord && matchesEndCord*/;
    });

    setFilteredRides(filtered);
  });

  return (
    <div className="content-container">
      <div className="searchbox">
        <input
          placeholder="Miejsce wyjazdu"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="search-input"
        />
        <input
          placeholder="Miejsce docelowe"
          value={searchVal2}
          onChange={(e) => setSearchVal2(e.target.value)}
          className="search-input"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="search-input"
        />
        <button className="filter-button" onClick={handleSearchClick}>Filtruj</button>
      </div>

      {loading && <p>Ładowanie...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {filteredRides.map((ride) => (
          <li
            key={ride.id}
            className="list-element"
            onClick={() => handleClick(ride)}
          >
            <p>
              <strong className="list-element-subelement">
                Trasa: {ride.start_address} - {ride.end_address}
              </strong>
            </p>
            <p>
              <strong className="list-element-subelement">
                Data: {ride.start_time?.slice(0, 10)}
              </strong>
            </p>
            <p>
              <strong className="list-element-subelement">
                Godzina wyjazdu: {ride.start_time?.slice(11, 16)}
              </strong>
            </p>
            <p>
              <strong className="list-element-subelement">
                Status: {statusLabels[ride.status]}
              </strong>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rides;
