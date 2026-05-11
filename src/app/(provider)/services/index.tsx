import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import * as React from 'react';
import { FlatList, Pressable, StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { MOCK_SERVICES } from '@/api/fixtures/services';
import type { Service } from '@/api/types';
import { useProviderStore } from '@/features/provider/use-provider-store';
import { EmptyCalendarIllustration } from '@/components/illustrations';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';

const PROVIDER_ID = 'p1';
const MY_SERVICES = MOCK_SERVICES.filter((s) => s.providerId === PROVIDER_ID);

export default function ServicesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isActive, toggleService } = useProviderStore();

  const renderService = ({ item }: { item: Service }) => {
    const active = isActive(item.id);
    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/(provider)/services/${item.id}` as any)}
      >
        <View style={styles.cardTop}>
          <Switch
            value={active}
            onValueChange={() => toggleService(item.id)}
            trackColor={{ false: 'hsl(198, 21%, 88%)', true: 'hsl(258, 52%, 72%)' }}
            thumbColor={active ? PRIMARY : '#fff'}
          />
          <Badge
            label={active ? t('provider.service_active') : t('provider.service_inactive')}
            variant={active ? 'success' : 'muted'}
          />
        </View>

        <Text variant="body" weight="semibold" numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text variant="caption" numberOfLines={2} style={styles.desc}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>
            {item.price.toLocaleString('ar-DZ')} د.ج
          </Text>
          <Text variant="caption" style={{ color: MUTED }}>
            ★ {item.rating} ({item.reviewCount})
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text variant="heading" weight="semibold" style={styles.heading}>
          {t('provider.my_services')}
        </Text>
      </View>

      {MY_SERVICES.length === 0 ? (
        <EmptyState
          illustration={<EmptyCalendarIllustration size={100} />}
          title="لا توجد خدمات بعد"
          body="أضيفي خدمتكِ الأولى لتبدأ في استقبال الطلبات"
          cta={{ label: t('provider.add_service'), onPress: () => router.push('/(provider)/services/new') }}
        />
      ) : (
        <>
          <FlatList
            data={MY_SERVICES}
            keyExtractor={(s) => s.id}
            renderItem={renderService}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
          <Pressable
            style={styles.fab}
            onPress={() => router.push('/(provider)/services/new')}
          >
            <Plus size={24} color="#fff" />
          </Pressable>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16 },
  heading: { textAlign: 'center', fontSize: 20 },
  list: { paddingHorizontal: 16, paddingBottom: 80 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { textAlign: 'right', color: DARK },
  desc: { textAlign: 'right', color: MUTED },
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'hsl(198, 21%, 88%)',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    start: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
