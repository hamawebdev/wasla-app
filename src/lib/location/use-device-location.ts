import type { LatLng } from './coords';
import * as Location from 'expo-location';

import { useCallback, useState } from 'react';

type Status = 'idle' | 'loading' | 'granted' | 'denied' | 'error';

export type DeviceLocationState = {
  /** Last known device position, or null until resolved. */
  coords: LatLng | null;
  status: Status;
  /**
   * Request permission (if needed) and fetch the current position.
   * Resolves with the coords, or null if permission was denied / lookup failed.
   */
  request: () => Promise<LatLng | null>;
};

/**
 * Foreground device location via expo-location. Keeps the last resolved
 * position in state and exposes an idempotent `request()` for buttons like
 * "recenter". Never throws — failures resolve to null and set `status`.
 */
export function useDeviceLocation(): DeviceLocationState {
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const request = useCallback(async (): Promise<LatLng | null> => {
    setStatus('loading');
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') {
        setStatus('denied');
        return null;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const next = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setCoords(next);
      setStatus('granted');
      return next;
    }
    catch {
      setStatus('error');
      return null;
    }
  }, []);

  return { coords, status, request };
}
