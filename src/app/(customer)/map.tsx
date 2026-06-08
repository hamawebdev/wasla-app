import type { Service } from '@/api/types';
import type { LatLng } from '@/lib/location';
import type { CameraRef } from '@/lib/location/map';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { Locate, MapPin, X } from 'lucide-react-native';
import * as React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useServices } from '@/api/services/use-services';

import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { Text } from '@/components/ui/text';
import {
  ALGIERS,
  boundsForPoints,
  CITY_ZOOM,
  coordsForCityName,
  COUNTRY_ZOOM,
  FOCUS_ZOOM,
  forwardGeocode,
  jitterAround,
  MAP_STYLE_JSON,
  toPosition,
  useDeviceLocation,
} from '@/lib/location';
import { Camera, MapView, Marker } from '@/lib/location/map';
import { formatNumber } from '@/lib/format';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const FOREGROUND = 'hsl(199, 41%, 12%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BORDER = 'hsl(198, 21%, 88%)';

// Deterministic coordinate for a service: jitter around its city center so a
// given service always lands in the same place. Mock data has no real coords.
function coordsForService(service: Service): LatLng {
  return jitterAround(coordsForCityName(service.city), service.id);
}

function CompactServiceCard({
  service,
  selected,
  onPress,
}: {
  service: Service;
  selected: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.compactCard,
        selected && styles.compactCardSelected,
        pressed && { opacity: 0.9 },
      ]}
    >
      <Image source={{ uri: service.images[0] }} style={styles.compactImage} resizeMode="cover" />
      <View style={styles.compactBody}>
        <Text variant="label" weight="semibold" numberOfLines={1} style={styles.compactTitle}>
          {service.title}
        </Text>
        <StarRating value={service.rating} size={12} showCount count={service.reviewCount} />
        <Badge
          label={`${service.priceFrom ? `${t('common.starting_from')} ` : ''}${formatNumber(service.price)} ${t('common.dzd')}`}
          variant="primary"
        />
      </View>
    </Pressable>
  );
}

// Collapsed bottom sheet listing nearby services. Selecting a card focuses its
// marker via `onSelect`; the parent keeps the sheet/list refs.
function ServiceSheet({
  sheetRef,
  listRef,
  snapPoints,
  services,
  selectedId,
  onOpenService,
}: {
  sheetRef: React.RefObject<BottomSheet | null>;
  listRef: React.RefObject<FlatList<Service> | null>;
  snapPoints: (string | number)[];
  services: Service[];
  selectedId: string | null;
  onOpenService: (service: Service) => void;
}) {
  const { t } = useTranslation();
  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.sheetHeader}>
        <Text variant="body" weight="semibold" style={styles.sheetTitle}>
          {t('map.nearby', { count: services.length })}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={services}
        horizontal
        keyExtractor={item => item.id}
        contentContainerStyle={styles.horizontalList}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={() => {}}
        renderItem={({ item }) => (
          <CompactServiceCard
            service={item}
            selected={item.id === selectedId}
            onPress={() => onOpenService(item)}
          />
        )}
      />
    </BottomSheet>
  );
}

