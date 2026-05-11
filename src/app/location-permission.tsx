import { useRouter } from 'expo-router';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { MapPinIllustration } from '@/components/illustrations';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';

export default function LocationPermissionScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleAllow = () => {
    // Mock: assume granted, go back or to customer home
    router.back();
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        <MapPinIllustration size={160} />
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('location.permission_title')}
        </Text>
        <View style={styles.buttons}>
          <Button
            variant="primary"
            label={t('location.allow')}
            onPress={handleAllow}
          />
          <Button
            variant="secondary"
            label={t('location.manual')}
            onPress={() => router.push('/location-manual')}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 24 },
  title: { textAlign: 'center', fontSize: 22 },
  buttons: { width: '100%', gap: 12 },
});
