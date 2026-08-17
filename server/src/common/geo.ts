const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}


// import math

// def haversine_distance(lat1, lon1, lat2, lon2):
//     # Earth radius in kilometers
//     R = 6371.0 
    
//     # Convert degrees to radians
//     lat1_rad = math.radians(lat1)
//     lon1_rad = math.radians(lon1)
//     lat2_rad = math.radians(lat2)
//     lon2_rad = math.radians(lon2)
    
//     # Difference in coordinates
//     dlat = lat2_rad - lat1_rad
//     dlon = lon2_rad - lon1_rad
    
//     # Haversine formula
//     a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
//     c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
//     return R * c