export default function MapScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const cameraRef = useRef<CameraRef>(null);
  const listRef = useRef<FlatList<Service>>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [130, 320, '80%'], []);
  const { request: requestLocation, status: locationStatus } = useDeviceLocation();

  const { data: services = [] } = useServices();

  const filtered = useMemo(
    () =>
      query
        ? services.filter(s => s.title.includes(query) || s.city.includes(query))
        : services,
    [services, query],
  );

  // Each service gets a stable coordinate keyed by its id.
  const points = useMemo(
    () => filtered.map(s => ({ service: s, point: coordsForService(s) })),
    [filtered],
  );

  // Bounds across all services, used to frame the map once it loads.
  const allBounds = useMemo(() => boundsForPoints(services.map(coordsForService)), [services]);

  const fitAll = useCallback(() => {
    if (allBounds) {
      cameraRef.current?.fitBounds(allBounds, {
        padding: { top: 64, right: 64, bottom: 360, left: 64 },
        duration: 0,
      });
    }
  }, [allBounds]);

  const focusService = useCallback((service: Service, index: number) => {
    setSelectedId(service.id);
    cameraRef.current?.easeTo({ center: toPosition(coordsForService(service)), zoom: FOCUS_ZOOM, duration: 350 });
    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleRecenter = useCallback(async () => {
    const coords = await requestLocation();
    if (coords)
      cameraRef.current?.easeTo({ center: toPosition(coords), zoom: FOCUS_ZOOM, duration: 400 });
    else
      showMessage({ message: t('map.location_denied'), type: 'warning' });
  }, [requestLocation]);

  const handleSearchSubmit = useCallback(async () => {
    const q = query.trim();
    if (!q)
      return;
    setSearching(true);
    // Prefer geocoding the typed text to recenter the map; the list filters live.
    const geo = await forwardGeocode(q);
    setSearching(false);
    if (geo)
      cameraRef.current?.flyTo({ center: toPosition(geo), zoom: CITY_ZOOM, duration: 600 });
    else if (filtered.length === 0)
      showMessage({ message: t('map.no_search_results'), type: 'info' });
  }, [query, filtered.length]);

  return (
    <View style={styles.container}>
      <MapView
        mapStyle={MAP_STYLE_JSON}
        style={StyleSheet.absoluteFill}
        logo={false}
        attributionPosition={{ bottom: 8, left: 8 }}
        compass={false}
        onDidFinishLoadingMap={fitAll}
      >
        <Camera ref={cameraRef} center={toPosition(ALGIERS)} zoom={COUNTRY_ZOOM} />

        {points.map(({ service, point }, idx) => {
          const isSelected = service.id === selectedId;
          return (
            <Marker
              key={service.id}
              id={service.id}
              lngLat={toPosition(point)}
              anchor="bottom"
              onPress={() => focusService(service, idx)}
            >
              <View>
                <MapPin
                  size={isSelected ? 38 : 30}
                  color={PRIMARY}
                  fill={isSelected ? PRIMARY : '#fff'}
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Floating search bar */}
      <SafeAreaView style={styles.searchWrapper} edges={['top']}>
        <View style={styles.searchCard}>
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={12}>
              <X size={18} color={MUTED} />
            </Pressable>
          )}
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            placeholder={t('map.search_placeholder')}
            placeholderTextColor={MUTED}
            style={styles.searchInput}
            textAlign={textAlignStart}
          />
        </View>
      </SafeAreaView>

      {/* Recenter button */}
      <Pressable
        style={styles.recenterBtn}
        onPress={handleRecenter}
        disabled={locationStatus === 'loading' || searching}
      >
        <Locate size={22} color={PRIMARY} />
      </Pressable>

      <ServiceSheet
        sheetRef={bottomSheetRef}
        listRef={listRef}
        snapPoints={snapPoints}
        services={filtered}
        selectedId={selectedId}
        onOpenService={service => router.push(`/(customer)/service/${service.id}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  searchWrapper: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchCard: {
    flexDirection: rowDirection,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Rubik',
    fontSize: 15,
    color: FOREGROUND,
  },

  recenterBtn: {
    position: 'absolute',
    left: 16,
    bottom: 160,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 10,
  },

  sheetBg: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  handleIndicator: { backgroundColor: BORDER, width: 40 },
  sheetHeader: { paddingHorizontal: 16, paddingVertical: 10 },
  sheetTitle: { color: FOREGROUND, textAlign: textAlignStart },

  horizontalList: { paddingHorizontal: 16, gap: 12 },
  compactCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  compactCardSelected: { borderColor: PRIMARY, borderWidth: 2 },
  compactImage: { width: '100%', aspectRatio: 4 / 3 },
  compactBody: { padding: 10, gap: 6 },
  compactTitle: { color: FOREGROUND, textAlign: textAlignStart },
});
