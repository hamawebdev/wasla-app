import type { LatLng } from './coords';

import * as Location from 'expo-location';

/**
 * On-device geocoding helpers. These use the platform geocoder (Apple on iOS,
 * Android system geocoder) and do NOT require the Google Maps key or a Places
 * API. They can still return empty results when the device geocoder is
 * unavailable, so callers should treat null as "not found", not an error.
 */

/** Free-text query -> first matching coordinate, or null. */
export async function forwardGeocode(query: string): Promise<LatLng | null> {
  const q = query.trim();
  if (!q)
    return null;
  try {
    const results = await Location.geocodeAsync(q);
    const first = results[0];
    if (!first)
      return null;
    return { latitude: first.latitude, longitude: first.longitude };
  }
  catch {
    return null;
  }
}

export type ReverseGeocodeResult = {
  /** Best-effort single-line address. */
  fullAddress: string;
  /** City / locality, when the geocoder provides one. */
  city?: string;
};

/** Coordinate -> human-readable address, or null when nothing resolves. */
export async function reverseGeocode(point: LatLng): Promise<ReverseGeocodeResult | null> {
  try {
    const results = await Location.reverseGeocodeAsync(point);
    const r = results[0];
    if (!r)
      return null;
    const city = r.city ?? r.subregion ?? r.region ?? undefined;
    const line = [r.name, r.street, r.district, r.city, r.region]
      .filter((part): part is string => Boolean(part))
      // Drop a leading plus-code / bare-number "name" that just duplicates the street.
      .filter((part, i, arr) => arr.indexOf(part) === i)
      .join('، ');
    return { fullAddress: line || (city ?? ''), city: city ?? undefined };
  }
  catch {
    return null;
  }
}
