import type { TrackingStatus } from '@/api/types';
import type { Bounds, LatLng } from '@/lib/location';
import type { CameraRef } from '@/lib/location/map';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowRight,
  Car,
  Check,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from 'lucide-react-native';
import * as React from 'react';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_BOOKINGS, PROVIDER_NAMES, SERVICE_NAMES } from '@/api/fixtures/bookings';

import { MOCK_PROVIDERS } from '@/api/fixtures/providers';
import { MOCK_SERVICES } from '@/api/fixtures/services';
import { Text } from '@/components/ui/text';
import {
  boundsForPoints,
  coordsForCityName,
  FOCUS_ZOOM,
  jitterAround,
  MAP_STYLE_JSON,
  toPosition,
} from '@/lib/location';
import { Camera, GeoJSONSource, Layer, MapView, Marker } from '@/lib/location/map';

const PRIMARY = 'hsl(258, 52%, 54%)';
const PRIMARY_SOFT = 'hsl(258, 45%, 96%)';
const PRIMARY_TINT = 'hsl(258, 45%, 88%)';
const DARK = 'hsl(199, 41%, 12%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BORDER = 'hsl(198, 21%, 88%)';
const SURFACE = 'hsl(180, 25%, 96%)';
const GOLD = 'hsl(38, 92%, 50%)';
const SOFT_BG = 'hsl(258, 35%, 92%)';
const DEMO_PHONE = '+213555000000';

const STEP_ORDER: TrackingStatus[] = ['accepted', 'on_the_way', 'arrived'];

function getInitial(name: string) {
  return name?.trim()?.[0] ?? '?';
}

// Map area: provider → destination route with a marker at each end.
function TrackMap({
  destination,
  providerPoint,
  bounds,
}: {
  destination: LatLng;
  providerPoint: LatLng;
  bounds: Bounds | null;
}) {
  const cameraRef = useRef<CameraRef>(null);

  const routeGeoJSON = useMemo(
    () => ({
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: [toPosition(providerPoint), toPosition(destination)],
      },
    }),
    [providerPoint, destination],
  );

  const fit = () => {
    if (bounds) {
      cameraRef.current?.fitBounds(bounds, {
        padding: { top: 100, right: 80, bottom: 320, left: 80 },
        duration: 0,
      });
    }
  };

  return (
    <MapView
      mapStyle={MAP_STYLE_JSON}
      style={styles.mapArea}
      logo={false}
      attributionPosition={{ top: 8, left: 8 }}
      compass={false}
      onDidFinishLoadingMap={fit}
    >
      <Camera ref={cameraRef} center={toPosition(destination)} zoom={FOCUS_ZOOM} />

      <GeoJSONSource id="route" data={routeGeoJSON} lineMetrics>
        <Layer
          id="route-line"
          type="line"
          layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          paint={{ 'line-color': PRIMARY, 'line-width': 4, 'line-dasharray': [2, 1.5] }}
        />
      </GeoJSONSource>

      {/* Destination marker (home) */}
      <Marker lngLat={toPosition(destination)} anchor="bottom">
        <View style={styles.markerCircle}>
          <Home size={20} color={GOLD} fill={GOLD} />
        </View>
      </Marker>

      {/* Provider marker (van) */}
      <Marker lngLat={toPosition(providerPoint)} anchor="center">
        <View style={styles.markerVan}>
          <Car size={22} color="#fff" />
        </View>
      </Marker>
    </MapView>
  );
}

