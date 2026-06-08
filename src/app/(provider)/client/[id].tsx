import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronBack } from '@/components/ui/directional-icon';
import { Text } from '@/components/ui/text';
import {
  CUSTOMER_CITIES,
  CUSTOMER_NAMES,
  SERVICE_NAMES,
} from '@/api/fixtures/bookings';
import { useBookingsStore } from '@/lib/stores/bookings';
import type { BookingStatus } from '@/api/types';
import { formatNumber } from '@/lib/format';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';

const PROVIDER_ID = 'p1';

const STATUS_VARIANTS: Record<BookingStatus, 'warning' | 'success' | 'muted' | 'destructive'> = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'muted',
  cancelled: 'destructive',
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'provider.clients_new',
  confirmed: 'provider.clients_current',
  completed: 'provider.clients_completed',
  cancelled: 'booking.status_cancelled',
};

export default function ProviderClientProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const customerId = id ?? '';

  const customerName = CUSTOMER_NAMES[customerId] ?? t('profile.role_customer');
  const customerCity = CUSTOMER_CITIES[customerId];

  const bookings = useBookingsStore((s) => s.bookings);
  const threads = useBookingsStore((s) => s.threads);

  const customerBookings = bookings
    .filter((b) => b.providerId === PROVIDER_ID && b.customerId === customerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const completedCount = customerBookings.filter((b) => b.status === 'completed').length;

  const chatThread = threads.find(
    (th) => customerBookings.some((b) => b.id === th.bookingId),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <ChevronBack size={24} color={PRIMARY} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          {t('provider.client_profile')}
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        style={styles.bg}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <Card style={styles.headerCard} elevated>
          <Avatar name={customerName} size={72} />
          <Text variant="heading" weight="semibold" style={styles.name}>
            {customerName}
          </Text>
          {customerCity && (
            <Text variant="caption" style={styles.city}>
              {customerCity}
            </Text>
          )}
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text variant="heading" weight="semibold" style={styles.statValue}>
              {customerBookings.length}
            </Text>
            <Text variant="caption" style={styles.statLabel}>
              {t('provider.client_total_bookings')}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text variant="heading" weight="semibold" style={[styles.statValue, { color: PRIMARY }]}>
              {completedCount}
            </Text>
            <Text variant="caption" style={styles.statLabel}>
              {t('provider.client_completed_bookings')}
            </Text>
          </Card>
        </View>

        {/* Contact */}
        {chatThread && (
          <Pressable
            style={styles.contactBtn}
            onPress={() => router.push(`/(provider)/chat/${chatThread.id}`)}
          >
            <MessageCircle size={18} color="#fff" />
            <Text variant="label" weight="semibold" style={styles.contactBtnText}>
              {t('provider.client_contact')}
            </Text>
          </Pressable>
        )}

        {/* Booking history */}
        <View style={styles.section}>
          <Text variant="label" weight="semibold" style={styles.sectionTitle}>
            {t('provider.client_history')}
          </Text>

          {customerBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingRow}>
              <View style={styles.bookingInfo}>
                <Text variant="body" weight="medium" numberOfLines={1} style={styles.bookingTitle}>
                  {SERVICE_NAMES[booking.serviceId] ?? t('common.service')}
                </Text>
                <Text variant="caption" style={styles.bookingDate}>
                  {booking.date} — {booking.time}
                </Text>
                <Text variant="caption" style={styles.bookingPrice}>
                  {formatNumber(booking.price)} {t('common.dzd')}
                </Text>
              </View>
              <Badge
                label={t(STATUS_LABELS[booking.status])}
                variant={STATUS_VARIANTS[booking.status]}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'hsl(180, 25%, 98%)' },
  bg: { flex: 1, backgroundColor: 'hsl(180, 25%, 98%)' },
  scrollContent: { paddingBottom: 32 },

  appBar: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  appBarTitle: { color: DARK, fontSize: 18 },

  headerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  name: { color: DARK, fontSize: 20, textAlign: 'center' },
  city: { color: MUTED, textAlign: 'center' },

  statsRow: {
    flexDirection: rowDirection,
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
  },
  statValue: { fontSize: 22, color: DARK },
  statLabel: { textAlign: 'center', color: MUTED, fontSize: 12 },

  contactBtn: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: PRIMARY,
  },
  contactBtnText: { color: '#fff' },

  section: { paddingHorizontal: 16, marginTop: 20, gap: 8 },
  sectionTitle: { textAlign: textAlignStart, color: DARK, fontSize: 16, marginBottom: 4 },

  bookingRow: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  bookingInfo: { flex: 1, gap: 3 },
  bookingTitle: { textAlign: textAlignStart, color: DARK },
  bookingDate: { textAlign: textAlignStart, color: MUTED, fontSize: 12 },
  bookingPrice: { textAlign: textAlignStart, color: PRIMARY, fontSize: 13 },
});
