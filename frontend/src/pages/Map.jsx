import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { useEffect } from 'react';
import '../App.css';

function Routing({ start, end }) {
  const map = useMap();

  useEffect(() => {
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
}


export default function Map({ ride}) {

  const markers = [
    { id: 'start', position: [ride.start_lat, ride.start_lng], name: 'Start', popup: ride.start_address },
    { id: 'end', position: [ride.end_lat, ride.end_lng], name: 'End', popup: ride.end_address },
  ];

  return (
    <MapContainer className='map-container' center={[52.11, 19.21]} zoom={6}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      {/* Add your map layers and components here */
      markers.map(marker => (
        <Marker key={marker.id} position={marker.position}>
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}

      <Routing start={[ride.start_lat, ride.start_lng]} end={[ride.end_lat, ride.end_lng]} />
      {/* Add your routing control here */}
    </MapContainer>
  );
}