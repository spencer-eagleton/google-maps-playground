import { useMemo } from 'react'
import '../App.css'
import { GoogleMap, Marker, MarkerClusterer } from '@react-google-maps/api'



export default function Map() {
    const center = useMemo(() => ({ lat: 45.51223, lng: -122.658722 }), [])
  return (
    <div className='container'>
        <div className='map'>
            <GoogleMap zoom={10} center={center} mapContainerClassName="map-container"></GoogleMap>
        </div>
    </div>
  )
}
