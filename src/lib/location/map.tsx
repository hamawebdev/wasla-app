// Native map primitives (MapLibre). The web build resolves `map.web.tsx`
// instead, because MapLibre has no react-native-web support and importing its
// native components crashes the web bundle.
export {
  Camera,
  GeoJSONSource,
  Layer,
  Map as MapView,
  Marker,
} from '@maplibre/maplibre-react-native';
export type { CameraRef, PressEvent } from '@maplibre/maplibre-react-native';
