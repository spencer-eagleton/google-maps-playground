import { useLoadScript } from '@react-google-maps/api';
import { GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api';

import Map from './components/map';
import './App.css';
export default function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBdNq9njCHnPId5ilXIgn7LvnexfHImuWU',
  });
  const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
  };
  const center = { lat: 45.51223, lng: -122.658722 }

  if (!isLoaded) return <p>Loading...</p>;
  return (
    <div>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center}></GoogleMap>
    </div>
  );
}
