import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircle,
  MapPin,
  Mic,
  MoreVertical,
  Paperclip,
  Send,
  X,
} from 'lucide-react-native';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { MOCK_MESSAGES, MOCK_THREADS } from '@/api/fixtures/chats';
import type { Message } from '@/api/types';
import { formatTime } from '@/lib/format';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';
const ACCENT_BG = 'hsl(38, 92%, 96%)';
const ACCENT_FG = 'hsl(38, 92%, 35%)';

const PROVIDER_REPLIES = [
  'شكراً لتواصلكِ، سأرد عليكِ في أقرب وقت',
  'حسناً، سأتحقق من الجدول وأعلمكِ',
  'بالتأكيد، يسعدنا خدمتكِ',
  'تم استلام رسالتكِ، سأرد خلال ساعة',
];

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

export default function ChatRoomScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const { t } = useTranslation();
  const router = useRouter();

  const thread = MOCK_THREADS.find((th) => th.id === threadId);
  const [messages, setMessages] = useState<Message[]>(
    MOCK_MESSAGES[threadId ?? ''] ?? []
  );
  const [inputText, setInputText] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, scrollToEnd]);

  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text || isSending) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      threadId: threadId ?? '',
      senderId: 'customer',
      text,
      timestamp: formatTime(new Date()),
      isCustomer: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsSending(true);

    setTimeout(() => {
      const replyText =
        PROVIDER_REPLIES[Math.floor(Math.random() * PROVIDER_REPLIES.length)];
      const reply: Message = {
        id: `m-reply-${Date.now()}`,
        threadId: threadId ?? '',
        senderId: thread?.providerId ?? 'provider',
        text: replyText,
        timestamp: formatTime(new Date()),
        isCustomer: false,
      };
      setMessages((prev) => [...prev, reply]);
      setIsSending(false);
    }, 2000);
  }, [inputText, isSending, threadId, thread?.providerId]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isFirst = index === 0;
    const prevMsg = index > 0 ? messages[index - 1] : null;
    const showTimestamp = isFirst || prevMsg?.isCustomer !== item.isCustomer;

    return (
      <View style={styles.msgWrapper}>
        {showTimestamp && (
          <Text variant="caption" style={styles.timeLabel}>
            {item.timestamp}
          </Text>
        )}
        <View
          style={[
            styles.bubble,
            item.isCustomer ? styles.bubbleCustomer : styles.bubbleProvider,
          ]}
        >
          <Text
            variant="body"
            style={[
              styles.bubbleText,
              item.isCustomer ? styles.bubbleTextCustomer : styles.bubbleTextProvider,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  if (!thread) {
    return (
      <SafeAreaView style={styles.root}>
        <Text variant="body" style={{ textAlign: 'center', marginTop: 40, color: MUTED }}>
          {t('chat.not_found')}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn} hitSlop={8}>
          <MoreVertical size={20} color={DARK} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text variant="label" weight="semibold" style={styles.headerName} numberOfLines={1}>
            {thread.providerName}
          </Text>
          <Text variant="caption" style={[styles.headerStatus, thread.providerOnline && styles.headerStatusOnline]}>
            {thread.providerOnline ? t('chat.online') : t('chat.offline')}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Avatar
            source={thread.providerAvatar ? { uri: thread.providerAvatar } : undefined}
            name={thread.providerName}
            size={40}
            online={thread.providerOnline}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Pinned booking card */}
        {thread.bookingId && (
          <View style={styles.bookingCard}>
            <View style={styles.bookingCardInner}>
              <Badge
                label={t(STATUS_LABELS[thread.bookingStatus ?? 'pending'])}
                variant={STATUS_VARIANTS[thread.bookingStatus ?? 'pending']}
              />
              <Text variant="caption" style={styles.bookingLabel}>
                {t('chat.linked_booking')}
              </Text>
            </View>
          </View>
        )}

        {/* Safety banner */}
        <View style={styles.safetyBanner}>
          <AlertCircle size={14} color={ACCENT_FG} />
          <Text variant="caption" style={styles.safetyText} numberOfLines={2}>
            {t('chat.safety_tip')}
          </Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
        />

        {/* Quick actions panel */}
        {showActions && (
          <View style={styles.actionsPanel}>
            <Pressable style={styles.actionBtn} onPress={() => setShowActions(false)}>
              <MapPin size={20} color={PRIMARY} />
              <Text variant="caption" style={styles.actionLabel}>
                {t('chat.send_location')}
              </Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => setShowActions(false)}>
              <AlertCircle size={20} color={MUTED} />
              <Text variant="caption" style={styles.actionLabel}>
                {t('chat.reminder')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.actionBtnDestructive]}
              onPress={() => setShowActions(false)}
            >
              <X size={20} color="hsl(0, 84%, 60%)" />
              <Text variant="caption" style={[styles.actionLabel, { color: 'hsl(0, 84%, 60%)' }]}>
                {t('chat.report')}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          {/* Send button */}
          <Pressable style={styles.sendBtn} onPress={sendMessage} disabled={!inputText.trim()}>
            <Send size={18} color="#fff" />
          </Pressable>

          {/* Text input */}
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('chat.type_message')}
            placeholderTextColor={MUTED}
            multiline
            maxLength={500}
            textAlign={textAlignStart}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />

          {/* Left icons */}
          <View style={styles.inputIcons}>
            <Pressable hitSlop={8}>
              <Mic size={20} color={MUTED} />
            </Pressable>
            <Pressable hitSlop={8}>
              <Paperclip size={20} color={MUTED} />
            </Pressable>
            <Pressable onPress={() => setShowActions((v) => !v)} hitSlop={8}>
              <Text style={styles.plusIcon}>+</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'hsl(180, 25%, 98%)' },
  flex: { flex: 1 },

  header: {
    flexDirection: rowDirection,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 10,
  },
  headerRight: { flexDirection: rowDirection, alignItems: 'center', gap: 10 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerName: { color: DARK },
  headerStatus: { color: MUTED, fontSize: 12 },
  headerStatusOnline: { color: 'hsl(142, 71%, 40%)' },
  headerBtn: { padding: 4 },

  bookingCard: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bookingCardInner: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 10,
  },
  bookingLabel: { color: MUTED, flex: 1, textAlign: textAlignStart },

  safetyBanner: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: ACCENT_BG,
  },
  safetyText: { flex: 1, color: ACCENT_FG, textAlign: textAlignStart, fontSize: 12 },

  msgList: { padding: 16, gap: 4, paddingBottom: 8 },
  msgWrapper: { marginBottom: 8 },
  timeLabel: { textAlign: 'center', color: MUTED, marginBottom: 6, fontSize: 11 },

  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleCustomer: {
    alignSelf: 'flex-start',
    backgroundColor: PRIMARY,
    borderBottomStartRadius: 4,
  },
  bubbleProvider: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BORDER,
    borderBottomEndRadius: 4,
  },
  bubbleText: { textAlign: textAlignStart, lineHeight: 22 },
  bubbleTextCustomer: { color: '#fff' },
  bubbleTextProvider: { color: DARK },

  actionsPanel: {
    flexDirection: rowDirection,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'hsl(258, 45%, 97%)',
  },
  actionBtnDestructive: { backgroundColor: 'hsl(0, 84%, 97%)' },
  actionLabel: { color: PRIMARY, fontSize: 12 },

  inputBar: {
    flexDirection: rowDirection,
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'hsl(200, 20%, 97%)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: 'Rubik',
    fontSize: 15,
    color: DARK,
    maxHeight: 100,
    textAlignVertical: 'center',
  },
  inputIcons: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
    paddingBottom: 6,
  },
  plusIcon: {
    fontSize: 24,
    color: MUTED,
    fontFamily: 'Rubik',
    lineHeight: 28,
  },
});
