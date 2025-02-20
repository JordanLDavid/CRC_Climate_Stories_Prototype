import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, GeoJSON } from 'react-leaflet';
import LocationHandler from './LocationHandler';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { Post } from './posts/types';
import { isPointInPolygon } from '../utils/map-utils';

interface MapProps {
  posts: Post[];
  onMapClick: (coordinates: [number, number], event: React.MouseEvent<HTMLDivElement>) => void;
}

const MapClickHandler: React.FC<{ onMapClick: (coordinates: [number, number], event: React.MouseEvent<HTMLDivElement>) => void, canadaGeoJSON: any }> = ({ onMapClick, canadaGeoJSON }) => {
  const [canadaLayer, setCanadaLayer] = useState<L.GeoJSON | null>(null);

  useEffect(() => {
    if (canadaGeoJSON) {
      // Only create the GeoJSON layer if canadaGeoJSON is valid
      const layer = new L.GeoJSON(canadaGeoJSON);
      setCanadaLayer(layer);
    }
  }, [canadaGeoJSON]);

  useMapEvents({
    click: (e) => {
      if (canadaLayer) {
        // Check if the clicked point is inside the Canada boundary
        const isInsideCanada = isPointInPolygon([e.latlng.lng, e.latlng.lat], canadaLayer);
        

        if (isInsideCanada) {
          const roundedLat = parseFloat(e.latlng.lat.toFixed(5));
          const roundedLng = parseFloat(e.latlng.lng.toFixed(5));
          const syntheticEvent = {
            ...e.originalEvent,
            currentTarget: e.target,
          } as unknown as React.MouseEvent<HTMLDivElement>;

          console.log(`Point is inside Canada: [${roundedLng}, ${roundedLat}]`);
          onMapClick([roundedLng, roundedLat], syntheticEvent);
        } else {
          console.log("Point is outside Canada");
          alert("You can only click within Canada!");
        }
      }
    },
  });

  return null;
};

const PostMarkers: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const markerIcon = new L.Icon({
    iconUrl: '/leaflet-icons/marker-icon.png',
    iconRetinaUrl: '/leaflet-icons/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/leaflet-icons/marker-shadow.png',
    shadowSize: [41, 41],
  });

  return (
    <>
      {posts.map((post) => (
        <Marker
          key={post._id}
          position={[post.location.coordinates[1], post.location.coordinates[0]]}
          icon={markerIcon}
        >
          <Popup>
            <b>{post.title}</b>
            <br />
            {post.content.description}
            <br />
            <small>{new Date(post.created_at).toLocaleDateString()}</small>
            <br />
            {post.tags.map(tag => `#${tag}`).join(' ')}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

const Map: React.FC<MapProps> = ({ posts, onMapClick }) => {
  const center: LatLngTuple = [45.4215, -75.6972]; // Default center (will be updated by LocationHandler)
  const zoomLevel = 4; // Zoomed out to show all of Canada
  const [canadaGeoJSON, setCanadaGeoJSON] = useState<any | null>(null);

  useEffect(() => {
    fetch('/canada.geojson')
      .then((res) => res.json())
      .then((data) => setCanadaGeoJSON(data))
      .catch((err) => console.error('Failed to load GeoJSON', err));
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoomLevel}
      className="map-container"
      scrollWheelZoom={true}
      minZoom={4}
      maxBounds={[[41.676556, -141.002197], [83.110626, -52.620281]]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      
      {/* Only render GeoJSON when it's loaded */}
      {canadaGeoJSON && <GeoJSON data={canadaGeoJSON} style={{ color: 'transparent', fillOpacity: 0 }} />}
      
      <MapClickHandler onMapClick={onMapClick} canadaGeoJSON={canadaGeoJSON} />
      <PostMarkers posts={posts} />
      <LocationHandler />
    </MapContainer>
  );
};

export default Map;
