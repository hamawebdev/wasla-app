import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, SlidersHorizontal } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { BinocularsIllustration } from '@/components/illustrations';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { ScreenSkeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { ServiceCard } from '@/components/wasla/service-card';
import { SearchBar } from '@/components/wasla/search-bar';
import type { SearchFilters } from '@/api/types';
import { MOCK_PROVIDERS } from '@/api/fixtures/providers';
import { useSearchServices } from '@/api/services/use-services';
import { FilterSheet } from '@/components/wasla/filter-sheet';

const SORT_OPTIONS = [
  { key: 'distance', label: 'الأقرب' },
  { key: 'rating', label: 'الأعلى تقييماً' },
  { key: 'price_asc', label: 'السعر: الأقل' },
  { key: 'price_desc', label: 'السعر: الأعلى' },
];

export default function SearchScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; categoryId?: string }>();

  const [query, setQuery] = useState(params.q ?? '');
  const [sortBy, setSortBy] = useState<SearchFilters['sortBy']>('distance');
  const [filters, setFilters] = useState<Partial<SearchFilters>>({});
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilters: SearchFilters = {
    query,
    sortBy,
    categoryId: params.categoryId,
    ...filters,
  };

  const { data: results, isLoading } = useSearchServices(activeFilters);

  const activeChips = [
    sortBy !== 'distance' && { key: 'sort', label: SORT_OPTIONS.find((o) => o.key === sortBy)?.label ?? '' },
    filters.maxPrice && { key: 'price', label: `حتى ${filters.maxPrice?.toLocaleString('ar-DZ')} د.ج` },
    filters.maxDistance && { key: 'dist', label: `ضمن ${filters.maxDistance} كم` },
    filters.minRating && { key: 'rating', label: `${filters.minRating}+ نجوم` },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <Screen edges={['top', 'bottom']}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowRight size={22} color="hsl(199, 41%, 12%)" />
        </Pressable>
        <View style={styles.searchWrapper}>
          <SearchBar
            placeholder={t('home.search_placeholder')}
            value={query}
            onChangeText={setQuery}
            onFilterPress={() => setFilterOpen(true)}
          />
        </View>
      </View>

      {/* Sort + filter chips */}
      {activeChips.length > 0 && (
        <View style={styles.chipRow}>
          <FlatList
            data={activeChips}
            keyExtractor={(c) => c.key}
            horizontal
            inverted
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}
            renderItem={({ item }) => (
              <Chip
                label={item.label}
                selected
                onRemove={() => {
                  if (item.key === 'sort') setSortBy('distance');
                  else if (item.key === 'price') setFilters((f) => ({ ...f, maxPrice: undefined }));
                  else if (item.key === 'dist') setFilters((f) => ({ ...f, maxDistance: undefined }));
                  else if (item.key === 'rating') setFilters((f) => ({ ...f, minRating: undefined }));
                }}
              />
            )}
          />
        </View>
      )}

      {/* Sort row */}
      <View style={styles.sortRow}>
        <Pressable onPress={() => setFilterOpen(true)} style={styles.filterBtn}>
          <SlidersHorizontal size={18} color="hsl(258, 52%, 54%)" />
          <Text variant="label" style={styles.filterText}>{t('search.filter')}</Text>
        </Pressable>
        <View style={styles.sortChips}>
          {SORT_OPTIONS.map((opt) => (
            <Chip
              key={opt.key}
              label={opt.label}
              selected={sortBy === opt.key}
              onPress={() => setSortBy(opt.key as SearchFilters['sortBy'])}
            />
          ))}
        </View>
      </View>

      {/* Results */}
      {isLoading ? (
        <ScreenSkeleton variant="card-list" />
      ) : results?.length === 0 ? (
        <EmptyState
          illustration={<BinocularsIllustration size={120} />}
          title={t('search.no_results_title')}
          body={t('search.no_results_body')}
          cta={{ label: t('search.browse_all'), onPress: () => router.back(), variant: 'secondary' }}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(s) => s.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const provider = MOCK_PROVIDERS.find((p) => p.id === item.providerId);
            return <ServiceCard service={item} provider={provider} />;
          }}
        />
      )}

      <FilterSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={(f) => { setFilters(f); setFilterOpen(false); }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, padding: 12 },
  backBtn: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  searchWrapper: { flex: 1 },

  chipRow: { paddingHorizontal: 12 },
  chipList: { gap: 8, paddingVertical: 6 },

  sortRow: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8, gap: 8 },
  filterBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, minHeight: 36 },
  filterText: { color: 'hsl(258, 52%, 54%)' },
  sortChips: { flex: 1, flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6 },

  list: { padding: 16, paddingTop: 4 },
});
