import { useRouter } from 'expo-router';
import { Briefcase, Search } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import type { SeedAccount } from '@/features/auth/seed-accounts';
import { SEED_ACCOUNTS } from '@/features/auth/seed-accounts';
import {
  setProfile,
  setRole,
  setSetupComplete,
  signIn,
} from '@/features/auth/use-auth-store';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';

export default function AccountPickerScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handlePick = (account: SeedAccount) => {
    setRole(account.role);
    setProfile(account.profile);
    if (account.role === 'provider') {
      setSetupComplete();
    }
    signIn({ access: 'mock-token', refresh: 'mock-refresh' });
    router.replace(account.role === 'provider' ? '/(provider)/' : '/(customer)/');
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="heading" weight="semibold" style={styles.appName}>
            {t('common.app_name')}
          </Text>
          <Text variant="body" style={styles.title}>
            {t('account_picker.title')}
          </Text>
          <Text variant="body" style={styles.subtitle}>
            {t('account_picker.subtitle')}
          </Text>
        </View>

        <View style={styles.cards}>
          {SEED_ACCOUNTS.map((account) => (
            <AccountOption
              key={account.id}
              account={account}
              roleLabel={t(`account_picker.${account.role}_label`)}
              onPress={() => handlePick(account)}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

interface AccountOptionProps {
  account: SeedAccount;
  roleLabel: string;
  onPress: () => void;
}

function AccountOption({ account, roleLabel, onPress }: AccountOptionProps) {
  const Icon = account.role === 'customer' ? Search : Briefcase;
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card style={styles.accountCard}>
        <View style={styles.accountRow}>
          <Avatar
            source={
              account.profile.avatar ? { uri: account.profile.avatar } : undefined
            }
            name={account.profile.name}
            size={56}
          />
          <View style={styles.accountText}>
            <Text variant="body" weight="medium" style={styles.accountName}>
              {account.profile.name}
            </Text>
            <View style={styles.roleBadge}>
              <Icon size={14} color={PRIMARY} />
              <Text variant="label" style={styles.roleBadgeText}>
                {roleLabel}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 32 },
  header: { alignItems: 'center', gap: 8, paddingTop: 32 },
  appName: { fontSize: 36, color: PRIMARY, letterSpacing: -1 },
  title: { color: 'hsl(199, 41%, 12%)', textAlign: 'center', fontSize: 20 },
  subtitle: { color: MUTED, textAlign: 'center', fontSize: 15 },

  cards: { gap: 16 },
  accountCard: { padding: 20 },
  accountRow: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 14,
  },
  accountText: { flex: 1, gap: 6, alignItems: 'flex-end' },
  accountName: { fontSize: 17, color: 'hsl(199, 25%, 25%)', textAlign: textAlignStart },
  roleBadge: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'hsl(258, 45%, 96%)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  roleBadgeText: { color: PRIMARY, fontSize: 12 },
});
