import { useRouter } from 'expo-router';
import { CheckCircle, XCircle } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { SegmentedControl } from '@/components/wasla/segmented-control';
import { CUSTOMER_NAMES, SERVICE_NAMES } from '@/api/fixtures/bookings';
import { useBookingsStore } from '@/lib/stores/bookings';
import type { Booking } from '@/api/types';
import { EmptyCalendarIllustration } from '@/components/illustrations';
import { formatNumber } from '@/lib/format';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';
const SUCCESS = 'hsl(142, 71%, 45%)';
const DESTRUCTIVE = 'hsl(0, 84%, 60%)';

const STATUS_VARIANTS: Record<string, 'warning' | 'success' | 'muted' | 'destructive'> = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'muted',
  cancelled: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'provider.clients_new',
  confirmed: 'provider.clients_current',
  completed: 'provider.clients_completed',
  cancelled: 'booking.status_cancelled',
};

export default function ClientsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState('new');
  const bookings = useBookingsStore((s) => s.bookings);
  const acceptBooking = useBookingsStore((s) => s.acceptBooking);
  const rejectBooking = useBookingsStore((s) => s.rejectBooking);

  const filtered = bookings.filter((b) => {
    if (tab === 'new') return b.status === 'pending';
    if (tab === 'current') return b.status === 'confirmed';
    return b.status === 'completed' || b.status === 'cancelled';
  });

  const accept = (id: string) => {
    const threadId = acceptBooking(id);
    if (threadId) router.push(`/(provider)/chat/${threadId}` as any);
  };

  const reject = (id: string) => rejectBooking(id);

  const renderBooking = ({ item }: { item: Booking }) => {
    const status = item.status;
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Avatar
            name={CUSTOMER_NAMES[item.customerId] ?? t('profile.role_customer')}
            size={44}
          />
          <View style={styles.cardInfo}>
            <Text variant="body" weight="semibold" style={styles.customerName}>
              {CUSTOMER_NAMES[item.customerId] ?? t('profile.role_customer')}
            </Text>
            <Text variant="caption" style={styles.serviceTitle} numberOfLines={1}>
              {SERVICE_NAMES[item.serviceId] ?? t('common.service')}
            </Text>
            <Text variant="caption" style={{ color: MUTED, textAlign: textAlignStart }}>
              {item.date} — {item.time}
            </Text>
          </View>
          <Badge label={t(STATUS_LABELS[status])} variant={STATUS_VARIANTS[status]} />
        </View>

        {item.details && (
          <Text variant="caption" numberOfLines={2} style={styles.details}>
            {item.details}
          </Text>
        )}

        <View style={styles.priceRow}>
          <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>
            {formatNumber(item.price)} {t('common.dzd')}
          </Text>
        </View>

        {status === 'pending' && (
          <View style={styles.actions}>
            <Pressable style={[styles.actionBtn, styles.rejectBtn]} onPress={() => reject(item.id)}>
              <XCircle size={16} color={DESTRUCTIVE} />
              <Text variant="label" weight="semibold" style={{ color: DESTRUCTIVE }}>
                {t('provider.reject')}
              </Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, styles.acceptBtn]} onPress={() => accept(item.id)}>
              <CheckCircle size={16} color="#fff" />
              <Text variant="label" weight="semibold" style={{ color: '#fff' }}>
                {t('provider.accept')}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('provider.client_requests')}
        </Text>
        <SegmentedControl
          segments={[
            { key: 'new', label: t('provider.clients_new') },
            { key: 'current', label: t('provider.clients_current') },
            { key: 'done', label: t('provider.clients_completed') },
          ]}
          selected={tab}
          onChange={setTab}
        />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          illustration={<EmptyCalendarIllustration size={100} />}
          title={t('provider.no_requests_title')}
          body={t('provider.no_requests_body')}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(b) => b.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, gap: 12 },
  title: { textAlign: 'center', fontSize: 20 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTop: { flexDirection: rowDirection, alignItems: 'flex-start', gap: 12 },
  cardInfo: { flex: 1, gap: 3 },
  customerName: { textAlign: textAlignStart, color: DARK },
  serviceTitle: { textAlign: textAlignStart, color: MUTED },
  details: {
    textAlign: textAlignStart,
    color: MUTED,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  priceRow: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: { flexDirection: rowDirection, gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  acceptBtn: { backgroundColor: SUCCESS },
  rejectBtn: { backgroundColor: 'hsl(0, 84%, 97%)', borderWidth: 1, borderColor: DESTRUCTIVE },
});
