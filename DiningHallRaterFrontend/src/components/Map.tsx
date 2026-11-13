import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './Map.css';
import 'leaflet/dist/leaflet.css';

export default function MyMap() {
  const position = [34.07, -118.44]; // [latitude, longitude]

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
