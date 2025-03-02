import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const nearbyUserIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to update map center when user location changes
function MapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

const MapView = ({ userLocation, nearbyUsers, onUserSelect }) => {
  const [center, setCenter] = useState([51.505, -0.09]); // Default center (London)

  useEffect(() => {
    if (userLocation) {
      setCenter([userLocation.latitude, userLocation.longitude]);
    }
  }, [userLocation]);

  if (!userLocation) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Current user marker */}
      <Marker
        position={[userLocation.latitude, userLocation.longitude]}
        icon={userIcon}
      >
        <Popup>
          You are here
        </Popup>
      </Marker>

      {/* Nearby users markers */}
      {nearbyUsers.map((user) => {
        const handleClick = () => {
          onUserSelect(user);
        };

        return (
          <Marker
            key={user.id}
            position={[user.latitude, user.longitude]}
            icon={nearbyUserIcon}
            eventHandlers={{ click: handleClick }}
          >
            <Popup>
              <div>
                <h3>{user.username}</h3>
                <p>Distance: {user.distance.toFixed(2)} km</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
      <MapCenterUpdater center={center} />
    </MapContainer>
  );
};

export default MapView;
