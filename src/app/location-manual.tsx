import type { CameraRef } from '@/lib/location/map';
import { useRouter } from 'expo-router';
import { MapPin, Search } from 'lucide-react-native';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ALGERIAN_CITIES } from '@/api/fixtures/cities';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { CITY_ZOOM, coordsForCityId, MAP_STYLE_JSON, toPosition } from '@/lib/location';
import { Camera, MapView, Marker } from '@/lib/location/map';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';

export default function LocationManualScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const cameraRef = useRef<CameraRef>(null);
  const filtered = ALGERIAN_CITIES.filter(c => c.name.includes(query));
  const selectedCoords = selectedId ? coordsForCityId(selectedId) : null;

  // Recenter the preview whenever a new city is chosen.
  useEffect(() => {
    if (selectedCoords)
      cameraRef.current?.easeTo({ center: toPosition(selectedCoords), zoom: CITY_ZOOM, duration: 350 });
  }, [selectedCoords]);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('location.cities_title')}
        </Text>

        <Input
          placeholder={t('location.search_placeholder')}
          value={query}
          onChangeText={setQuery}
          suffix={<Search size={18} color={MUTED} />}
        />

        {/* Live map preview of the selected city */}
        <View style={styles.map} pointerEvents="none">
          <MapView
            mapStyle={MAP_STYLE_JSON}
            style={StyleSheet.absoluteFill}
            logo={false}
            attributionPosition={{ bottom: 4, left: 4 }}
            compass={false}
          >
            <Camera ref={cameraRef} center={toPosition(coordsForCityId('algiers'))} zoom={5} />
            {selectedCoords && (
              <Marker lngLat={toPosition(selectedCoords)} anchor="bottom">
                <View>
                  <MapPin size={32} color={PRIMARY} fill={PRIMARY} />
                </View>
              </Marker>
            )}
          </MapView>
          {!selected && (
            <View style={styles.mapHint}>
              <Text variant="caption" style={{ color: MUTED }}>
                {t('location.choose_city_hint')}
              </Text>
            </View>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={c => c.id}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.cityRow, selected === item.name && styles.cityRowSelected]}
              onPress={() => {
                setSelected(item.name);
                setSelectedId(item.id);
              }}
            >
              <MapPin size={16} color={selected === item.name ? PRIMARY : MUTED} />
              <Text
                variant="body"
                style={[styles.cityName, selected === item.name && styles.cityNameSelected]}
              >
                {item.name}
              </Text>
              <Text variant="caption" style={styles.wilaya}>
                {t('location.wilaya')}
                {' '}
                {item.wilaya}
              </Text>
            </Pressable>
          )}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />

        <Button
          variant="primary"
          label={t('location.confirm')}
          onPress={() => router.back()}
          disabled={!selected}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 14 },
  title: { textAlign: 'center', fontSize: 22 },

  map: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'hsl(180, 20%, 94%)',
  },
  mapHint: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
  },

  list: { flex: 1 },
  cityRow: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(198, 21%, 92%)',
  },
  cityRowSelected: { backgroundColor: 'hsl(258, 45%, 98%)' },
  cityName: { flex: 1, textAlign: textAlignStart, color: 'hsl(199, 41%, 12%)' },
  cityNameSelected: { color: PRIMARY, fontWeight: '600' },
  wilaya: { color: MUTED },
});
