import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import './Map.css';
import { LatLngTuple } from 'leaflet';

interface MapProps {
  onMapClick: (coordinates: [number, number], event: React.MouseEvent<HTMLDivElement>) => void; // Updated to accept the event
}

const MapClickHandler: React.FC<{ onMapClick: (coordinates: [number, number], event: React.MouseEvent<HTMLDivElement>) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      // Create a synthetic mouse event to pass to onMapClick
      const syntheticEvent = {
          ...e.originalEvent,
          currentTarget: e.target,
      } as unknown as React.MouseEvent<HTMLDivElement>; // Cast to appropriate event type

      onMapClick([e.latlng.lng, e.latlng.lat], syntheticEvent); // Pass both coordinates and event
    },
  });
  return null;
};

const Map: React.FC<MapProps> = ({ onMapClick }) => {
  // Center coordinates for Toronto
  const center: LatLngTuple = [43.65107, -79.347015]; // Toronto's coordinates
  // Define bounds to restrict panning (southwest and northeast corners)
  const maxBounds: [[number, number], [number, number]] = [
    [43.579, -79.639], // Southwest corner
    [43.785, -79.123], // Northeast corner
  ];

  return (
    <MapContainer 
      center={center} 
      zoom={12} 
      className="map-container" 
      maxBounds={maxBounds} // Set maximum bounds
      maxBoundsViscosity={1.0} // Adjust to allow some leeway near the bounds
      scrollWheelZoom={true} // Allow zooming with scroll
      minZoom={12} // Minimum zoom level to prevent zooming out far from Toronto
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
};

export default Map;
