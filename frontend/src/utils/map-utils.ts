import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

export function isPointInPolygon(coordinates: [number, number], layer: L.GeoJSON): boolean {
    try {
        const pt = point(coordinates);
        return layer.getLayers().some(l => {
            if (l instanceof L.Polygon) {
                const geoJson = l.toGeoJSON();
                return booleanPointInPolygon(pt, geoJson.geometry);
            }
            return false;
        });
    } catch (error) {
        console.error('Error in point-in-polygon check:', error);
        return false;
    }
}