import { useRouter } from 'expo-router';
import {
  Bell,
  CalendarDays,
  Clock,
  Edit3,
  Map,
  X,
} from 'lucide-react-native';
import * as React from 'react';
import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { SegmentedControl } from '@/components/wasla/segmented-control';
import { CancelBookingSheet } from '@/components/wasla/cancel-booking-sheet';
import {
  MOCK_BOOKINGS,
  PROVIDER_NAMES,
  SERVICE_NAMES,
} from '@/api/fixtures/bookings';
import { MOCK_SERVICES } from '@/api/fixtures/services';
import type { Booking } from '@/api/types';
import { EmptyCalendarIllustration } from '@/components/illustrations';
import { formatNumber } from '@/lib/format';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const ERROR = 'hsl(0, 84%, 56%)';
const ERROR_SOFT = 'hsl(0, 84%, 96%)';
const SURFACE = 'hsl(180, 25%, 98%)';

const STATUS_LABELS: Record<string, string> = {
  pending: 'booking.status_pending',
  confirmed: 'booking.status_confirmed',
  completed: 'booking.status_completed',
  cancelled: 'booking.status_cancelled',
};

const STATUS_VARIANTS: Record<string, 'warning' | 'success' | 'muted' | 'destructive'> = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'muted',
  cancelled: 'destructive',
};

type TabKey = 'upcoming' | 'current' | 'completed' | 'cancelled';

const TODAY_ISO = '2026-05-26';

function isCurrent(b: Booking) {
  return b.status === 'confirmed' && b.date === TODAY_ISO;
}

function tabMatches(b: Booking, tab: TabKey) {
  switch (tab) {
    case 'current':
      return isCurrent(b);
    case 'upcoming':
      return (b.status === 'pending' || b.status === 'confirmed') && !isCurrent(b);
    case 'completed':
      return b.status === 'completed';
    case 'cancelled':
      return b.status === 'cancelled';
  }
}

