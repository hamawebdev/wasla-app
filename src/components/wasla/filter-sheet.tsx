import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { SearchFilters } from '@/api/types';

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
  const sheetRef = useRef<React.ElementRef<typeof BottomSheet>>(null);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? 50000);
  const [maxDistance, setMaxDistance] = useState(filters.maxDistance ?? 10);
  const [minRating, setMinRating] = useState(filters.minRating ?? 0);

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

  if (!isOpen) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={['70%']}
      onClose={onClose}
      enablePanDownToClose
      index={0}
      backgroundStyle={styles.sheet}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('search.filter')}
        </Text>

        {/* Price */}
        <View style={styles.section}>
          <Text variant="label" weight="medium" style={styles.sectionLabel}>
            {t('search.price_range')}
          </Text>
          <View style={styles.row}>
            <Text variant="caption" style={{ color: MUTED }}>500 د.ج</Text>
            <Text variant="body" weight="semibold" style={{ color: PRIMARY }}>
              {maxPrice === 50000 ? 'الكل' : `${maxPrice.toLocaleString('ar-DZ')} د.ج`}
            </Text>
            <Text variant="caption" style={{ color: MUTED }}>50,000 د.ج</Text>
          </View>
          <View style={styles.fakePriceSlider}>
            {[5000, 10000, 20000, 30000, 50000].map((v) => (
              <View
                key={v}
                style={[styles.pricePip, maxPrice >= v && styles.pricePipActive]}
                onTouchEnd={() => setMaxPrice(v)}
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
              <View
                key={v}
                style={[styles.pip, maxDistance >= v && styles.pipActive]}
                onTouchEnd={() => setMaxDistance(v)}
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
            <View key={r} style={styles.radioRow}>
              <View
                style={[styles.radio, minRating === r && styles.radioActive]}
                onTouchEnd={() => setMinRating(r)}
              />
              <Text variant="body" style={{ color: 'hsl(199, 41%, 12%)' }}>
                {r === 0 ? 'الكل' : `${r}+ نجوم`}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Button variant="primary" label={t('common.apply')} onPress={handleApply} style={{ flex: 1 }} />
          <Button variant="ghost" label={t('common.reset')} onPress={handleReset} style={{ flex: 1 }} />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: { backgroundColor: '#fff', borderRadius: 20 },
  handle: { backgroundColor: 'hsl(198, 21%, 88%)', width: 40 },
  content: { padding: 20, gap: 16, flex: 1 },
  title: { textAlign: 'center', fontSize: 18 },
  section: { gap: 10 },
  sectionLabel: { textAlign: 'right', color: 'hsl(199, 41%, 12%)' },

  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  sliderVal: { textAlign: 'center' },

  fakePriceSlider: { flexDirection: 'row-reverse', gap: 8, justifyContent: 'center' },
  pricePip: { width: 32, height: 8, borderRadius: 4, backgroundColor: 'hsl(200, 20%, 88%)' },
  pricePipActive: { backgroundColor: 'hsl(258, 52%, 54%)' },

  fakeSlider: { flexDirection: 'row-reverse', gap: 10, justifyContent: 'center' },
  pip: { width: 44, height: 8, borderRadius: 4, backgroundColor: 'hsl(200, 20%, 88%)' },
  pipActive: { backgroundColor: 'hsl(258, 52%, 54%)' },

  radioRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, minHeight: 40 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'hsl(198, 21%, 88%)',
  },
  radioActive: { borderColor: 'hsl(258, 52%, 54%)', backgroundColor: 'hsl(258, 52%, 54%)' },

  footer: { flexDirection: 'row-reverse', gap: 10, marginTop: 'auto' },
});
