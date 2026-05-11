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
import { MOCK_BOOKINGS, PROVIDER_NAMES, SERVICE_NAMES } from '@/api/fixtures/bookings';
import type { Booking, BookingStatus } from '@/api/types';
import { EmptyCalendarIllustration } from '@/components/illustrations';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';
const SUCCESS = 'hsl(142, 71%, 45%)';
const DESTRUCTIVE = 'hsl(0, 84%, 60%)';

const CUSTOMER_NAMES: Record<string, string> = {
  customer: 'أميرة بن علي',
};

const STATUS_VARIANTS: Record<string, 'warning' | 'success' | 'muted' | 'destructive'> = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'muted',
  cancelled: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'جديدة',
  confirmed: 'الحالية',
  completed: 'مكتملة',
  cancelled: 'ملغية',
};

export default function ClientsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState('new');
  const [bookingStatuses, setBookingStatuses] = useState<Record<string, BookingStatus>>({});

  const getStatus = (b: Booking): BookingStatus =>
    (bookingStatuses[b.id] as BookingStatus) ?? b.status;

  const filtered = MOCK_BOOKINGS.filter((b) => {
    const status = getStatus(b);
    if (tab === 'new') return status === 'pending';
    if (tab === 'current') return status === 'confirmed';
    return status === 'completed' || status === 'cancelled';
  });

  const accept = (id: string) =>
    setBookingStatuses((prev) => ({ ...prev, [id]: 'confirmed' }));

  const reject = (id: string) =>
    setBookingStatuses((prev) => ({ ...prev, [id]: 'cancelled' }));

  const renderBooking = ({ item }: { item: Booking }) => {
    const status = getStatus(item);
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Avatar
            name={CUSTOMER_NAMES[item.customerId] ?? 'عميلة'}
            size={44}
          />
          <View style={styles.cardInfo}>
            <Text variant="body" weight="semibold" style={styles.customerName}>
              {CUSTOMER_NAMES[item.customerId] ?? 'عميلة'}
            </Text>
            <Text variant="caption" style={styles.serviceTitle} numberOfLines={1}>
              {SERVICE_NAMES[item.serviceId] ?? 'خدمة'}
            </Text>
            <Text variant="caption" style={{ color: MUTED, textAlign: 'right' }}>
              {item.date} — {item.time}
            </Text>
          </View>
          <Badge label={STATUS_LABELS[status]} variant={STATUS_VARIANTS[status]} />
        </View>

        {item.details && (
          <Text variant="caption" numberOfLines={2} style={styles.details}>
            {item.details}
          </Text>
        )}

        <View style={styles.priceRow}>
          <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>
            {item.price.toLocaleString('ar-DZ')} د.ج
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
          طلبات العملاء
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
          title="لا توجد طلبات"
          body="ستظهر هنا طلبات عملائكِ الجديدة"
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
  cardTop: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 12 },
  cardInfo: { flex: 1, gap: 3 },
  customerName: { textAlign: 'right', color: DARK },
  serviceTitle: { textAlign: 'right', color: MUTED },
  details: {
    textAlign: 'right',
    color: MUTED,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  priceRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: { flexDirection: 'row-reverse', gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  acceptBtn: { backgroundColor: SUCCESS },
  rejectBtn: { backgroundColor: 'hsl(0, 84%, 97%)', borderWidth: 1, borderColor: DESTRUCTIVE },
});
