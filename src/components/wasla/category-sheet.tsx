import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import {
  BookOpen, Cake, Camera, ChefHat, MonitorSmartphone, Package, PartyPopper,
  Scissors, Search, Smartphone, Sparkles, Star, Wrench, X,
} from 'lucide-react-native';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { CATEGORIES } from '@/api/fixtures/categories';
import type { Category } from '@/api/types';

const PRIMARY = 'hsl(258, 52%, 54%)';
const PRIMARY_BG = 'hsl(258, 45%, 96%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Scissors, Cake, Wrench, Smartphone, PartyPopper, MonitorSmartphone,
  Sparkles, Star, ChefHat, BookOpen, Camera, Package,
};

interface Props {
  isOpen: boolean;
  selectedId?: string;
  onClose: () => void;
  onSelect: (categoryId: string | undefined) => void;
}

export function CategorySheet({ isOpen, selectedId, onClose, onSelect }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [query, setQuery] = useState('');

  const screenHeight = Dimensions.get('window').height;
  const snapPoints = useMemo(() => {
    const target = screenHeight < 700 ? '92%' : screenHeight < 900 ? '80%' : '72%';
    return [target];
  }, [screenHeight]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => c.label.includes(q));
  }, [query]);

  const handlePick = useCallback(
    (id: string | undefined) => {
      onSelect(id);
      onClose();
    },
    [onSelect, onClose],
  );

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
        <View style={styles.header}>
          <Text variant="heading" weight="semibold" style={styles.title}>
            {t('search.choose_category')}
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <Search size={18} color={MUTED} />
          <BottomSheetTextInput
            style={styles.searchInput}
            placeholder={t('search.search_categories')}
            placeholderTextColor={MUTED}
            value={query}
            onChangeText={setQuery}
            textAlign="right"
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={10}
              accessibilityLabel={t('common.clear')}
            >
              <X size={16} color={MUTED} />
            </Pressable>
          )}
        </View>

        <Pressable
          style={[styles.row, !selectedId && styles.rowActive]}
          onPress={() => handlePick(undefined)}
          accessibilityRole="radio"
          accessibilityState={{ selected: !selectedId }}
        >
          <View style={styles.iconBubble}>
            <Sparkles size={20} color={PRIMARY} />
          </View>
          <Text variant="body" weight="medium" style={styles.rowLabel}>
            {t('search.all_categories')}
          </Text>
          {!selectedId && <View style={styles.checkDot} />}
        </Pressable>

        <BottomSheetFlatList
          data={filtered}
          keyExtractor={(c: Category) => c.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 12) + 12 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text variant="body" style={styles.emptyText}>
                {t('search.no_categories_found')}
              </Text>
            </View>
          }
          renderItem={({ item }: { item: Category }) => {
            const Icon = ICON_MAP[item.icon] ?? Sparkles;
            const selected = selectedId === item.id;
            return (
              <Pressable
                style={[styles.row, selected && styles.rowActive]}
                onPress={() => handlePick(item.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <View style={styles.iconBubble}>
                  <Icon size={20} color={PRIMARY} />
                </View>
                <Text variant="body" style={styles.rowLabel}>
                  {item.label}
                </Text>
                {selected && <View style={styles.checkDot} />}
              </Pressable>
            );
          }}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: { backgroundColor: '#fff', borderRadius: 20 },
  handle: { backgroundColor: BORDER, width: 40 },
  container: { flex: 1 },

  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { textAlign: 'center', fontSize: 18, color: DARK },

  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Rubik',
    fontSize: 15,
    color: DARK,
    paddingVertical: 8,
    writingDirection: 'rtl',
  },

  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    borderRadius: 12,
    minHeight: 56,
  },
  rowActive: { backgroundColor: PRIMARY_BG },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_BG,
  },
  rowLabel: { color: DARK, flex: 1, textAlign: 'right' },
  checkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },

  listContent: { paddingTop: 4, gap: 2 },

  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { color: MUTED },
});
