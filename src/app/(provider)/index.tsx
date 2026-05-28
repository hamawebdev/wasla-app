import { useRouter } from 'expo-router';
import { ChevronLeft, Star, TrendingUp, Users } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { CUSTOMER_NAMES, SERVICE_NAMES } from '@/api/fixtures/bookings';
import { useBookingsStore } from '@/lib/stores/bookings';
import type { Booking } from '@/api/types';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const DESTRUCTIVE = 'hsl(0, 84%, 60%)';
const BORDER = 'hsl(198, 21%, 88%)';

const PROVIDER_ID = 'p1';
const LATEST_LIMIT = 3;

const TODAY = new Date('2026-05-10');
const ARABIC_DAYS = ['أ', 'ث', 'ر', 'خ', 'ج', 'س', 'أ'];
const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - TODAY.getDay() + i);
  return { day: ARABIC_DAYS[i], date: d.getDate(), isToday: d.getDate() === TODAY.getDate() };
});

export default function ProviderDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const bookings = useBookingsStore((s) => s.bookings);

  const pendingForProvider = bookings.filter(
    (b) => b.providerId === PROVIDER_ID && b.status === 'pending',
  );
  const pendingCount = pendingForProvider.length;
  const latestReservations = [...pendingForProvider]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, LATEST_LIMIT);

  const renderReservation = (booking: Booking) => {
    const customerName = CUSTOMER_NAMES[booking.customerId] ?? 'عميلة';
    return (
      <Pressable
        key={booking.id}
        style={styles.reservationRow}
        onPress={() => router.push(`/(provider)/client/${booking.customerId}` as any)}
      >
        <Avatar name={customerName} size={40} />
        <View style={styles.reservationInfo}>
          <Text variant="body" weight="semibold" numberOfLines={1} style={styles.customerName}>
            {customerName}
          </Text>
          <Text variant="caption" numberOfLines={1} style={styles.serviceName}>
            {SERVICE_NAMES[booking.serviceId] ?? 'خدمة'}
          </Text>
          <Text variant="caption" style={styles.dateTime}>
            {booking.date} — {booking.time}
          </Text>
        </View>
        <View style={styles.reservationTrailing}>
          <Badge label={t('provider.clients_new')} variant="warning" />
          <ChevronLeft size={16} color={MUTED} />
        </View>
      </Pressable>
    );
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="heading" weight="semibold" style={styles.greeting}>
            {t('provider.dashboard_title')}
          </Text>
          <Text variant="caption" style={styles.subtitle}>أم رشيد</Text>
        </View>
        {pendingCount > 0 && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>{pendingCount}</Text>
          </View>
        )}
      </View>

      {/* Stat cards */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard} elevated>
          <Users size={20} color={DESTRUCTIVE} />
          <Text variant="heading" weight="semibold" style={[styles.statValue, { color: DESTRUCTIVE }]}>
            {pendingCount}
          </Text>
          <Text variant="caption" style={styles.statLabel}>{t('provider.new_bookings')}</Text>
        </Card>

        <Card style={styles.statCard} elevated>
          <Star size={20} color="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" />
          <Text variant="heading" weight="semibold" style={[styles.statValue, { color: 'hsl(38, 92%, 35%)' }]}>
            4.9
          </Text>
          <Text variant="caption" style={styles.statLabel}>{t('provider.overall_rating')}</Text>
        </Card>

        <Card style={styles.statCard} elevated>
          <TrendingUp size={20} color={PRIMARY} />
          <Text variant="heading" weight="semibold" style={[styles.statValue, { color: PRIMARY }]}>
            38k
          </Text>
          <Text variant="caption" style={styles.statLabel}>{t('provider.monthly_earnings')}</Text>
        </Card>
      </View>

      {/* Weekly calendar strip */}
      <Card style={styles.calendarCard}>
        <Text variant="label" weight="semibold" style={styles.sectionTitle}>
          أوقات الإتاحة هذا الأسبوع
        </Text>
        <View style={styles.weekStrip}>
          {WEEK_DAYS.map((d) => (
            <View key={d.date} style={[styles.dayCol, d.isToday && styles.dayColToday]}>
              <Text variant="caption" style={[styles.dayLabel, d.isToday && { color: '#fff' }]}>
                {d.day}
              </Text>
              <Text variant="caption" style={[styles.dayNum, d.isToday && { color: '#fff' }]}>
                {d.date}
              </Text>
            </View>
          ))}
        </View>
        <Pressable
          style={styles.clientsBtn}
          onPress={() => router.push('/(provider)/clients')}
        >
          <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>
            عرض الطلبات الجديدة ({pendingCount})
          </Text>
        </Pressable>
      </Card>

      {/* Latest reservations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="label" weight="semibold" style={styles.sectionTitle}>
            {t('provider.latest_reservations')}
          </Text>
        </View>

        {latestReservations.length === 0 ? (
          <Text variant="caption" style={styles.emptyText}>
            {t('provider.no_new_reservations')}
          </Text>
        ) : (
          latestReservations.map(renderReservation)
        )}

        <Pressable
          style={styles.showAllBtn}
          onPress={() => router.push('/(provider)/clients')}
        >
          <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>
            {t('provider.show_all_reservations')}
          </Text>
        </Pressable>
      </View>

      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 12,
  },
  headerText: { alignItems: 'flex-end', gap: 2 },
  greeting: { textAlign: 'right', color: DARK, fontSize: 18 },
  subtitle: { color: MUTED, textAlign: 'right' },
  newBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DESTRUCTIVE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBadgeText: { color: '#fff', fontSize: 13, fontFamily: 'Rubik', fontWeight: '700' },

  statsRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    padding: 12,
  },
  statValue: { fontSize: 22, color: DARK },
  statLabel: { textAlign: 'center', color: MUTED, fontSize: 11 },

  calendarCard: { marginHorizontal: 16, gap: 12, marginBottom: 12 },
  weekStrip: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  dayColToday: { backgroundColor: PRIMARY },
  dayLabel: { color: MUTED, fontSize: 11 },
  dayNum: { color: DARK, fontFamily: 'Rubik', fontSize: 14 },
  clientsBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  section: { paddingHorizontal: 16, gap: 8 },
  sectionHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { textAlign: 'right', color: DARK, fontSize: 16, marginBottom: 4 },
  emptyText: { textAlign: 'center', color: MUTED, padding: 20 },

  reservationRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  reservationInfo: { flex: 1, gap: 2 },
  customerName: { textAlign: 'right', color: DARK },
  serviceName: { textAlign: 'right', color: MUTED },
  dateTime: { textAlign: 'right', color: MUTED, fontSize: 11 },
  reservationTrailing: { alignItems: 'flex-end', gap: 6 },

  showAllBtn: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: PRIMARY,
    backgroundColor: '#fff',
  },
});