export default function TrackScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
  const provider = booking ? MOCK_PROVIDERS.find(p => p.id === booking.providerId) : undefined;
  const service = booking ? MOCK_SERVICES.find(s => s.id === booking.serviceId) : undefined;

  const tracking: TrackingStatus = booking?.trackingStatus ?? 'on_the_way';
  const activeIndex = STEP_ORDER.indexOf(tracking);

  const providerName
    = provider?.name ?? PROVIDER_NAMES[booking?.providerId ?? ''] ?? 'مزود الخدمة';
  const serviceTitle
    = service?.title ?? SERVICE_NAMES[booking?.serviceId ?? ''] ?? 'الخدمة';

  const steps = useMemo(
    () => [
      { key: 'accepted' as const, label: t('booking.track_step_accepted'), Icon: Check },
      { key: 'on_the_way' as const, label: t('booking.track_step_on_the_way'), Icon: Car },
      { key: 'arrived' as const, label: t('booking.track_step_arrived'), Icon: MapPin },
    ],
    [t],
  );

  // Destination = customer address city; provider sits a few km away.
  // Coordinates are derived (mock data has none) but deterministic per booking.
  const destination = coordsForCityName(booking?.address);
  // When the provider has "arrived", collapse onto the destination.
  const providerPoint
    = tracking === 'arrived'
      ? destination
      : jitterAround(destination, booking?.providerId ?? bookingId ?? 'p', 5);
  const bounds = boundsForPoints([destination, providerPoint]);

  const handleChat = () => {
    router.push('/(customer)/chat/t1');
  };

  const handleCall = () => {
    Linking.openURL(`tel:${DEMO_PHONE}`).catch(() => {});
  };

  return (
    <View style={styles.root}>
      {/* Map area: real map with provider → destination route */}
      <TrackMap destination={destination} providerPoint={providerPoint} bounds={bounds} />

      {/* Header overlay */}
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.headerIcon}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
          >
            <ArrowRight size={22} color={PRIMARY} />
          </Pressable>
          <Text variant="heading" weight="semibold" style={styles.headerTitle}>
            {t('booking.track_title')}
          </Text>
          <View style={styles.headerIcon} />
        </View>
      </SafeAreaView>

      {/* Bottom card */}
      <View style={[styles.cardWrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.card}>
          <View style={styles.handle} />

          {/* Status header */}
          <View style={styles.statusBlock}>
            <Text variant="heading" weight="semibold" style={styles.statusTitle}>
              {t('booking.track_title')}
            </Text>
            <View style={styles.statusPill}>
              <Text variant="caption" weight="medium" style={styles.statusPillText}>
                {t(`booking.track_status_${tracking}`)}
              </Text>
            </View>
          </View>

          {/* Provider card */}
          <View style={styles.providerCard}>
            {provider?.avatar
              ? (
                  <Image source={{ uri: provider.avatar }} style={styles.providerAvatar} />
                )
              : (
                  <View style={[styles.providerAvatar, styles.providerInitialWrap]}>
                    <Text variant="heading" weight="semibold" style={styles.providerInitial}>
                      {getInitial(providerName)}
                    </Text>
                  </View>
                )}
            <View style={styles.providerInfo}>
              <Text variant="body" weight="semibold" numberOfLines={1} style={styles.providerName}>
                {providerName}
              </Text>
              <Text variant="caption" numberOfLines={1} style={styles.providerService}>
                {serviceTitle}
              </Text>
            </View>
            <View style={styles.ratingBox}>
              <Text variant="caption" style={styles.ratingLabel}>
                {t('booking.track_rating')}
              </Text>
              <View style={styles.ratingRow}>
                <Text variant="label" weight="bold" style={styles.ratingValue}>
                  {(provider?.rating ?? 4.8).toFixed(1)}
                </Text>
                <Star size={14} color={GOLD} fill={GOLD} />
              </View>
            </View>
          </View>

          {/* Progress stepper */}
          <View style={styles.stepperRow}>
            <View style={styles.stepperTrack} />
            <View
              style={[
                styles.stepperFill,
                { width: activeIndex === 0 ? '0%' : activeIndex === 1 ? '50%' : '100%' },
              ]}
            />
            {steps.map((step, idx) => {
              const reached = idx <= activeIndex;
              const isActive = idx === activeIndex;
              const isDone = idx < activeIndex;
              const StepIcon = step.Icon;
              return (
                <View key={step.key} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      isDone && styles.stepCircleDone,
                      isActive && styles.stepCircleActive,
                      !reached && styles.stepCirclePending,
                    ]}
                  >
                    <StepIcon
                      size={18}
                      color={isDone ? '#fff' : isActive ? PRIMARY : MUTED}
                    />
                  </View>
                  <Text
                    variant="caption"
                    weight={reached ? 'semibold' : 'regular'}
                    style={[styles.stepLabel, reached && styles.stepLabelActive]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable style={[styles.actionBtn, styles.actionSecondary]} onPress={handleChat}>
              <MessageCircle size={20} color={DARK} />
              <Text variant="body" weight="medium" style={{ color: DARK }}>
                {t('booking.track_chat')}
              </Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.actionPrimary]} onPress={handleCall}>
              <Phone size={20} color="#fff" />
              <Text variant="body" weight="medium" style={{ color: '#fff' }}>
                {t('booking.track_call')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SOFT_BG },

  mapArea: {
    ...StyleSheet.absoluteFillObject,
  },

  markerCircle: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 999,
    shadowColor: '#1a2d33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  markerVan: {
    backgroundColor: PRIMARY,
    padding: 10,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: PRIMARY_TINT,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(198, 21%, 92%)',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 12,
  },
  headerIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18 },

  cardWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
    shadowColor: '#1d1b20',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'hsl(198, 21%, 92%)',
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: BORDER,
    marginTop: 10,
  },

  statusBlock: { alignItems: 'center', gap: 6 },
  statusTitle: { fontSize: 22, color: DARK, textAlign: 'center' },
  statusPill: {
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPillText: { color: PRIMARY },

  providerCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  providerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SURFACE,
  },
  providerInitialWrap: {
    backgroundColor: 'hsl(258, 45%, 90%)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInitial: { color: PRIMARY, fontSize: 22 },
  providerInfo: { flex: 1, gap: 2 },
  providerName: { color: DARK, textAlign: 'right' },
  providerService: { color: MUTED, textAlign: 'right' },
  ratingBox: {
    alignItems: 'center',
    backgroundColor: SURFACE,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 2,
  },
  ratingLabel: { color: MUTED, fontSize: 11 },
  ratingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  ratingValue: { color: GOLD, fontSize: 14 },

  stepperRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'relative',
  },
  stepperTrack: {
    position: 'absolute',
    top: 16,
    left: '12%',
    right: '12%',
    height: 3,
    backgroundColor: BORDER,
    borderRadius: 999,
  },
  stepperFill: {
    position: 'absolute',
    top: 16,
    right: '12%',
    height: 3,
    backgroundColor: PRIMARY,
    borderRadius: 999,
  },
  stepItem: { alignItems: 'center', gap: 6, width: 80 },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  stepCircleDone: { backgroundColor: PRIMARY },
  stepCircleActive: {
    backgroundColor: PRIMARY_SOFT,
    borderWidth: 4,
    borderColor: PRIMARY_TINT,
  },
  stepCirclePending: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: BORDER,
  },
  stepLabel: { color: MUTED, textAlign: 'center', fontSize: 12 },
  stepLabelActive: { color: PRIMARY },

  actionsRow: { flexDirection: 'row-reverse', gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 12,
  },
  actionSecondary: { backgroundColor: PRIMARY_SOFT },
  actionPrimary: {
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});
