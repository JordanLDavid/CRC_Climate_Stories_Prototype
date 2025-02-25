import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, Feature, MultiPolygon, Polygon } from '@turf/helpers';

export function isPointInPolygon(coordinates: [number, number], geoJSON: any): boolean {
    try {
        const pt = point(coordinates);
        const polygons = geoJSON.features[0].geometry;
        return booleanPointInPolygon(pt, polygons as Feature<Polygon | MultiPolygon>);
    } catch (error) {
        console.error('Error checking if point is in polygon:', error);
        return false;
    }
}