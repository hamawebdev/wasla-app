import { useRouter } from 'expo-router';
import { MapPin, Search } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { ALGERIAN_CITIES } from '@/api/fixtures/cities';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';

export default function LocationManualScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');

  const filtered = ALGERIAN_CITIES.filter((c) => c.name.includes(query));

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('location.cities_title')}
        </Text>

        <Input
          placeholder={t('location.search_placeholder')}
          value={query}
          onChangeText={setQuery}
          suffix={<Search size={18} color={MUTED} />}
        />

        {/* Static map placeholder */}
        <Card style={styles.map}>
          <MapPin size={32} color={PRIMARY} />
          <Text variant="caption" style={{ color: MUTED }}>
            {selected || 'اختاري مدينة من القائمة'}
          </Text>
        </Card>

        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.cityRow, selected === item.name && styles.cityRowSelected]}
              onPress={() => setSelected(item.name)}
            >
              <MapPin size={16} color={selected === item.name ? PRIMARY : MUTED} />
              <Text
                variant="body"
                style={[styles.cityName, selected === item.name && styles.cityNameSelected]}
              >
                {item.name}
              </Text>
              <Text variant="caption" style={styles.wilaya}>ولاية {item.wilaya}</Text>
            </Pressable>
          )}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />

        <Button
          variant="primary"
          label={t('location.confirm')}
          onPress={() => router.back()}
          disabled={!selected}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 14 },
  title: { textAlign: 'center', fontSize: 22 },

  map: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'hsl(180, 20%, 94%)',
    gap: 8,
  },

  list: { flex: 1 },
  cityRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'hsl(198, 21%, 92%)',
  },
  cityRowSelected: { backgroundColor: 'hsl(258, 45%, 98%)' },
  cityName: { flex: 1, textAlign: 'right', color: 'hsl(199, 41%, 12%)' },
  cityNameSelected: { color: PRIMARY, fontWeight: '600' },
  wilaya: { color: MUTED },
});
