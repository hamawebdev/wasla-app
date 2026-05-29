import type { UserRole } from '@/features/auth/use-auth-store';
import { useRouter } from 'expo-router';
import { Briefcase, Search } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { setRole } from '@/features/auth/use-auth-store';

const PRIMARY = 'hsl(258, 52%, 54%)';

export default function RoleSelectScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selected)
      return;
    setRole(selected);
    router.push('/(auth)/register');
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Logo / Header */}
        <View style={styles.header}>
          <Text variant="heading" weight="semibold" style={styles.appName}>
            واصل
          </Text>
          <Text variant="body" style={styles.subtitle}>
            {t('auth.role_title')}
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.cards}>
          <RoleOption
            icon={<Search size={28} color={selected === 'customer' ? PRIMARY : 'hsl(198, 15%, 45%)'} />}
            label={t('auth.role_customer')}
            selected={selected === 'customer'}
            onPress={() => setSelected('customer')}
          />
          <RoleOption
            icon={<Briefcase size={28} color={selected === 'provider' ? PRIMARY : 'hsl(198, 15%, 45%)'} />}
            label={t('auth.role_provider')}
            selected={selected === 'provider'}
            onPress={() => setSelected('provider')}
          />
        </View>

        <Button
          variant="primary"
          label={t('common.continue')}
          onPress={handleContinue}
          disabled={!selected}
          style={styles.btn}
        />
      </View>
    </Screen>
  );
}

type RoleOptionProps = {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onPress: () => void;
};

function RoleOption({ icon, label, selected, onPress }: RoleOptionProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected }}>
      <Card
        style={[
          styles.roleCard,
          selected && styles.roleCardSelected,
        ]}
      >
        <View style={styles.roleRow}>
          {icon}
          <Text variant="body" weight="medium" style={[styles.roleLabel, selected && styles.roleLabelSelected]}>
            {label}
          </Text>
          <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
            {selected && <View style={styles.radioInner} />}
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
  subtitle: { color: 'hsl(198, 15%, 45%)', textAlign: 'center', fontSize: 18 },

  cards: { gap: 16 },
  roleCard: { padding: 20 },
  roleCardSelected: {
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  roleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },
  roleLabel: { flex: 1, fontSize: 17, textAlign: 'right', color: 'hsl(199, 25%, 25%)' },
  roleLabelSelected: { color: PRIMARY, fontWeight: '600' },

  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'hsl(198, 21%, 88%)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: { borderColor: PRIMARY },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: PRIMARY,
  },

  btn: { marginTop: 8 },
});
