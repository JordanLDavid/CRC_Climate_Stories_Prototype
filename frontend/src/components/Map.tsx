import React from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import './Map.css';
import { Post } from './posts/types';

interface MapProps {
  posts: Post[];
  onMapClick: (coordinates: [number, number], event: React.MouseEvent<HTMLDivElement>) => void;
}

const MapClickHandler: React.FC<{ onMapClick: (coordinates: [number, number], event: React.MouseEvent<HTMLDivElement>) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const syntheticEvent = {
        ...e.originalEvent,
        currentTarget: e.target,
      } as unknown as React.MouseEvent<HTMLDivElement>;

      onMapClick([e.latlng.lng, e.latlng.lat], syntheticEvent);
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