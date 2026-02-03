export function calculateDistance(
  position1: { lat: number; lng: number },
  position2: { lat: number; lng: number },
): number {
  const R = 6371e3;
  const lat1Rad = (position1.lat * Math.PI) / 180;
  const lat2Rad = (position2.lat * Math.PI) / 180;
  const deltaLat = ((position2.lat - position1.lat) * Math.PI) / 180;
  const deltaLng = ((position2.lng - position1.lng) * Math.PI) / 180;

  //Haversine Formula
  const hValue =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLat / 2) *
      Math.sin(deltaLng / 2);
  const angleDistance =
    2 * Math.atan2(Math.sqrt(hValue), Math.sqrt(1 - hValue));
  return R * angleDistance; //단위 (m)
}
