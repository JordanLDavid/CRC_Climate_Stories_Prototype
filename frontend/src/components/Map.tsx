import React, { useEffect, useRef } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import { Post } from './posts/types';
import { Protocol } from 'pmtiles';

interface MapProps {
  posts: Post[];
  onMapClick: (coordinates: [number, number], event: MouseEvent) => void;
}

const MapComponent: React.FC<MapProps> = ({ posts, onMapClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Register the PMTiles protocol
      const protocol = new Protocol();
      maplibregl.addProtocol('pmtiles', protocol.tile.bind(protocol));

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://demotiles.maplibre.org/style.json',

        center: [-79.347015, 43.65107], // Toronto
        zoom: 12,
        maxBounds: [
          [-140.99778, 41.6751050889], 
          [-52.6480987209, 83.23324],
        ],
      });

      // Add click event listener
      const handleClick = (e: maplibregl.MapMouseEvent) => {
        const { lng, lat } = e.lngLat;
        onMapClick([lng, lat], e.originalEvent as MouseEvent);
      };

      map.on('click', handleClick);

      mapRef.current = map;

      return () => {
        map.off('click', handleClick);
        map.remove();
        mapRef.current = null;
      };
    }
  }, [onMapClick]);

  // Update Markers
  useEffect(() => {
    if (mapRef.current) {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add new markers
      posts.forEach((post) => {
        const marker = new maplibregl.Marker()
          .setLngLat([post.location.coordinates[0], post.location.coordinates[1]])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(
              `<b>${post.title}</b><br/>${post.content.description}<br/><small>${new Date(
                post.created_at
              ).toLocaleDateString()}</small><br/>${post.tags.map((tag) => `#${tag}`).join(' ')}`
            )
          )
          .addTo(mapRef.current!);
        markersRef.current.push(marker);
      });
    }
  }, [posts]);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default MapComponent;
