import { useRouter } from 'expo-router';
import type { TFunction } from 'i18next';
import {
  Bell,
  BellRing,
  Calendar,
  Info,
  MessageCircle,
  Tag,
  Trash2,
} from 'lucide-react-native';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Pressable,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';

import { ChevronBack } from '@/components/ui/directional-icon';
import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import { useDeleteNotification, useMarkAllRead, useNotifications } from '@/api/services/use-notifications';
import type { Notification } from '@/api/types';
import { formatDate } from '@/lib/format';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const MUTED = 'hsl(198, 15%, 45%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';

function typeIcon(type: Notification['type']) {
  const size = 20;
  switch (type) {
    case 'booking': return <Calendar size={size} color={PRIMARY} />;
    case 'message': return <MessageCircle size={size} color="hsl(258, 45%, 40%)" />;
    case 'promo': return <Tag size={size} color="hsl(41, 100%, 38%)" />;
    case 'system': return <Info size={size} color={MUTED} />;
  }
}

function typeBg(type: Notification['type']): string {
  switch (type) {
    case 'booking': return 'hsl(258, 45%, 93%)';
    case 'message': return 'hsl(258, 30%, 90%)';
    case 'promo': return 'hsl(41, 100%, 90%)';
    case 'system': return 'hsl(200, 20%, 94%)';
  }
}

function NotificationRow({ item }: { item: Notification }) {
  const { t } = useTranslation();
  const deleteNotif = useDeleteNotification();
  const swipeRef = useRef<Swipeable>(null);

  const renderRightActions = () => (
    <Pressable
      style={styles.deleteAction}
      onPress={() => {
        swipeRef.current?.close();
        deleteNotif.mutate(item.id);
      }}
    >
      <Trash2 size={22} color="#fff" />
    </Pressable>
  );

  return (
    <Swipeable ref={swipeRef} renderRightActions={renderRightActions} friction={2}>
      <View style={[styles.row, !item.read && styles.rowUnread]}>
        {!item.read && <View style={styles.unreadDot} />}
        <View style={[styles.iconCircle, { backgroundColor: typeBg(item.type) }]}>
          {typeIcon(item.type)}
        </View>
        <View style={styles.rowBody}>
          <Text variant="label" weight="medium" style={styles.rowTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text variant="caption" style={styles.rowDesc} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Text variant="caption" style={styles.timestamp}>
          {formatTime(t, item.timestamp)}
        </Text>
      </View>
    </Swipeable>
  );
}

function formatTime(t: TFunction, iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return t('notifications.time_now');
  if (diffH < 24) return t('notifications.time_hours', { count: diffH });
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return t('notifications.time_days', { count: diffD });
  return formatDate(iso);
}

function groupByDate(notifications: Notification[]) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, Notification[]> = {
    'notifications.today': [],
    'notifications.yesterday': [],
    'notifications.this_week': [],
  };

  for (const n of notifications) {
    const d = new Date(n.timestamp);
    const diffMs = today.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) groups['notifications.today'].push(n);
    else if (diffDays === 1) groups['notifications.yesterday'].push(n);
    else groups['notifications.this_week'].push(n);
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([titleKey, data]) => ({ titleKey, data }));
}

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAllRead = useMarkAllRead();

  const sections = groupByDate(notifications);
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronBack size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          {t('notifications.title')}
        </Text>
        {hasUnread ? (
          <Pressable onPress={() => markAllRead.mutate()} hitSlop={8}>
            <Text variant="caption" weight="medium" style={styles.markRead}>
              {t('notifications.mark_all_read')}
            </Text>
          </Pressable>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {notifications.length === 0 && !isLoading ? (
        <EmptyState
          illustration={<Bell size={64} color="hsl(198, 21%, 88%)" />}
          title={t('notifications.empty_title')}
          body={t('notifications.empty_body')}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section: { titleKey } }) => (
            <View style={styles.sectionHeader}>
              <Text variant="caption" weight="medium" style={styles.sectionTitle}>
                {t(titleKey)}
              </Text>
            </View>
          )}
          renderItem={({ item }) => <NotificationRow item={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
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
  markRead: { color: PRIMARY },
  list: { paddingBottom: 32 },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: BG,
  },
  sectionTitle: { color: MUTED, textAlign: textAlignStart },
  row: {
    flexDirection: rowDirection,
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  rowUnread: {
    borderRightWidth: 3,
    borderRightColor: PRIMARY,
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'hsl(0, 84%, 60%)',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, gap: 4 },
  rowTitle: { color: FOREGROUND, textAlign: textAlignStart },
  rowDesc: { color: MUTED, textAlign: textAlignStart },
  timestamp: { color: MUTED, flexShrink: 0, marginTop: 2 },
  separator: { height: 1, backgroundColor: BORDER },
  deleteAction: {
    backgroundColor: 'hsl(0, 84%, 60%)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
  },
});
