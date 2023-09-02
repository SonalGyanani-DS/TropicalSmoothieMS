import React, { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

function MapboxMap() {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 400,
    latitude: 37.7749, // Change to your desired latitude
    longitude: -122.4194, // Change to your desired longitude
    zoom: 13, // Adjust the zoom level
  });

  const [selectedMarker, setSelectedMarker] = useState(null);

  // Define marker data (can be an array of objects)
  const markerData = [
    {
      id: 1,
      latitude: 37.7749, // Latitude of the marker
      longitude: -122.4194, // Longitude of the marker
      title: 'Marker Title', // Optional title for the marker
      description: 'This is the content of the info window.', // Info window content
    },
    // Add more markers as needed
  ];

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={'pk.eyJ1IjoieWV4dCIsImEiOiJqNzVybUhnIn0.hTOO5A1yqfpN42-_z_GuLw'} // Replace with your Mapbox token
      onViewportChange={(viewport) => setViewport(viewport)}
    >
      {markerData.map((marker) => (
        <Marker
          key={marker.id}
          latitude={marker.latitude}
          longitude={marker.longitude}
        >
          <div
            onClick={() => setSelectedMarker(marker)}
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#0074D9',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          ></div>
        </Marker>
      ))}

      {selectedMarker && (
        <Popup
          latitude={selectedMarker.latitude}
          longitude={selectedMarker.longitude}
          onClose={() => setSelectedMarker(null)}
        >
          <div>
            <h1>{selectedMarker.title}</h1>
            <p>{selectedMarker.description}</p>
          </div>
        </Popup>
      )}
    </ReactMapGL>
  );
}

export default MapboxMap;
