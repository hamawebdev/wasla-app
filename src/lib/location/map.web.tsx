import type { Ref } from 'react';
import type { ViewProps } from 'react-native';
import { useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';

/**
 * Web fallbacks for the native MapLibre primitives.
 *
 * MapLibre has no react-native-web support, so on web we render a neutral
 * placeholder instead of the map and turn the overlay components into no-ops.
 * This lets the map screens mount on web without crashing; the interactive map
 * itself is mobile-only. tsc resolves the native `map.tsx` for prop types, so
 * the loose shapes here only need to be internally valid.
 */

export type CameraRef = {
  easeTo: (...args: unknown[]) => void;
  flyTo: (...args: unknown[]) => void;
  jumpTo: (...args: unknown[]) => void;
  zoomTo: (...args: unknown[]) => void;
  fitBounds: (...args: unknown[]) => void;
};

export type PressEvent = {
  lngLat: [number, number];
  point: { x: number; y: number };
};

type AnyProps = ViewProps & Record<string, unknown>;

function noop() {}

export function MapView({ style, children }: AnyProps) {
  return (
    <View style={[styles.fallback, style]}>
      <Text variant="caption" style={styles.text}>
        الخريطة متاحة على تطبيق الجوال
      </Text>
      {children}
    </View>
  );
}

// Provides a no-op camera ref so callers' `cameraRef.current?.easeTo(...)` etc.
// stay safe on web. React 19 passes `ref` as a regular prop.
export function Camera({ ref }: { ref?: Ref<CameraRef> }) {
  useImperativeHandle(ref, () => ({
    easeTo: noop,
    flyTo: noop,
    jumpTo: noop,
    zoomTo: noop,
    fitBounds: noop,
  }));
  return null;
}

export function Marker() {
  return null;
}

export function GeoJSONSource() {
  return null;
}

export function Layer() {
  return null;
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'hsl(180, 20%, 92%)',
  },
  text: { color: 'hsl(198, 15%, 45%)' },
});
