import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircle, MapPin, Mic, MoreVertical, Paperclip, Send, X } from 'lucide-react-native';
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
import { useBookingsStore } from '@/lib/stores/bookings';
import type { Message } from '@/api/types';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';
const ACCENT_BG = 'hsl(38, 92%, 96%)';
const ACCENT_FG = 'hsl(38, 92%, 35%)';

const CUSTOMER_REPLIES = [
  'شكراً على ردكِ السريع',
  'ممتاز، سأتحقق من ذلك',
  'هل يمكنكِ إرسال تفاصيل أكثر؟',
  'متى يمكنكِ البدء؟',
];

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

export default function ProviderChatRoomScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const { t } = useTranslation();
  const router = useRouter();

  const thread = useBookingsStore((s) => s.threads.find((th) => th.id === threadId));
  const initialMessages = useBookingsStore(
    (s) => s.messages[threadId ?? ''] ?? [],
  );
  const [messages, setMessages] = useState<Message[]>(initialMessages);
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
      senderId: 'provider',
      text,
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
      isCustomer: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsSending(true);

    setTimeout(() => {
      const replyText = CUSTOMER_REPLIES[Math.floor(Math.random() * CUSTOMER_REPLIES.length)];
      const reply: Message = {
        id: `m-reply-${Date.now()}`,
        threadId: threadId ?? '',
        senderId: 'customer',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
        isCustomer: true,
      };
      setMessages((prev) => [...prev, reply]);
      setIsSending(false);
    }, 2000);
  }, [inputText, isSending, threadId]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const prevMsg = index > 0 ? messages[index - 1] : null;
    const showTimestamp = index === 0 || prevMsg?.isCustomer !== item.isCustomer;
    // Provider sees their own messages as "not customer" → align right (RTL flex-start)
    // Customer messages → align left (RTL flex-end)
    const isOwnMsg = !item.isCustomer;
    return (
      <View style={styles.msgWrapper}>
        {showTimestamp && (
          <Text variant="caption" style={styles.timeLabel}>{item.timestamp}</Text>
        )}
        <View style={[styles.bubble, isOwnMsg ? styles.bubbleOwn : styles.bubbleOther]}>
          <Text variant="body" style={[styles.bubbleText, isOwnMsg ? styles.bubbleTextOwn : styles.bubbleTextOther]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  if (!thread) return null;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn} hitSlop={8}>
          <MoreVertical size={20} color={DARK} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text variant="label" weight="semibold" style={styles.headerName} numberOfLines={1}>
            عميلة — {thread.providerName}
          </Text>
          <Text variant="caption" style={[styles.headerStatus, thread.providerOnline && styles.statusOnline]}>
            {thread.providerOnline ? t('chat.online') : t('chat.offline')}
          </Text>
        </View>
        <Avatar
          source={thread.providerAvatar ? { uri: thread.providerAvatar } : undefined}
          name={thread.providerName}
          size={40}
          online={thread.providerOnline}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {thread.bookingId && (
          <View style={styles.bookingCard}>
            <Badge
              label={STATUS_LABELS[thread.bookingStatus ?? 'pending']}
              variant={STATUS_VARIANTS[thread.bookingStatus ?? 'pending']}
            />
            <Text variant="caption" style={styles.bookingLabel}>{t('chat.linked_booking')}</Text>
          </View>
        )}

        <View style={styles.safetyBanner}>
          <AlertCircle size={14} color={ACCENT_FG} />
          <Text variant="caption" style={styles.safetyText}>{t('chat.safety_tip')}</Text>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToEnd}
        />

        {showActions && (
          <View style={styles.actionsPanel}>
            <Pressable style={styles.actionBtn} onPress={() => setShowActions(false)}>
              <MapPin size={20} color={PRIMARY} />
              <Text variant="caption" style={{ color: PRIMARY }}>{t('chat.send_location')}</Text>
            </Pressable>
            <Pressable style={styles.actionBtn} onPress={() => setShowActions(false)}>
              <AlertCircle size={20} color={MUTED} />
              <Text variant="caption" style={{ color: MUTED }}>{t('chat.reminder')}</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, { backgroundColor: 'hsl(0,84%,97%)' }]} onPress={() => setShowActions(false)}>
              <X size={20} color="hsl(0,84%,60%)" />
              <Text variant="caption" style={{ color: 'hsl(0,84%,60%)' }}>{t('chat.report')}</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.inputBar}>
          <Pressable style={styles.sendBtn} onPress={sendMessage} disabled={!inputText.trim()}>
            <Send size={18} color="#fff" />
          </Pressable>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('chat.type_message')}
            placeholderTextColor={MUTED}
            multiline
            maxLength={500}
            textAlign="right"
          />
          <View style={styles.inputIcons}>
            <Pressable hitSlop={8}><Mic size={20} color={MUTED} /></Pressable>
            <Pressable hitSlop={8}><Paperclip size={20} color={MUTED} /></Pressable>
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 10,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerName: { color: DARK },
  headerStatus: { color: MUTED, fontSize: 12 },
  statusOnline: { color: 'hsl(142, 71%, 40%)' },
  headerBtn: { padding: 4 },
  bookingCard: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  bookingLabel: { color: MUTED, flex: 1, textAlign: 'right' },
  safetyBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: ACCENT_BG,
  },
  safetyText: { flex: 1, color: ACCENT_FG, textAlign: 'right', fontSize: 12 },
  msgList: { padding: 16, paddingBottom: 8 },
  msgWrapper: { marginBottom: 8 },
  timeLabel: { textAlign: 'center', color: MUTED, marginBottom: 6, fontSize: 11 },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  bubbleOwn: { alignSelf: 'flex-start', backgroundColor: PRIMARY, borderBottomStartRadius: 4 },
  bubbleOther: { alignSelf: 'flex-end', backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER, borderBottomEndRadius: 4 },
  bubbleText: { textAlign: 'right', lineHeight: 22 },
  bubbleTextOwn: { color: '#fff' },
  bubbleTextOther: { color: DARK },
  actionsPanel: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  actionBtn: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: 'hsl(258,45%,97%)' },
  inputBar: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 8,
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
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
  inputIcons: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, paddingHorizontal: 4, paddingBottom: 6 },
  plusIcon: { fontSize: 24, color: MUTED, fontFamily: 'Rubik', lineHeight: 28 },
});
