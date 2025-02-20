import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface LocationHandlerProps {
  onLocationFound?: (lat: number, lng: number) => void;
}

const LocationHandler: React.FC<LocationHandlerProps> = ({ onLocationFound }) => {
  const map = useMap();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 10);
          if (onLocationFound) {
            onLocationFound(latitude, longitude);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [map, onLocationFound]);

  return null;
};

export default LocationHandler;