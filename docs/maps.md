# Maps

Maps are rendered with **[MapLibre](https://maplibre.org/)**
(`@maplibre/maplibre-react-native`) using **OpenStreetMap raster tiles**. This
requires **no API key on any platform** (Android or iOS) and no billing account.

Search and address lookup are handled **on-device** by `expo-location`
(`geocodeAsync` / `reverseGeocodeAsync`) — also keyless, no Places API.

## Where things live

| Concern | File |
| --- | --- |
| Tile source / base style | [`src/lib/location/map-style.ts`](../src/lib/location/map-style.ts) |
| Coordinate helpers (`[lng,lat]`, bounds, zoom) | [`src/lib/location/coords.ts`](../src/lib/location/coords.ts) |
| Device GPS hook | [`src/lib/location/use-device-location.ts`](../src/lib/location/use-device-location.ts) |
| Forward / reverse geocoding | [`src/lib/location/geocode.ts`](../src/lib/location/geocode.ts) |
| Native config (plugin, permissions) | [`app.config.ts`](../app.config.ts) |

Screens using a map: browse services ([`map.tsx`](../src/app/%28customer%29/map.tsx)),
booking tracking ([`track/[bookingId].tsx`](../src/app/%28customer%29/track/%5BbookingId%5D.tsx)),
add address ([`addresses/new.tsx`](../src/app/%28shared%29/addresses/new.tsx)),
manual city picker ([`location-manual.tsx`](../src/app/location-manual.tsx)).

## Running it

MapLibre is a **native module**, so a JS reload isn't enough — regenerate and
rebuild the native app once after pulling these changes:

```bash
pnpm prebuild        # regenerates android/ & ios/ with the MapLibre plugin
pnpm android         # or: pnpm ios
```

It will **not** work in Expo Go (use the dev client). No keys, no `.env` entries,
and no extra setup are required for the tiles to appear.

## ⚠️ Production note: OSM tile policy

The default tiles come from OpenStreetMap's public servers
(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`). These are great for
development and demos but the
[OSMF tile usage policy](https://operations.osmfoundation.org/policies/tiles/)
**prohibits heavy / commercial traffic**. Before shipping to real users, point
the map at a tile source you're allowed to use.

### Swapping the tile source

Everything is driven by a single constant — `OSM_RASTER_STYLE` in
[`src/lib/location/map-style.ts`](../src/lib/location/map-style.ts). To switch
providers you only edit that file; no screen changes are needed.

Keyless / production-safe options:

- **Self-hosted Protomaps (`.pmtiles`)** — fully keyless. Extract an Algeria
  region (or the planet) to a single `.pmtiles` file, host it on any static
  host / S3 / CDN, and point the style at it. No per-request billing, no key.
  See <https://protomaps.com/>.

Provider options with a **free key (no credit card)**:

- **MapTiler** — replace `mapStyle` with a hosted style URL like
  `https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY`. Free
  non-commercial tier. <https://www.maptiler.com/>
- **Stadia Maps** — similar; free non-commercial tier with domain/key auth.
  <https://stadiamaps.com/>

If you adopt a provider key, add it to [`.env`](../.env) as an
`EXPO_PUBLIC_…` variable, read it in `map-style.ts`, and keep the value out of
version control.

## API quick-reference (MapLibre v11)

Gotcha: MapLibre uses **`[longitude, latitude]`** order (the opposite of the
`{ latitude, longitude }` we use internally). Convert at the boundary with
`toPosition()` / `fromLngLat()` from `@/lib/location`.

- Base map: `<Map mapStyle={MAP_STYLE_JSON} />` (import `Map as MapView`).
- Camera: imperative via `cameraRef.current?.easeTo({ center, zoom, duration })`,
  `flyTo(...)`, `fitBounds([w,s,e,n], { padding, duration })`.
- Markers: `<Marker lngLat={[lng,lat]} anchor="bottom">` with a single child.
- Lines: `<GeoJSONSource data={…}><Layer type="line" paint={…} /></GeoJSONSource>`.
- Map taps: `onPress` → `event.nativeEvent.lngLat`.
