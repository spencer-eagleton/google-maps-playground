import { useLoadScript } from '@react-google-maps/api';
import { GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api';
import mapStyles from './mapStyles';

import './App.css';
import { useMemo, useState } from 'react';
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

  const map = useMemo(() => {
    
  })
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={(event) => {
          console.log(event);
          setMarkers(
            (current) => [
            ...current,
            {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
              time: new Date(),
            },
          ]);
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.time}
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
