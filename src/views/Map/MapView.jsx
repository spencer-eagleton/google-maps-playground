import { InfoWindow, useLoadScript } from '@react-google-maps/api';
import { GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api';
import mapStyles from './mapStyles';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox';
import '@reach/combobox/styles.css';

import '../../App.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function MapView() {
  const [newMarkers, setNewMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 45.51223,
    lng: -122.658722,
  });
  const libraries = ['places'];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB_CW_olHj572sQ6AURzEjfzrFK2bhz5J8',
    libraries,
  });

  const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
  };

  // retain position during rerender
  const center = useMemo(() => mapCenter, [mapCenter]);
  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
  };

  async function getCoords() {
    const resp = await fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyB_CW_olHj572sQ6AURzEjfzrFK2bhz5J8'
    );
    const data = await resp.json();
    console.log(data);
  }

  useEffect(() => {
    const fetchCoords = async () => {
      const data = await getCoords();
      console.log(data);
    };
    fetchCoords();
  }, []);

  // no dependancy in useCallback prevents rerender
  const onMapClick = useCallback((event) => {
    //keep added markers with spread
    setNewMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  // make 'box' to retain map instance state
  const mapRef = useRef();
  // // return saved map instance on load
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  // pans to given location once per mount
  const panToLocation = ({ lat, lng }) => {
    mapRef.current.panToLocation({ lat, lng });
    mapRef.current.setZoom(13);
  };
  //   const panToLocation = useCallback(({ lat, lng }) => {
  //     mapRef.current.panToLocation({ lat, lng });
  //     mapRef.current.setZoom(13);
  //   }, []);

  function LocateUser({ panToLocation }) {
    return (
      <button
        className="locate"
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log(position);
              const { latitude, longitude } = position.coords;
              console.log({ latitude, longitude });
              setMapCenter({ lat: latitude, lng: longitude });

              // panToLocation({
              //   lat: position.coords.latitude,
              //   lng: position.coords.longitude,
              // });
            },
            // empty function for failure condition
            () => null
          );
        }}
      >
        Locate
      </button>
    );
  }

  function Search() {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        location: {
          lat: () => 45.51223,
          lng: () => -122.658722,
        },
        radius: 200 * 1000,
      },
    });

    return (
      <div className="search">
        <Combobox
          onSelect={async (address) => {
            try {
              const results = await getGeocode({ address });
              const { lat, lng } = await getLatLng(results[0]);
              console.log({ lat, lng });
            } catch (error) {
              console.log('error');
            }

            console.log(address);
          }}
        >
          <ComboboxInput
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            disabled={!ready}
            placeholder="enter an address"
          ></ComboboxInput>
          <ComboboxPopover>
            {status === 'OK' &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxPopover>
        </Combobox>
      </div>
    );
  }

  // useEffect(() => {
  //   async function codeAdress() {
  //     const address = '12214 SE 1st St, Vancouver, WA';
  //     try {
  //       const results = await getGeocode({ address });
  //       console.log(results[0]);
  //     } catch (error) {
  //       console.log('error');
  //     }
  //   }
  //   codeAdress();
  // }, []);

  if (loadError) return 'Error Loading Map';
  if (!isLoaded) return <p>Loading...</p>;

  return (
    //   <Map />
    <>
      <LocateUser panToLocation={panToLocation} />
      <Search />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={(mapCenter) => setMapCenter(mapCenter)}
      >
        {newMarkers.map((marker) => (
          <Marker
            key={marker.time}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: '/assets/soup.png',
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              setSelectedMarker(marker);
              console.log(selectedMarker);
            }}
          />
        ))}
        {selectedMarker ? (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => {
              setSelectedMarker(null);
            }}
          >
            <div>
              <h3>Free Soup</h3>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </>
  );
}
