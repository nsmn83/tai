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
            <div className="rides-container">
                <p>Brak danych o przejeździe..</p>
            </div>
        );
    }

    return (
        <div className="rides-container">
            <h2>Szczegóły przejazdu</h2>
            <p>To są szczegóły dla przejazdu o ID: {przejazd.id}</p>
            <p>Start: {przejazd.start}</p>
            <p>Cel: {przejazd.koniec}</p>
            <p>Kierowca: {przejazd.kierowca}</p>
            <p>Data: {przejazd.data}</p>
            <p>Godz: {przejazd.godzina}</p>
            <img src={testImage} alt="test" />
            <button onClick = {() => handleClick}>Dołącz do przejazdu!</button>
        </div>
    );
}
