import { useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { SegmentedControl } from '@/components/wasla/segmented-control';
import { useBookingsStore } from '@/lib/stores/bookings';
import type { ChatThread } from '@/api/types';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';

export default function ProviderChatListScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [tab, setTab] = useState('all');
  const allThreads = useBookingsStore((s) => s.threads);

  const threads = tab === 'bookings'
    ? allThreads.filter((th) => !!th.bookingId)
    : allThreads;

  const renderThread = ({ item }: { item: ChatThread }) => (
    <Pressable
      style={styles.threadRow}
      onPress={() => router.push(`/(provider)/chat/${item.id}`)}
    >
      <View style={styles.threadLeft}>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
        <Text variant="caption" style={styles.timeText}>{item.lastMessageTime}</Text>
      </View>

      <View style={styles.threadCenter}>
        <Text variant="body" weight="semibold" numberOfLines={1} style={styles.name}>
          {item.providerName}
        </Text>
        <Text variant="caption" numberOfLines={1} style={styles.lastMessage}>
          {item.lastMessage}
        </Text>
      </View>

      <Avatar
        source={item.providerAvatar ? { uri: item.providerAvatar } : undefined}
        name={item.providerName}
        size={48}
        online={item.providerOnline}
      />
    </Pressable>
  );

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('chat.title')}
        </Text>
        <SegmentedControl
          segments={[
            { key: 'bookings', label: t('chat.bookings') },
            { key: 'all', label: t('chat.all') },
          ]}
          selected={tab}
          onChange={setTab}
        />
      </View>

      <FlatList
        data={threads}
        keyExtractor={(th) => th.id}
        renderItem={renderThread}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, gap: 12 },
  title: { textAlign: 'center', fontSize: 20 },
  list: { paddingHorizontal: 16 },

  threadRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  separator: { height: 4 },
  threadCenter: { flex: 1, gap: 4 },
  name: { textAlign: 'right', color: 'hsl(199, 41%, 12%)' },
  lastMessage: { textAlign: 'right', color: MUTED },
  threadLeft: { alignItems: 'flex-end', gap: 6 },
  timeText: { color: MUTED },
  unreadBadge: {
    backgroundColor: PRIMARY,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: { color: '#fff', fontSize: 11, fontFamily: 'Rubik', fontWeight: '600' },
});
