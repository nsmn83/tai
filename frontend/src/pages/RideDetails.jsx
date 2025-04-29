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
            <div className="content-container">
                <p>Brak danych o przejeździe..</p>
            </div>
        );
    }

    return (
        <div className="detail-page">
            <div className="detail-container">
            <div className="details">
            <h2 className="title">Szczegóły przejazdu</h2>
            <p className="details-description-element"> Hej, nazywam się Piotr i będe jechał zieloną Skodą Fabią. Po drodze będe musiał zatankować w Garwolinie. Mogę podrzucić kogoś kawałek poza trasą jeśli zajmnie to mniej niż 20 minut</p>
            <p className="details-description-element">Trasa przejazdu: {przejazd.start} - {przejazd.koniec}</p>
            <p className="details-description-element">Kierowca: {przejazd.kierowca}</p>
            <p className="details-description-element">Data: {przejazd.data}</p>
            <p className="details-description-element">Godz: {przejazd.godzina}</p>
            <button className="request-button" onClick = {() => handleClick}>Dołącz do przejazdu!</button>
            </div>
            </div>
            <div>
            <img src={testImage} alt="test" />
            </div>
        </div>
    );
}
