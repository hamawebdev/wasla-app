import type { NativeSyntheticEvent } from 'react-native';
import type { LatLng, ReverseGeocodeResult } from '@/lib/location';
import type { CameraRef, PressEvent } from '@/lib/location/map';
import { useRouter } from 'expo-router';
import { Crosshair, MapPin } from 'lucide-react-native';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAddAddress } from '@/api/services/use-addresses';

import { Button } from '@/components/ui/button';
import { ChevronBack } from '@/components/ui/directional-icon';
import { Chip } from '@/components/ui/chip';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import {
  ALGIERS,
  CITY_ZOOM,
  fromLngLat,
  MAP_STYLE_JSON,
  reverseGeocode,
  STREET_ZOOM,
  toPosition,
  useDeviceLocation,
} from '@/lib/location';
import { Camera, MapView, Marker } from '@/lib/location/map';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const FOREGROUND = 'hsl(199, 41%, 12%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

type LabelType = 'home' | 'work' | 'other';

const LABEL_OPTIONS: { id: LabelType; text: string }[] = [
  { id: 'home', text: 'addresses.label_home' },
  { id: 'work', text: 'addresses.label_work' },
  { id: 'other', text: 'addresses.label_other' },
];

// Interactive map picker. Owns the device-location + reverse-geocode work and
// reports the chosen point (plus any resolved address) back to the parent. Kept
// separate so NewAddressScreen stays small.
function AddressMapPicker({
  pin,
  onPick,
}: {
  pin: LatLng;
  onPick: (point: LatLng, geo: ReverseGeocodeResult | null) => void;
}) {
  const { t } = useTranslation();
  const { request: requestLocation } = useDeviceLocation();
  const cameraRef = useRef<CameraRef>(null);
  const [geocoding, setGeocoding] = useState(false);

  const applyPoint = useCallback(
    async (point: LatLng) => {
      cameraRef.current?.easeTo({ center: toPosition(point), zoom: STREET_ZOOM, duration: 350 });
      setGeocoding(true);
      const geo = await reverseGeocode(point);
      setGeocoding(false);
      onPick(point, geo);
    },
    [onPick],
  );

  // Center on the user's real position on mount (best effort).
  useEffect(() => {
    requestLocation().then((coords) => {
      if (coords)
        applyPoint(coords);
    });
  }, [applyPoint, requestLocation]);

  const handleMapPress = (e: NativeSyntheticEvent<PressEvent>) => {
    applyPoint(fromLngLat(e.nativeEvent.lngLat));
  };

  const handleUseMyLocation = async () => {
    const coords = await requestLocation();
    if (coords)
      applyPoint(coords);
    else
      Alert.alert(t('map.location_denied'));
  };

  return (
    <View style={styles.mapPlaceholder}>
      <MapView
        mapStyle={MAP_STYLE_JSON}
        style={styles.mapImage}
        logo={false}
        attributionPosition={{ bottom: 4, left: 4 }}
        compass={false}
        onPress={handleMapPress}
        onLongPress={handleMapPress}
      >
        <Camera ref={cameraRef} center={toPosition(ALGIERS)} zoom={CITY_ZOOM} />
        <Marker lngLat={toPosition(pin)} anchor="bottom">
          <View>
            <MapPin size={36} color={PRIMARY} fill={PRIMARY} />
          </View>
        </Marker>
      </MapView>

      <Pressable style={styles.myLocationBtn} onPress={handleUseMyLocation} hitSlop={8}>
        <Crosshair size={20} color={PRIMARY} />
      </Pressable>

      <View style={styles.mapOverlay}>
        {geocoding
          ? (
              <View style={styles.mapOverlayRow}>
                <ActivityIndicator size="small" color="#fff" />
                <Text variant="caption" style={styles.mapLabel}>
                  {t('location.determining_address')}
                </Text>
              </View>
            )
          : (
              <Text variant="caption" style={styles.mapLabel}>
                {t('location.tap_map')}
              </Text>
            )}
      </View>
    </View>
  );
}

export default function NewAddressScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const addAddress = useAddAddress();

  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<LabelType>('home');
  const [pin, setPin] = useState<LatLng>(ALGIERS);

  // Stable callback so the picker's mount effect doesn't re-run. Only fills
  // empty fields so we never clobber what the user typed.
  const handlePick = useCallback((point: LatLng, geo: ReverseGeocodeResult | null) => {
    setPin(point);
    if (!geo)
      return;
    setFullAddress(prev => prev.trim() || geo.fullAddress);
    if (geo.city)
      setCity(prev => prev.trim() || geo.city!);
  }, []);

  const handleSave = () => {
    if (!fullAddress.trim()) {
      Alert.alert(t('common.error'), t('addresses.address_required'));
      return;
    }
    const selectedOpt = LABEL_OPTIONS.find(l => l.id === selectedLabel);
    addAddress.mutate(
      {
        label: selectedLabel,
        labelText: selectedOpt ? t(selectedOpt.text) : '',
        fullAddress: fullAddress.trim(),
        city: city.trim() || 'الجزائر العاصمة',
        // Real coordinates picked on the map.
        lat: pin.latitude,
        lng: pin.longitude,
        isDefault: false,
        notes: notes.trim() || undefined,
      },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronBack size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          {t('addresses.add_title')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AddressMapPicker pin={pin} onPick={handlePick} />

        {/* Form card */}
        <View style={styles.card}>
          <Input
            label={t('addresses.detailed_address')}
            value={fullAddress}
            onChangeText={setFullAddress}
            placeholder={t('addresses.detailed_address_ph')}
          />
          <Input
            label={t('addresses.city')}
            value={city}
            onChangeText={setCity}
            placeholder={t('addresses.city_ph')}
          />
          <Input
            label={t('booking.cancel_notes_label')}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('addresses.notes_ph')}
          />

          {/* Label selector */}
          <View style={styles.labelSection}>
            <Text variant="caption" weight="medium" style={styles.labelTitle}>
              {t('addresses.label_type')}
            </Text>
            <View style={styles.chipRow}>
              {LABEL_OPTIONS.map(opt => (
                <Chip
                  key={opt.id}
                  label={t(opt.text)}
                  selected={selectedLabel === opt.id}
                  onPress={() => setSelectedLabel(opt.id)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={t('addresses.save')}
          variant="primary"
          size="lg"
          loading={addAddress.isPending}
          onPress={handleSave}
          style={styles.saveBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  appBar: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: { padding: 4 },
  appBarTitle: { color: FOREGROUND, fontSize: 18 },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  mapPlaceholder: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: { width: '100%', height: '100%' },
  myLocationBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  mapOverlayRow: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapLabel: { color: '#fff', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  labelSection: { gap: 10 },
  labelTitle: { color: 'hsl(198, 15%, 45%)', textAlign: textAlignStart },
  chipRow: { flexDirection: rowDirection, gap: 8, flexWrap: 'wrap' },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  saveBtn: { width: '100%' },
});
