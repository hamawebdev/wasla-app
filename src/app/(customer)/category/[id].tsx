import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Brush,
  Calendar,
  Camera,
  Code,
  Cookie,
  GraduationCap,
  Home,
  Package,
  Scissors,
  Smartphone,
  Sparkles,
  Star,
  Utensils,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChevronBack } from '@/components/ui/directional-icon';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import { ServiceCard } from '@/components/wasla/service-card';
import { useSearchServices } from '@/api/services/use-services';
import { MOCK_PROVIDERS } from '@/api/fixtures/providers';
import type { SearchFilters } from '@/api/types';
import { rowDirection } from '@/lib/rtl';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  sewing: <Scissors size={32} color={PRIMARY} />,
  sweets: <Cookie size={32} color={PRIMARY} />,
  beauty: <Sparkles size={32} color={PRIMARY} />,
  events: <Calendar size={32} color={PRIMARY} />,
  phone_repair: <Smartphone size={32} color={PRIMARY} />,
  digital: <Code size={32} color={PRIMARY} />,
  cleaning: <Home size={32} color={PRIMARY} />,
  cooking: <Utensils size={32} color={PRIMARY} />,
  tuition: <GraduationCap size={32} color={PRIMARY} />,
  photography: <Camera size={32} color={PRIMARY} />,
};

type SortKey = 'distance' | 'rating' | 'price_asc' | 'price_desc';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'distance', label: 'search.sort_nearest' },
  { key: 'rating', label: 'search.sort_rating' },
  { key: 'price_asc', label: 'search.sort_price_low' },
  { key: 'price_desc', label: 'search.sort_price_high' },
];

export default function CategoryBrowseScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: categoryId } = useLocalSearchParams<{ id: string }>();
  const [sortBy, setSortBy] = useState<SortKey>('distance');

  const filters: SearchFilters = { categoryId: categoryId ?? '', sortBy };
  const { data: services = [], isLoading } = useSearchServices(filters);

  const hasCategory = !!categoryId && categoryId in CATEGORY_ICONS;
  const categoryName = hasCategory ? t(`categories.${categoryId}`) : t('home.browse_services');
  const categoryIcon = CATEGORY_ICONS[categoryId ?? ''] ?? <Package size={32} color={PRIMARY} />;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronBack size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          {categoryName}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Category hero */}
            <View style={styles.categoryHero}>
              {categoryIcon}
              <Text style={styles.heroTitle}>{categoryName}</Text>
            </View>

            {/* Sort chips — TODO: subcategories when schema supports them */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sortRow}
            >
              {SORT_OPTIONS.map((opt) => (
                <Chip
                  key={opt.key}
                  label={t(opt.label)}
                  selected={sortBy === opt.key}
                  onPress={() => setSortBy(opt.key)}
                />
              ))}
            </ScrollView>

            {/* Results count */}
            <View style={styles.countRow}>
              <Text variant="caption" style={{ color: MUTED }}>
                {t('categoryBrowse.results_count', { count: services.length })}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              illustration={<Package size={64} color="hsl(198, 21%, 88%)" />}
              title={t('categoryBrowse.empty_title')}
              body={t('categoryBrowse.empty_body')}
              cta={{ label: t('categoryBrowse.go_home'), onPress: () => router.push('/(customer)/') }}
            />
          ) : null
        }
        renderItem={({ item }) => {
          const provider = MOCK_PROVIDERS.find((p) => p.id === item.providerId);
          return <ServiceCard service={item} provider={provider} />;
        }}
      />
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
  list: { padding: 16, gap: 0, flexGrow: 1 },
  header: { gap: 16, marginBottom: 8 },
  categoryHero: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  heroTitle: {
    fontFamily: 'Rubik',
    fontSize: 26,
    fontWeight: '700',
    color: FOREGROUND,
    textAlign: 'center',
  },
  sortRow: { gap: 8, flexDirection: rowDirection },
  countRow: { alignItems: 'flex-end' },
});
