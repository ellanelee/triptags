import { IDistance } from '@/common/type/types';

export function calculateDistance(distanceInput: IDistance): number {
  const { baseLat, baseLng, localLat, localLng } = distanceInput;
  const R = 6371e3;
  const lat1Rad = (baseLat * Math.PI) / 180;
  const lat2Rad = (localLat * Math.PI) / 180;
  const deltaLat = ((localLat - baseLat) * Math.PI) / 180;
  const deltaLng = ((localLng - baseLng) * Math.PI) / 180;

  //Haversine Formula
  const hValue =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const angleDistance =
    2 * Math.atan2(Math.sqrt(hValue), Math.sqrt(1 - hValue));
  return R * angleDistance; //단위 (m)
}