export default function BookingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const filtered = useMemo(() => bookings.filter((b) => tabMatches(b, tab)), [bookings, tab]);

  const handleConfirmCancel = (reason: string, notes?: string) => {
    if (!cancelTarget) return;
    setBookings((prev) =>
      prev.map((b) => (b.id === cancelTarget ? { ...b, status: 'cancelled' } : b)),
    );
    setCancelTarget(null);
    // reason/notes captured for future API call
    void reason;
    void notes;
  };

  const emptyCopy: Record<TabKey, { title: string; body?: string }> = {
    upcoming: {
      title: t('empty.no_bookings_title'),
      body: t('empty.no_bookings_body'),
    },
    current: { title: t('booking.no_current_bookings') },
    completed: { title: t('booking.no_completed_bookings') },
    cancelled: { title: t('booking.no_cancelled_bookings') },
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    const service = MOCK_SERVICES.find((s) => s.id === item.serviceId);
    const thumbnail = service?.images?.[0];

    return (
      <Pressable
        style={styles.card}
        onPress={() => router.push(`/(customer)/chat/t1`)}
      >
        <View style={styles.cardHead}>
          {thumbnail ? (
            <Image source={{ uri: thumbnail }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbFallback]} />
          )}
          <View style={styles.cardHeadText}>
            <View style={styles.cardHeadTopRow}>
              <Text variant="body" weight="semibold" numberOfLines={1} style={styles.serviceName}>
                {SERVICE_NAMES[item.serviceId] ?? service?.title ?? t('common.service')}
              </Text>
              <Badge
                label={t(STATUS_LABELS[item.status])}
                variant={STATUS_VARIANTS[item.status]}
              />
            </View>
            <Text variant="caption" numberOfLines={1} style={styles.providerName}>
              {PROVIDER_NAMES[item.providerId] ?? t('profile.role_provider')}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaGroup}>
            <View style={styles.metaItem}>
              <CalendarDays size={16} color={PRIMARY} />
              <Text variant="caption" style={styles.metaText}>{item.date}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Clock size={16} color={PRIMARY} />
              <Text variant="caption" style={styles.metaText}>{item.time}</Text>
            </View>
          </View>
          <Text variant="body" weight="semibold" style={styles.price}>
            {formatNumber(item.price)} {t('common.dzd')}
          </Text>
        </View>

        {item.status === 'confirmed' && (
          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.actionBtn, styles.actionDestructive]}
              onPress={(e) => {
                e.stopPropagation?.();
                setCancelTarget(item.id);
              }}
            >
              <X size={18} color={ERROR} />
              <Text variant="label" weight="medium" style={{ color: ERROR }}>
                {t('booking.action_cancel')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.actionPrimary]}
              onPress={(e) => {
                e.stopPropagation?.();
                router.push(`/(customer)/track/${item.id}`);
              }}
            >
              <Map size={18} color="#fff" />
              <Text variant="label" weight="medium" style={{ color: '#fff' }}>
                {t('booking.action_track')}
              </Text>
            </Pressable>
          </View>
        )}

        {item.status === 'pending' && (
          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.actionBtn, styles.actionNeutral]}
              onPress={(e) => {
                e.stopPropagation?.();
                router.push(`/(customer)/booking/${item.serviceId}/step-1`);
              }}
            >
              <Edit3 size={18} color={DARK} />
              <Text variant="label" weight="medium" style={{ color: DARK }}>
                {t('booking.action_edit_appointment')}
              </Text>
            </Pressable>
          </View>
        )}

        {item.status === 'completed' && (
          <Pressable
            style={styles.reviewBtn}
            onPress={(e) => {
              e.stopPropagation?.();
              router.push(`/(customer)/review/${item.id}`);
            }}
          >
            <Text variant="caption" weight="semibold" style={{ color: PRIMARY }}>
              {t('booking.add_review')}
            </Text>
          </Pressable>
        )}
      </Pressable>
    );
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'upcoming', label: t('booking.upcoming') },
    { key: 'current', label: t('booking.tab_current') },
    { key: 'completed', label: t('booking.tab_completed') },
    { key: 'cancelled', label: t('booking.tab_cancelled') },
  ];

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.push('/(shared)/notifications')}
          hitSlop={12}
          style={styles.headerIcon}
          accessibilityRole="button"
          accessibilityLabel={t('notifications.title')}
        >
          <Bell size={22} color={PRIMARY} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('booking.my_bookings')}
        </Text>
        <View style={styles.headerIcon} />
      </View>

      <View style={styles.tabsRow}>
        <SegmentedControl
          segments={tabs.map((tb) => ({ key: tb.key, label: tb.label }))}
          selected={tab}
          onChange={(key) => setTab(key as TabKey)}
        />
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          illustration={<EmptyCalendarIllustration size={120} />}
          title={emptyCopy[tab].title}
          body={emptyCopy[tab].body ?? ''}
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
          data={filtered}
          keyExtractor={(b) => b.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}

      <CancelBookingSheet
        isOpen={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { textAlign: 'center', fontSize: 20, flex: 1 },

  tabsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  list: { paddingHorizontal: 16, paddingBottom: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'hsl(198, 21%, 92%)',
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },

  cardHead: {
    flexDirection: rowDirection,
    alignItems: 'flex-start',
    gap: 12,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  thumbFallback: { backgroundColor: 'hsl(258, 45%, 96%)' },
  cardHeadText: { flex: 1, gap: 4 },
  cardHeadTopRow: {
    flexDirection: rowDirection,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  serviceName: { flex: 1, textAlign: textAlignStart, color: DARK },
  providerName: { textAlign: textAlignStart, color: MUTED },

  metaRow: {
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SURFACE,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaGroup: { flexDirection: rowDirection, alignItems: 'center', gap: 10 },
  metaItem: { flexDirection: rowDirection, alignItems: 'center', gap: 6 },
  metaText: { color: MUTED },
  metaDivider: { width: 1, height: 14, backgroundColor: BORDER },
  price: { color: PRIMARY, fontSize: 16 },

  actionsRow: { flexDirection: rowDirection, gap: 8 },
  actionBtn: {
    flex: 1,
    flexDirection: rowDirection,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 10,
  },
  actionDestructive: { backgroundColor: ERROR_SOFT },
  actionPrimary: { backgroundColor: PRIMARY },
  actionNeutral: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BORDER,
  },

  reviewBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
});
