import { useParams } from "react-router-dom";
import testImage from '../assets/test.jpg';

export default function RideDetails() {
    const { przejazd } = useParams();

    return (
        <div className="rides-container">
            <h2>Szczegóły przejazdu</h2>
            <p>To są szczegóły dla przejazdu o ID: {przejazd}</p>
            <p>To są szczegóły dla przejazdu o ID: {przejazd}</p>
            <p>To są szczegóły dla przejazdu o ID: {przejazd}</p>
            <p>To są szczegóły dla przejazdu o ID: {przejazd}</p>
            <p>To są szczegóły dla przejazdu o ID: {przejazd}</p>
            <p>To są szczegóły dla przejazdu o ID: {przejazd}</p>
            <p>To są szczegóły dla przejazdu o ID: {przejazd}</p>
            <p>To są szczegóły dla przejazdu o ID: {przejazd}</p>
            <p>To są szczegóły dla przejazdu o ID: {przejazd}</p>
            <img src={testImage} alt="test" />
            {/* Możesz pobrać dane z backendu i wyświetlić tu */}
            <button>Dołącz do przejazdu!</button>
        </div>
    );
}