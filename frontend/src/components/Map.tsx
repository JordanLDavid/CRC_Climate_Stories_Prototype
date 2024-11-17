import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import './Map.css';
import 'leaflet/dist/leaflet.css';
import { Post } from './posts/types';

interface MapProps {
  posts: Post[];
  onMapClick: (coordinates: [number, number], event: React.MouseEvent<HTMLDivElement>) => void;
}

const MapClickHandler: React.FC<{ onMapClick: (coordinates: [number, number], event: React.MouseEvent<HTMLDivElement>) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const roundedLat = parseFloat(e.latlng.lat.toFixed(5));
      const roundedLng = parseFloat(e.latlng.lng.toFixed(5));
      const syntheticEvent = {
        ...e.originalEvent,
        currentTarget: e.target,
      } as unknown as React.MouseEvent<HTMLDivElement>;

      onMapClick([roundedLng, roundedLat], syntheticEvent);
    },
  });
  return null;
};

const PostMarkers: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <>
      {posts.map((post) => (
        <Marker
          key={post._id}
          position={[post.location.coordinates[1], post.location.coordinates[0]]}
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
  const center: LatLngTuple = [43.65107, -79.347015];
  const maxBounds: [[number, number], [number, number]] = [
    [43.579, -79.639],
    [43.785, -79.123],
  ];

  useEffect(() => {
    // TypeScript workaround for accessing _getIconUrl
    const defaultIcon = L.Icon.Default as any;

    // Delete the default method and merge options
    delete defaultIcon.prototype._getIconUrl;
    defaultIcon.mergeOptions({
      iconUrl: '/leaflet-icons/marker-icon.png',    // Marker icon path (normal)
      iconRetinaUrl: '/leaflet-icons/marker-icon-2x.png', // Retina version of marker icon
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: '/leaflet-icons/marker-shadow.png', // Shadow path
      shadowSize: [41, 41],
    });

    // Update the layers control icon paths
    L.Icon.Default.mergeOptions({
      // For layers control (if you're using it)
      iconUrl: '/leaflet-icons/layers.png',        // Layers icon
      iconRetinaUrl: '/leaflet-icons/layers-2x.png', // Retina version of layers icon
      shadowUrl: '/leaflet-icons/marker-shadow.png', // Shadow (same as marker shadow)
    });

  }, []);

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="map-container"
      maxBounds={maxBounds}
      maxBoundsViscosity={1.0}
      scrollWheelZoom={true}
      minZoom={12}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapClickHandler onMapClick={onMapClick} />
      <PostMarkers posts={posts} />
    </MapContainer>
  );
};

export default Map;