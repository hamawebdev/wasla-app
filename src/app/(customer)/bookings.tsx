import { useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { SegmentedControl } from '@/components/wasla/segmented-control';
import {
  MOCK_BOOKINGS,
  PROVIDER_NAMES,
  SERVICE_NAMES,
} from '@/api/fixtures/bookings';
import type { Booking } from '@/api/types';
import { EmptyCalendarIllustration } from '@/components/illustrations';

const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';
const PRIMARY = 'hsl(258, 52%, 54%)';

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const STATUS_VARIANTS: Record<string, 'warning' | 'success' | 'muted' | 'destructive'> = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'muted',
  cancelled: 'destructive',
};

const today = new Date('2026-05-10');

function isUpcoming(b: Booking) {
  return new Date(b.date) >= today && b.status !== 'completed' && b.status !== 'cancelled';
}

export default function BookingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState('upcoming');

  const upcoming = MOCK_BOOKINGS.filter(isUpcoming);
  const past = MOCK_BOOKINGS.filter((b) => !isUpcoming(b));
  const bookings = tab === 'upcoming' ? upcoming : past;

  const renderBooking = ({ item }: { item: Booking }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/(customer)/chat/t1`)}
    >
      <View style={styles.cardHeader}>
        <Badge
          label={STATUS_LABELS[item.status]}
          variant={STATUS_VARIANTS[item.status]}
        />
        <Text variant="caption" style={styles.date}>
          {item.date} — {item.time}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <Text variant="body" weight="semibold" numberOfLines={1} style={styles.serviceName}>
          {SERVICE_NAMES[item.serviceId] ?? 'خدمة'}
        </Text>
        <Text variant="caption" style={styles.providerName}>
          {PROVIDER_NAMES[item.providerId] ?? 'مزود الخدمة'}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        {item.address && (
          <Text variant="caption" numberOfLines={1} style={styles.address}>
            {item.address}
          </Text>
        )}
        <Text variant="label" weight="semibold" style={styles.price}>
          {item.price.toLocaleString('ar-DZ')} د.ج
        </Text>
      </View>

      {item.status === 'completed' && (
        <Pressable
          style={styles.reviewBtn}
          onPress={() => router.push(`/(customer)/review/${item.id}`)}
        >
          <Text variant="caption" weight="semibold" style={{ color: PRIMARY }}>
            {t('booking.add_review')}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('booking.my_bookings')}
        </Text>
        <SegmentedControl
          segments={[
            { key: 'upcoming', label: t('booking.upcoming') },
            { key: 'past', label: t('booking.past') },
          ]}
          selected={tab}
          onChange={setTab}
        />
      </View>

      {bookings.length === 0 ? (
        <EmptyState
          illustration={<EmptyCalendarIllustration size={120} />}
          title={tab === 'upcoming' ? t('empty.no_bookings_title') : t('empty.no_past_bookings')}
          body={tab === 'upcoming' ? t('empty.no_bookings_body') : ''}
          cta={
            tab === 'upcoming'
              ? {
                  label: t('home.browse_services'),
                  onPress: () => router.push('/(customer)/'),
                }
              : undefined
          }
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(b) => b.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, gap: 12 },
  title: { textAlign: 'center', fontSize: 20 },
  list: { paddingHorizontal: 16, paddingBottom: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: { color: MUTED },
  cardBody: { gap: 4 },
  serviceName: { textAlign: 'right', color: DARK },
  providerName: { textAlign: 'right', color: MUTED },
  cardFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
  },
  address: { flex: 1, color: MUTED, textAlign: 'right', marginStart: 12 },
  price: { color: 'hsl(258, 52%, 40%)' },
  reviewBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
});
