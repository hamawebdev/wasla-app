/**
 * MapLibre base map style — OpenStreetMap raster tiles.
 *
 * This is the single place that defines where map tiles come from. It needs
 * **no API key**. OSM's public tile servers are fine for development/demo, but
 * their tile usage policy disallows heavy production traffic — for production,
 * swap the `tiles` URL (and `attribution`) for a provider you're allowed to use,
 * e.g. a self-hosted Protomaps `.pmtiles`, MapTiler, or Stadia Maps style URL.
 *
 * @see https://operations.osmfoundation.org/policies/tiles/
 */
const OSM_RASTER_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 19,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

/**
 * Pre-serialized style string for MapLibre's `mapStyle` prop. Passing a JSON
 * string (rather than the object) avoids re-stringifying on every render and
 * sidesteps style-spec type friction.
 */
export const MAP_STYLE_JSON = JSON.stringify(OSM_RASTER_STYLE);
