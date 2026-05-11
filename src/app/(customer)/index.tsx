import { useRouter } from 'expo-router';
import { Bell, MapPin } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/ui/chip';
import { Screen } from '@/components/ui/screen';
import { ScreenSkeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { ServiceCard } from '@/components/wasla/service-card';
import { SearchBar } from '@/components/wasla/search-bar';
import { SegmentedControl } from '@/components/wasla/segmented-control';
import { CATEGORIES } from '@/api/fixtures/categories';
import { MOCK_PROVIDERS } from '@/api/fixtures/providers';
import { useServices, useFeaturedServices } from '@/api/services/use-services';
import { useAuthStore } from '@/features/auth/use-auth-store';

const PRIMARY = 'hsl(258, 52%, 54%)';

export default function CustomerHomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const profile = useAuthStore.use.profile();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const { data: services, isLoading } = useServices();
  const { data: featured } = useFeaturedServices();

  const hour = new Date().getHours();
  const greeting = hour < 12
    ? t('home.greeting_morning', { name: profile?.name?.split(' ')[0] ?? 'أختي' })
    : t('home.greeting_evening', { name: profile?.name?.split(' ')[0] ?? 'أختي' });

  const filteredServices = services?.filter(
    (s) => activeCategory === 'all' || s.categoryId === activeCategory,
  );

  return (
    <Screen scrollable edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingRow}>
          <Pressable
            onPress={() => router.push('/(shared)/notifications')}
            hitSlop={12}
          >
            <Bell size={24} color={PRIMARY} />
          </Pressable>
          <Text variant="heading" weight="semibold" style={styles.greeting}>
            {greeting}
          </Text>
        </View>

        {/* Category chips */}
        <FlatList
          data={[{ id: 'all', label: 'الكل', key: 'all', icon: '' }, ...CATEGORIES]}
          keyExtractor={(c) => c.id}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
          renderItem={({ item }) => (
            <Chip
              label={item.label}
              selected={activeCategory === item.id}
              onPress={() => setActiveCategory(item.id)}
            />
          )}
        />
      </View>

      {/* Sticky search bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder={t('home.search_placeholder')}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => router.push({ pathname: '/(customer)/search', params: { q: query } })}
          onFilterPress={() => {}}
        />
      </View>

      {/* View toggle */}
      <View style={styles.toggleContainer}>
        <SegmentedControl
          segments={[
            { key: 'map', label: t('home.map_view') },
            { key: 'list', label: t('home.list_view') },
          ]}
          selected="list"
          onChange={(k) => {
            if (k === 'map') router.push('/(customer)/map');
          }}
        />
      </View>

      <View style={styles.listContent}>
          {/* Featured */}
          {featured && featured.length > 0 && (
            <View>
              <Text variant="body" weight="semibold" style={styles.sectionTitle}>
                {t('home.featured_title')}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.featuredRow}>
                  {featured.map((s) => {
                    const provider = MOCK_PROVIDERS.find((p) => p.id === s.providerId);
                    return (
                      <View key={s.id} style={styles.featuredCard}>
                        <ServiceCard service={s} provider={provider} featured />
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Nearby services */}
          <View style={styles.sectionTitleRow}>
            <MapPin size={16} color={PRIMARY} />
            <Text variant="body" weight="semibold" style={styles.sectionTitle}>
              {t('home.nearby_title')}
            </Text>
          </View>

          {isLoading ? (
            <ScreenSkeleton variant="card-list" />
          ) : (
            filteredServices?.map((service) => {
              const provider = MOCK_PROVIDERS.find((p) => p.id === service.providerId);
              return <ServiceCard key={service.id} service={service} provider={provider} />;
            })
          )}
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, paddingTop: 8, gap: 12 },
  greetingRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: { fontSize: 22, color: 'hsl(199, 41%, 12%)', flex: 1, textAlign: 'right' },
  chipList: { gap: 8, paddingHorizontal: 4 },

  searchContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  toggleContainer: { paddingHorizontal: 16, paddingBottom: 12 },

  listContent: { paddingHorizontal: 16, gap: 4 },
  sectionTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginVertical: 4 },
  sectionTitle: { fontSize: 17, color: 'hsl(199, 41%, 12%)', textAlign: 'right' },
  featuredRow: { flexDirection: 'row-reverse', gap: 12, paddingVertical: 4 },
  featuredCard: { width: 280 },
});
