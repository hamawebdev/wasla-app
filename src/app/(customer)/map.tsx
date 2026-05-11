import { useRouter } from 'expo-router';
import { Locate, MapPin, X } from 'lucide-react-native';
import React, { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';

import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { useServices } from '@/api/services/use-services';
import type { Service } from '@/api/types';

const PRIMARY = 'hsl(258, 52%, 54%)';
const FOREGROUND = 'hsl(199, 41%, 12%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BORDER = 'hsl(198, 21%, 88%)';

// Derive deterministic mock coords from service id
function mockCoords(service: Service) {
  const seed = service.id.charCodeAt(service.id.length - 1);
  return {
    // Algiers city center area
    lat: 36.737 + (seed % 10) * 0.01,
    lng: 3.086 + (seed % 8) * 0.008,
  };
}

function CompactServiceCard({ service, onPress }: { service: Service; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.compactCard, pressed && { opacity: 0.9 }]}
    >
      <Image
        source={{ uri: service.images[0] }}
        style={styles.compactImage}
        resizeMode="cover"
      />
      <View style={styles.compactBody}>
        <Text variant="label" weight="semibold" numberOfLines={1} style={styles.compactTitle}>
          {service.title}
        </Text>
        <StarRating value={service.rating} size={12} showCount count={service.reviewCount} />
        <Badge
          label={`${service.priceFrom ? 'ابتداءً من ' : ''}${service.price.toLocaleString('ar-DZ')} د.ج`}
          variant="primary"
        />
      </View>
    </Pressable>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [130, 320, '80%'], []);

  const { data: services = [] } = useServices();

  const filtered = query
    ? services.filter((s) => s.title.includes(query) || s.city.includes(query))
    : services;

  return (
    <View style={styles.container}>
      {/* Map placeholder — TODO: replace with react-native-maps MapView when added */}
      <View style={styles.mapArea}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/algiers-map/800/1200' }}
          style={styles.mapImage}
          resizeMode="cover"
        />

        {/* Mock pin markers */}
        {filtered.slice(0, 6).map((service, idx) => {
          // Deterministic pixel offsets for mock pins
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          const leftPx = 60 + col * 100;
          const topPx = 120 + row * 140;
          return (
            <Pressable
              key={service.id}
              style={[styles.pin, { left: leftPx, top: topPx }]}
              onPress={() => router.push(`/(customer)/service/${service.id}`)}
            >
              <MapPin size={28} color={PRIMARY} fill={PRIMARY} />
            </Pressable>
          );
        })}
      </View>

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
            placeholder="ابحثي عن خدمة..."
            placeholderTextColor={MUTED}
            style={styles.searchInput}
            textAlign="right"
          />
        </View>
      </SafeAreaView>

      {/* Recenter button */}
      <Pressable style={styles.recenterBtn} onPress={() => {}}>
        <Locate size={22} color={PRIMARY} />
      </Pressable>

      {/* Bottom sheet with service cards */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handleIndicator}
      >
        {/* Collapsed: horizontal list */}
        <View style={styles.sheetHeader}>
          <Text variant="body" weight="semibold" style={styles.sheetTitle}>
            {filtered.length} خدمة قريبة منك
          </Text>
        </View>

        <FlatList
          data={filtered}
          horizontal
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.horizontalList}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CompactServiceCard
              service={item}
              onPress={() => router.push(`/(customer)/service/${item.id}`)}
            />
          )}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapArea: { flex: 1, position: 'relative' },
  mapImage: { width: '100%', height: '100%' },
  pin: { position: 'absolute' },

  searchWrapper: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchCard: {
    flexDirection: 'row-reverse',
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
  sheetTitle: { color: FOREGROUND, textAlign: 'right' },

  horizontalList: { paddingHorizontal: 16, gap: 12 },
  compactCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  compactImage: { width: '100%', aspectRatio: 4 / 3 },
  compactBody: { padding: 10, gap: 6 },
  compactTitle: { color: FOREGROUND, textAlign: 'right' },
});
