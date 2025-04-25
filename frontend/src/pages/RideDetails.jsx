import { useLocation, useParams } from "react-router-dom";
import testImage from '../assets/test.jpg';

export default function RideDetails() {
    const { state } = useLocation(); 
    const { przejazd } = state || {}; 

    //obsluga wcisniecia guzika
    const handleClick = (przejazd) => {

    }


    if (!przejazd) {
        return (
            <div className="rides-details-container">
                <p>Brak danych o przejeździe..</p>
            </div>
        );
    }

    return (
        <div className="rides-details-container">
            <div>
            <h2>Szczegóły przejazdu</h2>
            <p>To są szczegóły dla przejazdu o ID: {przejazd.id}</p>
            <p> Hej, nazywam się Piotr i będe jechał zieloną Skodą Fabią.</p>
            <p>Start: {przejazd.start}</p>
            <p>Cel: {przejazd.koniec}</p>
            <p>Kierowca: {przejazd.kierowca}</p>
            <p>Data: {przejazd.data}</p>
            <p>Godz: {przejazd.godzina}</p>
            <button className="request-button" onClick = {() => handleClick}>Dołącz do przejazdu!</button>
            </div>
            <img className="map-image" src={testImage} alt="test" />
        </div>
    );
}
