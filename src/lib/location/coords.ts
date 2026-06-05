import { ALGERIAN_CITIES } from '@/api/fixtures/cities';

/** Canonical coordinate shape used across the app (matches expo-location). */
export type LatLng = { latitude: number; longitude: number };

/** MapLibre coordinate order: [longitude, latitude]. */
export type Position = [longitude: number, latitude: number];

/** MapLibre bounds order: [west, south, east, north]. */
export type Bounds = [west: number, south: number, east: number, north: number];

/** Default map center: Algiers. Used as the fallback everywhere. */
export const ALGIERS: LatLng = { latitude: 36.7538, longitude: 3.0588 };

/** Zoom presets (MapLibre zoom levels). */
export const COUNTRY_ZOOM = 5;
export const CITY_ZOOM = 11;
export const FOCUS_ZOOM = 14;
export const STREET_ZOOM = 16;

/**
 * Approximate coordinates for each Algerian wilaya capital in
 * {@link ALGERIAN_CITIES}, keyed by the city `id`. Used to anchor markers and
 * map previews; the underlying mock data has no real coordinates.
 */
export const CITY_COORDS: Record<string, LatLng> = {
  algiers: { latitude: 36.7538, longitude: 3.0588 },
  oran: { latitude: 35.6971, longitude: -0.6308 },
  constantine: { latitude: 36.365, longitude: 6.6147 },
  annaba: { latitude: 36.9, longitude: 7.7667 },
  blida: { latitude: 36.4703, longitude: 2.8277 },
  batna: { latitude: 35.555, longitude: 6.1742 },
  djelfa: { latitude: 34.6703, longitude: 3.263 },
  setif: { latitude: 36.1898, longitude: 5.4108 },
  sidi_bel_abbes: { latitude: 35.1894, longitude: -0.6306 },
  biskra: { latitude: 34.85, longitude: 5.7333 },
  tebessa: { latitude: 35.4042, longitude: 8.1242 },
  tiaret: { latitude: 35.3711, longitude: 1.317 },
  bejaia: { latitude: 36.7509, longitude: 5.0567 },
  tlemcen: { latitude: 34.8783, longitude: -1.315 },
  bechar: { latitude: 31.6167, longitude: -2.2167 },
  mostaganem: { latitude: 35.9311, longitude: 0.0894 },
  msila: { latitude: 35.7058, longitude: 4.5419 },
  medea: { latitude: 36.2675, longitude: 2.7539 },
  tizi_ouzou: { latitude: 36.7169, longitude: 4.0497 },
  el_oued: { latitude: 33.3683, longitude: 6.8675 },
  khenchela: { latitude: 35.4267, longitude: 7.1433 },
  souk_ahras: { latitude: 36.2864, longitude: 7.9514 },
  chlef: { latitude: 36.1647, longitude: 1.3347 },
  bou_arreridj: { latitude: 36.0731, longitude: 4.7608 },
  jijel: { latitude: 36.82, longitude: 5.7667 },
  skikda: { latitude: 36.8761, longitude: 6.9094 },
  guelma: { latitude: 36.4625, longitude: 7.4261 },
  relizane: { latitude: 35.7372, longitude: 0.5556 },
  boumerdes: { latitude: 36.7667, longitude: 3.4772 },
  tipaza: { latitude: 36.5894, longitude: 2.4486 },
  ain_defla: { latitude: 36.2639, longitude: 1.9678 },
  naama: { latitude: 33.2667, longitude: -0.3 },
  ain_temouchent: { latitude: 35.2972, longitude: -1.14 },
  ghardaia: { latitude: 32.4911, longitude: 3.6736 },
};

// Arabic city name -> coordinates, derived from the fixture so the two stay in sync.
const COORDS_BY_NAME: Record<string, LatLng> = Object.fromEntries(
  ALGERIAN_CITIES.filter(c => CITY_COORDS[c.id]).map(c => [c.name, CITY_COORDS[c.id]]),
);

/** Coordinates for a city id, falling back to Algiers. */
export function coordsForCityId(id: string): LatLng {
  return CITY_COORDS[id] ?? ALGIERS;
}

/**
 * Coordinates for an Arabic city name. Matches the leading city segment so
 * values like "وهران، منطقة الأمير" still resolve. Falls back to Algiers.
 */
export function coordsForCityName(name: string | undefined): LatLng {
  if (!name)
    return ALGIERS;
  const head = name.split('،')[0].trim();
  return COORDS_BY_NAME[head] ?? COORDS_BY_NAME[name.trim()] ?? ALGIERS;
}

/** Convert our {latitude, longitude} to MapLibre's [longitude, latitude]. */
export function toPosition(p: LatLng): Position {
  return [p.longitude, p.latitude];
}

/** Convert a MapLibre [longitude, latitude] back to {latitude, longitude}. */
export function fromLngLat([longitude, latitude]: Position): LatLng {
  return { latitude, longitude };
}

/**
 * Deterministic small jitter around a center, derived from a seed string so a
 * given service always lands in the same spot. Keeps mock markers from stacking.
 */
export function jitterAround(center: LatLng, seed: string, spreadKm = 4): LatLng {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) & 0xFFFF;
  const angle = (hash % 360) * (Math.PI / 180);
  const radius = ((hash >> 4) % 100) / 100; // 0..1
  // ~0.009 deg latitude ≈ 1km; longitude scaled by latitude.
  const dLat = (Math.cos(angle) * radius * spreadKm) / 111;
  const dLng
    = (Math.sin(angle) * radius * spreadKm)
      / (111 * Math.cos((center.latitude * Math.PI) / 180));
  return { latitude: center.latitude + dLat, longitude: center.longitude + dLng };
}

/**
 * Bounding box framing a set of points, as MapLibre [west, south, east, north].
 * Returns null for fewer than two points (use a center + zoom instead).
 */
export function boundsForPoints(points: LatLng[]): Bounds | null {
  if (points.length < 2)
    return null;
  const lats = points.map(p => p.latitude);
  const lngs = points.map(p => p.longitude);
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
}
