import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './Map.css';
import 'leaflet/dist/leaflet.css';

export default function Map({ locations, onMarkerClick }) {
  const uclaPosition = [34.07, -118.44]; // [latitude, longitude]

  return (
    <MapContainer center={uclaPosition} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        location.lat && location.lng && 
        <Marker 
          position={[location.lat, location.lng]} 
          key={location.location_id} 
          eventHandlers={{ click: () => onMarkerClick(location.location_id) }}
        >
            <Popup>
                Welcome to the {location.name}! <br /> Current Rating: NOT IMPLEMENTED
            </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
