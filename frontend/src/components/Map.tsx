import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import LocationHandler from './LocationHandler';
import { Post } from './posts/types';
import { isPointInPolygon } from '../utils/map-utils';
import './Map.css';

interface MapProps {
  posts: Post[];
  onMapClick: (coordinates: [number, number], event: React.MouseEvent<HTMLDivElement>) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const canadaBounds = {
  north: 83.5, // Increased to include northernmost islands
  south: 41.0, // Lowered to include all southern points
  west: -141.5, // Extended west to include all of Yukon
  east: -50.0, // Extended east to include Newfoundland and maritime islands
};

const PostMarkers: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <>
      {posts.map((post) => (
        <Marker
          key={post._id}
          position={{
            lat: post.location.coordinates[1],
            lng: post.location.coordinates[0]
          }}
          onClick={() => setSelectedPost(post)}
        >
          {selectedPost === post && (
            <InfoWindow onCloseClick={() => setSelectedPost(null)}>
              <div>
                <h3>{post.title}</h3>
                <p>{post.content.description}</p>
                <small>{new Date(post.created_at).toLocaleDateString()}</small>
                <br />
                <span>{post.tags.map(tag => `#${tag}`).join(' ')}</span>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </>
  );
};

const Map: React.FC<MapProps> = ({ posts, onMapClick }) => {
  const center = { lat: 45.4215, lng: -75.6972 }; // Default center
  const [canadaPolygon, setCanadaPolygon] = useState<any>(null);

  useEffect(() => {
    fetch('/canada.geojson')
      .then((res) => res.json())
      .then((data) => setCanadaPolygon(data))
      .catch((err) => console.error('Failed to load GeoJSON', err));
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // First do a quick bounding box check for performance
    if (lat >= canadaBounds.south && lat <= canadaBounds.north &&
        lng >= canadaBounds.west && lng <= canadaBounds.east) {
      
      // If we have the polygon data, do a precise point-in-polygon check
      if (canadaPolygon) {
        if (isPointInPolygon([lng, lat], canadaPolygon)) {
          const syntheticEvent = e.domEvent as unknown as React.MouseEvent<HTMLDivElement>;
          onMapClick([lng, lat], syntheticEvent);
        } else {
          alert("You can only click within Canada's borders!");
        }
      } else {
        // If polygon data isn't loaded yet, fallback to bounding box
        const syntheticEvent = e.domEvent as unknown as React.MouseEvent<HTMLDivElement>;
        onMapClick([lng, lat], syntheticEvent);
      }
    } else {
      alert("You can only click within Canada!");
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={4}
        onClick={handleMapClick}
        options={{
          restriction: {
            latLngBounds: canadaBounds,
            strictBounds: true,
          },
          minZoom: 4,
          streetViewControl: false,
        }}
      >
        <PostMarkers posts={posts} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;