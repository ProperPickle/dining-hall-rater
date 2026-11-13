import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './Map.css';
import 'leaflet/dist/leaflet.css';

export default function Map({ locations }) {
  const uclaPosition = [34.07, -118.44]; // [latitude, longitude]

  return (
    <MapContainer center={uclaPosition} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        location.position && 
        <Marker position={location.position} key={location.id} >
            <Popup>
                Welcome to the {location.name}! <br /> Current Rating: NOT IMPLEMENTED
            </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
