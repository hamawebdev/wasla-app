import { useRouter } from 'expo-router';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronRight,
  CreditCard,
  MoreVertical,
  Plus,
  Smartphone,
  Wallet,
} from 'lucide-react-native';
import React from 'react';
import {
  Pressable,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/use-auth-store';
import {
  usePaymentMethods,
  useTransactions,
  useWalletBalance,
} from '@/api/services/use-wallet';
import type { WalletTransaction, PaymentMethod } from '@/api/types';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const BG = 'hsl(180, 25%, 98%)';
const BORDER = 'hsl(198, 21%, 88%)';
const SUCCESS = 'hsl(142, 71%, 35%)';
const DESTRUCTIVE = 'hsl(0, 84%, 50%)';

function paymentIcon(kind: PaymentMethod['kind']) {
  switch (kind) {
    case 'baridimob': return <Smartphone size={22} color={PRIMARY} />;
    case 'ccp': return <Wallet size={22} color={PRIMARY} />;
    case 'card': return <CreditCard size={22} color={PRIMARY} />;
    default: return <Wallet size={22} color={MUTED} />;
  }
}

function transactionIcon(type: WalletTransaction['type']) {
  switch (type) {
    case 'income': return <ArrowDownCircle size={22} color={SUCCESS} />;
    case 'topup': return <Plus size={22} color={PRIMARY} />;
    case 'expense': return <ArrowUpCircle size={22} color={MUTED} />;
    case 'withdrawal': return <ArrowUpCircle size={22} color={DESTRUCTIVE} />;
  }
}

function transactionColor(type: WalletTransaction['type']): string {
  if (type === 'income' || type === 'topup') return SUCCESS;
  if (type === 'withdrawal') return DESTRUCTIVE;
  return MUTED;
}

function transactionPrefix(type: WalletTransaction['type']): string {
  if (type === 'income' || type === 'topup') return '+';
  return '-';
}

function groupTransactionsByDate(txs: WalletTransaction[]) {
  const groups: Record<string, WalletTransaction[]> = {};
  for (const tx of txs) {
    const key = new Date(tx.date).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  }
  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

export default function WalletScreen() {
  const router = useRouter();
  const role = useAuthStore.use.role();
  const { data: balance = 0 } = useWalletBalance();
  const { data: transactions = [] } = useTransactions();
  const { data: paymentMethods = [] } = usePaymentMethods();

  const sections = groupTransactionsByDate(transactions);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronRight size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.appBarTitle}>
          المحفظة
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Balance card */}
            <View style={styles.balanceCard}>
              <Text variant="caption" style={styles.balanceLabel}>الرصيد المتاح</Text>
              <Text style={styles.balanceAmount}>
                {balance.toLocaleString('ar-DZ')} د.ج
              </Text>
              <View style={styles.actionRow}>
                <Button
                  label="شحن الرصيد"
                  variant="secondary"
                  size="md"
                  style={styles.actionBtn}
                  onPress={() => {}}
                />
                {role === 'provider' && (
                  <Button
                    label="سحب الأرباح"
                    variant="outline"
                    size="md"
                    style={[styles.actionBtn, styles.withdrawBtn]}
                    onPress={() => {}}
                  />
                )}
              </View>
            </View>

            {/* Payment methods */}
            <View style={styles.sectionCard}>
              <Text variant="body" weight="semibold" style={styles.sectionTitle}>
                طرق الدفع
              </Text>
              {paymentMethods.map((pm) => (
                <View key={pm.id} style={styles.pmRow}>
                  <Pressable style={styles.pmMoreBtn} hitSlop={12}>
                    <MoreVertical size={18} color={MUTED} />
                  </Pressable>
                  <View style={styles.pmBody}>
                    <Text variant="body" style={styles.pmLabel}>{pm.label}</Text>
                    {pm.last4 && (
                      <Text variant="caption" style={{ color: MUTED, textAlign: 'right' }}>
                        ••••{pm.last4}
                      </Text>
                    )}
                  </View>
                  <View style={styles.pmIconWrapper}>
                    {paymentIcon(pm.kind)}
                  </View>
                  {pm.isDefault && <Badge label="افتراضي" variant="success" />}
                </View>
              ))}
            </View>

            <Text variant="body" weight="semibold" style={styles.txTitle}>
              سجل المعاملات
            </Text>
          </View>
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.dateSectionHeader}>
            <Text variant="caption" style={styles.dateSectionTitle}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.txRow}>
            <View style={styles.txRight}>
              <Text
                variant="body"
                weight="semibold"
                style={{ color: transactionColor(item.type), textAlign: 'right' }}
              >
                {transactionPrefix(item.type)}{item.amount.toLocaleString('ar-DZ')} د.ج
              </Text>
              {item.status === 'pending' && (
                <Badge label="قيد المعالجة" variant="warning" />
              )}
            </View>
            <View style={styles.txBody}>
              <Text variant="body" style={styles.txDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.txIcon}>
              {transactionIcon(item.type)}
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  appBar: {
    flexDirection: 'row-reverse',
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
  list: { paddingBottom: 32 },
  header: { padding: 16, gap: 16 },

  balanceCard: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    padding: 24,
    gap: 8,
    alignItems: 'center',
  },
  balanceLabel: { color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  balanceAmount: {
    fontFamily: 'Rubik',
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  actionRow: { flexDirection: 'row-reverse', gap: 12, marginTop: 8 },
  actionBtn: { flex: 1 },
  withdrawBtn: { borderColor: '#fff' },

  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: { color: FOREGROUND, textAlign: 'right' },
  pmRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  pmIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'hsl(258, 45%, 96%)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pmBody: { flex: 1, gap: 2 },
  pmLabel: { color: FOREGROUND, textAlign: 'right' },
  pmMoreBtn: { padding: 4 },

  txTitle: { color: FOREGROUND, textAlign: 'right' },
  dateSectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: BG,
  },
  dateSectionTitle: { color: MUTED, textAlign: 'right' },
  txRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'hsl(258, 45%, 96%)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txBody: { flex: 1 },
  txDesc: { color: FOREGROUND, textAlign: 'right' },
  txRight: { gap: 4, alignItems: 'flex-end' },
  separator: { height: 1, backgroundColor: BORDER },
});
