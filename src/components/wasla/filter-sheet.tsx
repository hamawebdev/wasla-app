import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { SearchFilters } from '@/api/types';
import { formatNumber } from '@/lib/format';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: Partial<SearchFilters>;
  onApply: (filters: Partial<SearchFilters>) => void;
}

export function FilterSheet({ isOpen, onClose, filters, onApply }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? 50000);
  const [maxDistance, setMaxDistance] = useState(filters.maxDistance ?? 50);
  const [minRating, setMinRating] = useState(filters.minRating ?? 0);

  const screenHeight = Dimensions.get('window').height;
  const snapPoints = useMemo(() => {
    const target = screenHeight < 700 ? '92%' : screenHeight < 900 ? '85%' : '70%';
    return [target];
  }, [screenHeight]);

  useEffect(() => {
    if (isOpen) {
      setMaxPrice(filters.maxPrice ?? 50000);
      setMaxDistance(filters.maxDistance ?? 50);
      setMinRating(filters.minRating ?? 0);
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [isOpen, filters.maxPrice, filters.maxDistance, filters.minRating]);

  const handleApply = useCallback(() => {
    onApply({
      maxPrice: maxPrice < 50000 ? maxPrice : undefined,
      maxDistance: maxDistance < 50 ? maxDistance : undefined,
      minRating: minRating > 0 ? minRating : undefined,
    });
  }, [maxPrice, maxDistance, minRating, onApply]);

  const handleReset = () => {
    setMaxPrice(50000);
    setMaxDistance(50);
    setMinRating(0);
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      onDismiss={onClose}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheet}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.container}>
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('search.filter')}
        </Text>

        <BottomSheetScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Price */}
        <View style={styles.section}>
          <Text variant="label" weight="medium" style={styles.sectionLabel}>
            {t('search.price_range')}
          </Text>
          <View style={styles.row}>
            <Text variant="caption" style={{ color: MUTED }}>{`${formatNumber(500)} ${t('common.dzd')}`}</Text>
            <Text variant="body" weight="semibold" style={{ color: PRIMARY }}>
              {maxPrice === 50000 ? t('common.all') : `${formatNumber(maxPrice)} ${t('common.dzd')}`}
            </Text>
            <Text variant="caption" style={{ color: MUTED }}>{`${formatNumber(50000)} ${t('common.dzd')}`}</Text>
          </View>
          <View style={styles.fakePriceSlider}>
            {[5000, 10000, 20000, 30000, 50000].map((v) => (
              <Pressable
                key={v}
                style={[styles.pricePip, maxPrice >= v && styles.pricePipActive]}
                onPress={() => setMaxPrice(v)}
                hitSlop={10}
                accessibilityRole="button"
              />
            ))}
          </View>
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <Text variant="label" weight="medium" style={styles.sectionLabel}>
            {t('search.distance')}
          </Text>
          <Text variant="body" weight="semibold" style={[styles.sliderVal, { color: PRIMARY }]}>
            {t('search.within_km', { km: maxDistance })}
          </Text>
          <View style={styles.fakeSlider}>
            {[1, 5, 10, 20, 50].map((v) => (
              <Pressable
                key={v}
                style={[styles.pip, maxDistance >= v && styles.pipActive]}
                onPress={() => setMaxDistance(v)}
                hitSlop={10}
                accessibilityRole="button"
              />
            ))}
          </View>
          <View style={styles.row}>
            {[1, 5, 10, 20, 50].map((v) => (
              <Text key={v} variant="caption" style={{ color: MUTED }}>{v}</Text>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text variant="label" weight="medium" style={styles.sectionLabel}>
            {t('search.rating')}
          </Text>
          {[4, 3, 2, 0].map((r) => (
            <Pressable
              key={r}
              style={styles.radioRow}
              onPress={() => setMinRating(r)}
              accessibilityRole="radio"
              accessibilityState={{ selected: minRating === r }}
            >
              <View style={[styles.radio, minRating === r && styles.radioActive]} />
              <Text variant="body" style={{ color: 'hsl(199, 41%, 12%)' }}>
                {r === 0 ? t('common.all') : t('search.rating_stars', { rating: r })}
              </Text>
            </Pressable>
          ))}
        </View>
        </BottomSheetScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Button variant="primary" label={t('common.apply')} onPress={handleApply} style={{ flex: 1 }} />
          <Button variant="ghost" label={t('common.reset')} onPress={handleReset} style={{ flex: 1 }} />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: { backgroundColor: '#fff', borderRadius: 20 },
  handle: { backgroundColor: 'hsl(198, 21%, 88%)', width: 40 },
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 16 },
  title: { textAlign: 'center', fontSize: 18, paddingTop: 12, paddingHorizontal: 20 },
  section: { gap: 10 },
  sectionLabel: { textAlign: textAlignStart, color: 'hsl(199, 41%, 12%)' },

  row: { flexDirection: rowDirection, justifyContent: 'space-between', alignItems: 'center' },
  sliderVal: { textAlign: 'center' },

  fakePriceSlider: { flexDirection: rowDirection, gap: 8, justifyContent: 'center' },
  pricePip: { width: 32, height: 8, borderRadius: 4, backgroundColor: 'hsl(200, 20%, 88%)' },
  pricePipActive: { backgroundColor: 'hsl(258, 52%, 54%)' },

  fakeSlider: { flexDirection: rowDirection, gap: 10, justifyContent: 'center' },
  pip: { width: 44, height: 8, borderRadius: 4, backgroundColor: 'hsl(200, 20%, 88%)' },
  pipActive: { backgroundColor: 'hsl(258, 52%, 54%)' },

  radioRow: { flexDirection: rowDirection, alignItems: 'center', gap: 12, minHeight: 40 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'hsl(198, 21%, 88%)',
  },
  radioActive: { borderColor: 'hsl(258, 52%, 54%)', backgroundColor: 'hsl(258, 52%, 54%)' },

  footer: {
    flexDirection: rowDirection,
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'hsl(198, 21%, 92%)',
    backgroundColor: '#fff',
  },
});
