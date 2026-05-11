import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { ProviderPublicProfile } from '@/components/wasla/provider-public-profile';

const FOREGROUND = 'hsl(199, 41%, 12%)';
const BORDER = 'hsl(198, 21%, 88%)';

export default function CustomerProviderProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <ChevronRight size={24} color={FOREGROUND} />
        </Pressable>
        <Text variant="heading" weight="semibold" style={styles.title}>
          متجر مقدمة الخدمة
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <ProviderPublicProfile providerId={id ?? ''} mode="public" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'hsl(180, 25%, 98%)' },
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
  title: { color: FOREGROUND, fontSize: 18 },
});
