import { InfoWindow, useLoadScript } from '@react-google-maps/api';
import { GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api';
import mapStyles from './mapStyles';
// import Map from '../../components/map/map'

import '../../App.css';
import { useCallback, useMemo, useRef, useState } from 'react';

export default function MapView() {
    const [newMarkers, setNewMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);


    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: 'AIzaSyBdNq9njCHnPId5ilXIgn7LvnexfHImuWU',
    });
    const mapContainerStyle = {
      width: '100vw',
      height: '100vh',
    };

    // retain position during rerender
    const center = useMemo(() => ({ lat: 45.51223, lng: -122.658722 }), []);
    const options = {
      styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: true,
    };
  
    // no dependancy in useCallback prevents rerender
    const onMapClick = useCallback((event) => {
      setNewMarkers(
        (current) => [
        ...current,
        {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          time: new Date(),
        },
      ]);
    }, []);

    // make 'box' to save map instance
    // const mapRef = useRef();
    // return saved map instance on rerender
    // const onMapLoad = useCallback((map) => {
    //     mapRef.current = map;
    // }, []);


    if (loadError) return 'Error Loading Map'
    if (!isLoaded) return <p>Loading...</p>;
  
  return (
    //   <Map />
    <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
        options={options}
        onClick={onMapClick}
        // onLoad={onMapLoad}
      >
        {newMarkers.map((marker) => (
          <Marker
            key={marker.time}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: "./assets/soup.png",
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(15,15),
            }}
            onClick={() => {
                setSelectedMarker(marker);
                console.log(selectedMarker);
            }}
          />
        ))}
        {selectedMarker ? (
            <InfoWindow>
                <div>
                    <h3>Free Soup</h3>
                    <p>Posted at </p>
                </div>
            </InfoWindow>
        ) : null}
      </GoogleMap>
  )
}
