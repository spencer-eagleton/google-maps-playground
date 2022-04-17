import { useLoadScript } from '@react-google-maps/api';
import { GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api';
import mapStyles from './mapStyles';

import './App.css';
import { useCallback, useMemo, useState } from 'react';
export default function App() {
  const [markers, setMarkers] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBdNq9njCHnPId5ilXIgn7LvnexfHImuWU',
  });
  const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
  };
  const center = { lat: 45.51223, lng: -122.658722 };
  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
  };

  const onMapClick = useCallback((event) => {
    setMarkers(
      (current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.time}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: "./assets/soup.png",
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(15,15),
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
