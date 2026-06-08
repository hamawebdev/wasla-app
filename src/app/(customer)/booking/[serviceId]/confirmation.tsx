import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { BookingStepper } from '@/components/wasla/booking-stepper';
import { MOCK_PROVIDERS } from '@/api/fixtures/providers';
import { MOCK_SERVICES } from '@/api/fixtures/services';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';

export default function BookingConfirmationScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { t } = useTranslation();
  const router = useRouter();

  const service = MOCK_SERVICES.find((s) => s.id === serviceId);
  const provider = service ? MOCK_PROVIDERS.find((p) => p.id === service.providerId) : null;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.stepperWrapper}>
        <BookingStepper currentStep={3} />
      </View>
      <View style={styles.container}>
        {/* Success icon */}
        <View style={styles.successIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('booking.success_title')}
        </Text>

        {/* Status card */}
        {service && (
          <Card style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Badge label={t('booking.status_pending')} variant="warning" />
              <View style={styles.statusInfo}>
                <Text variant="body" weight="semibold" style={{ color: 'hsl(199, 41%, 12%)', textAlign: textAlignStart }}>
                  {service.title}
                </Text>
                {provider && (
                  <Text variant="caption" style={{ color: 'hsl(198, 15%, 45%)', textAlign: textAlignStart }}>
                    {provider.name}
                  </Text>
                )}
              </View>
            </View>
          </Card>
        )}

        <View style={styles.buttons}>
          <Button
            variant="primary"
            label={t('booking.message_provider')}
            onPress={() => router.replace('/(customer)/chat')}
          />
          <Button
            variant="secondary"
            label={t('booking.go_home')}
            onPress={() => router.replace('/(customer)/')}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepperWrapper: { paddingHorizontal: 20, paddingTop: 12 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 24 },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'hsl(258, 45%, 96%)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: PRIMARY,
  },
  checkmark: { fontSize: 36, color: PRIMARY, fontWeight: '700' },
  title: { textAlign: 'center', fontSize: 22, color: 'hsl(199, 41%, 12%)' },
  statusCard: { width: '100%', padding: 16 },
  statusRow: { flexDirection: rowDirection, alignItems: 'center', gap: 12 },
  statusInfo: { flex: 1, gap: 4 },
  buttons: { width: '100%', gap: 12 },
});
