import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Map from './Map';

export default function RideDetails() {
  const { id } = useParams();  // get ride ID from URL
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);


   const statusLabels = {
  planned: 'Planned',
  in_progress: 'In Progress',
  done: 'Done',
  deleted: 'Deleted',
};

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    axiosInstance.get('user/')
      .then(res => {
        setCurrentUser(res.data);
      })
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    axiosInstance.get(`rides/${id}/`)
      .then(res => {
        setRide(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Nie udało się załadować szczegółów przejazdu.');
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!ride) return <p>Brak danych o przejeździe..</p>;

  const acceptedCount = ride.requests.filter(req => req.status === 'accepted').length;
  const maxPassengers = ride.max_passengers;
  const isFull = acceptedCount >= maxPassengers;
  
const handleClick = async () => {
  const token = localStorage.getItem('accessToken');

  try {
    const res = await axiosInstance.post('rides/join/', {
      ride: ride.id
    });

    alert('Wysłano prośbę o dołączenie do przejazdu.');
    window.location.reload();
  } catch (err) {
    console.error(err);
    if (err.response?.data?.ride) {
      alert('Błąd: ' + err.response.data.ride.join(' '));
    } else if (err.response?.data?.detail) {
      alert('Błąd: ' + err.response.data.detail);
    } else {
      alert('Nie udało się wysłać prośby o dołączenie.');
    }
  }
};




const handleAccept = async (requestId) => {
  const token = localStorage.getItem('accessToken');
  try {
      await axiosInstance.post(`rides/accept/${requestId}/`, {});
    alert('Prośba została zaakceptowana.');
    window.location.reload();
  }
  catch (err) {
    console.error(err);
    alert('Nie udało się zaakceptować prośby.');
  }
}

const handleReject = async (requestId) => {
  const token = localStorage.getItem('accessToken');
  try {
    await axiosInstance.post(`rides/reject/${requestId}/`, {});
    alert('Prośba została odrzucona.');
    window.location.reload(); 
  }
  catch (err) {
    console.error(err);
    alert('Nie udało się odrzucić prośby.');
  }
}

const handleWithdraw = async (requestId,userId) => {
  const token = localStorage.getItem('accessToken');
  try {
    await axiosInstance.post(`rides/withdraw/${requestId}/?user_id=${userId}`, {});
    alert('Prośba została wycofana.');
    window.location.reload();
  }
  catch (err) {
    console.error(err);
    alert('Nie udało się wycofać prośby.');
  }
}

const handleDelete = async (rideId) => {
  const token = localStorage.getItem('accessToken');
  try {
    await axiosInstance.post(`rides/delete/${rideId}/`, {});
    alert('Przejazd został usunięty');
    window.location.reload();
  }
  catch (err) {
    console.error(err);
    alert('Nie udało się usunąć przejazdu.');
  }
}

const handleProgress = async (rideId) => {
  const token = localStorage.getItem('accessToken');
  try {
    await axiosInstance.post(`rides/progress/${rideId}/`, {});
    alert('Zmiana statusu przejazdu powiodła się.');
    window.location.reload();
  }
  catch (err) {
    console.error(err);
    alert('Nie udało się rozpocząć przejazdu.');
  }
}


  return (
    <div className="detail-container">
      <div>
        <div className="details">
          <h2 className="title">Szczegóły przejazdu</h2>
          <p className="details-description-element">{ride.description || 'Brak opisu'}</p>
          <p className="details-description-element">Trasa przejazdu: {ride.start_address} - {ride.end_address}</p>
          <p className="details-description-element">Kierowca: {ride.driver?.username || 'Nieznany'}</p>
          <p className="details-description-element">Status: {statusLabels[ride.status]}</p>
          <p className="details-description-element">Data: {ride.start_time?.slice(0, 10)}</p>
          <p className="details-description-element">Godz: {ride.start_time?.slice(11, 16)}</p>
          <p className="details-description-element">Liczba pasażerów: {acceptedCount} / {maxPassengers}</p>
          <div className="details-description-element">
            <p><strong>PASAŻEROWIE:</strong></p>
            {ride.requests && ride.requests.length > 0 ? (
            <ul>
              {(currentUser && currentUser.id === ride.driver.id
      ? ride.requests
      : ride.requests.filter(req => req.status === 'accepted')
    ).map((req) => (

              <li className='passenger-list-element' key={req.id}>
              <div>
                <p> {req.user.username} – {req.status} </p>
                              {currentUser && currentUser.id === ride.driver.id && req.status === 'waiting' && (
                <div>
                  <button className='decision-button' onClick={() => handleAccept(req.id)}>Akceptuj</button>
                  <button className='decision-button' onClick={() => handleReject(req.id)}>Odrzuć</button>
                </div>
              )}
              </div>
              </li>
              ))}
            </ul>
  ) : (
    <p>Brak pasażerów</p>
  )}

</div>
    <div>
        {currentUser && currentUser.id == ride.driver.id && ride.status == 'planned' && (

        <button className='decision-button' onClick={() => handleProgress(ride.id)}>Rozpocznij przejazd</button>
    )}

    {currentUser && currentUser.id == ride.driver.id && ride.status == 'in_progress' && (

        <button className='decision-button' onClick={() => handleProgress(ride.id)}>Zakończ przejazd</button>
    )}

    {currentUser && currentUser.id == ride.driver.id &&(

        <button className='decision-button' onClick={() => handleDelete(ride.id)}>Usuń przejazd</button>
    )}
     </div>
    {currentUser &&
        currentUser.id !== ride.driver.id &&
        !ride.requests.some((req) => req.user.id === currentUser.id) && (
        <div>
          <button className="request-button" onClick={handleClick}>Dołącz do przejazdu!</button>
        </div>
)}
{currentUser &&
  currentUser.id !== ride.driver.id && (() => {
    const userRequest = ride.requests.find(req => req.user.id === currentUser.id);
    return userRequest && (userRequest.status === 'waiting' || userRequest.status === 'accepted') ? (
      <div>
        <button
          className="request-button"
          onClick={() => handleWithdraw(userRequest.id, userRequest.user.id)}
        >
          Wycofaj prośbę o dołączenie
        </button>
      </div>
    ) : null;
  })()}

        </div>
      </div>
      <div>
        <Map ride={ride} />
      </div>
    </div>
  );
}