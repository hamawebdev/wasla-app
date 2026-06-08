import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChevronBack } from '@/components/ui/directional-icon';
import { Text } from '@/components/ui/text';
import { ProviderPublicProfile } from '@/components/wasla/provider-public-profile';
import { rowDirection } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const BORDER = 'hsl(198, 21%, 88%)';

export default function CustomerProviderProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
          <ChevronBack size={24} color={PRIMARY} />
        </Pressable>
        <Text variant="heading" weight="bold" style={styles.title}>
          {t('common.app_name')}
        </Text>
        <Pressable
          onPress={() => router.push('/(shared)/notifications')}
          style={styles.iconBtn}
          hitSlop={12}
        >
          <Bell size={24} color={PRIMARY} />
        </Pressable>
      </View>
      <ProviderPublicProfile providerId={id ?? ''} mode="public" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'hsl(180, 25%, 98%)' },
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
  title: { color: PRIMARY, fontSize: 18 },
});
