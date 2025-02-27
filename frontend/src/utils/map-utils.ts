export function isPointInBounds(coordinates: [number, number], bounds: { north: number; south: number; west: number; east: number }): boolean {
  const [lng, lat] = coordinates;
  return lat >= bounds.south && lat <= bounds.north && lng >= bounds.west && lng <= bounds.east;
}

/**
 * Check if a point is inside a polygon using the ray casting algorithm.
 * @param point [longitude, latitude] coordinates
 * @param polygon GeoJSON polygon geometry or feature
 * @returns true if the point is inside the polygon
 */
export function isPointInPolygon(point: [number, number], polygon: any): boolean {
  const polyCoords = polygon.features[0].geometry ? polygon.features[0].geometry : polygon.geometry;
  if (!polygon || (!polyCoords && !polyCoords.coordinates)) {
    return false;
  }

  const coords = polyCoords ? polyCoords.coordinates : polygon.coordinates;
  if (!coords || !coords.length) {
    return false;
  }

  // For multipolygons, check all polygons
  if (polyCoords && polyCoords.type === 'MultiPolygon' || 
      polygon.type === 'MultiPolygon') {
    return coords.some((polyCoords: any) => 
      isPointInSinglePolygon(point, polyCoords[0]) // Check against outer ring
    );
  }

  // For a single polygon (with possible holes)
  const outerRing = coords[0];
  return isPointInSinglePolygon(point, outerRing);
}

/**
 * Helper function to check if point is in a single polygon without holes
 * @param point [longitude, latitude] coordinates
 * @param polygon Array of [longitude, latitude] coordinates forming a polygon
 * @returns true if the point is inside the polygon
 */
function isPointInSinglePolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [x, y] = point;
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    
    const intersect = ((yi > y) !== (yj > y)) && 
                      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) {
      inside = !inside;
    }
  }
  
  return inside;
}