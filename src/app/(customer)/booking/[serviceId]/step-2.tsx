import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Plus } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { MOCK_SERVICES } from '@/api/fixtures/services';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';

export default function BookingStep2() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const [details, setDetails] = useState('');

  const service = MOCK_SERVICES.find((s) => s.id === serviceId);

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text variant="heading" weight="semibold" style={styles.title}>
          تفاصيل الطلب
        </Text>

        {/* Additional details */}
        <View>
          <Text variant="label" weight="medium" style={styles.label}>تفاصيل إضافية</Text>
          <TextInput
            placeholder={t('booking.details_placeholder')}
            placeholderTextColor={MUTED}
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={4}
            textAlign="right"
            style={styles.textarea}
          />
        </View>

        {/* Address */}
        <Card style={styles.addressCard}>
          <View style={styles.addressRow}>
            <Button
              variant="ghost"
              label={t('booking.add_address')}
              leftIcon={<Plus size={16} color={PRIMARY} />}
              onPress={() => router.push('/location-manual')}
              size="sm"
            />
            <View style={styles.addressInfo}>
              <MapPin size={16} color={PRIMARY} />
              <Text variant="label" style={{ color: 'hsl(199, 41%, 12%)' }}>
                الجزائر العاصمة
              </Text>
            </View>
          </View>
          <View style={styles.mapThumb}>
            <MapPin size={24} color={PRIMARY} />
          </View>
        </Card>

        {/* Booking summary */}
        {service && (
          <Card style={styles.summaryCard}>
            <Text variant="label" weight="semibold" style={styles.summaryTitle}>
              {t('booking.summary')}
            </Text>
            <View style={styles.summaryRow}>
              <Text variant="body" weight="semibold" style={{ color: PRIMARY }}>
                {service.price.toLocaleString('ar-DZ')} د.ج
              </Text>
              <Text variant="body" style={{ color: MUTED }}>السعر التقديري</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="label" style={{ color: 'hsl(199, 41%, 12%)' }}>يوم قريب</Text>
              <Text variant="body" style={{ color: MUTED }}>التاريخ</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="label" style={{ color: 'hsl(199, 41%, 12%)' }} numberOfLines={1}>
                {service.title}
              </Text>
              <Text variant="body" style={{ color: MUTED }}>الخدمة</Text>
            </View>
          </Card>
        )}

        <Button
          variant="primary"
          label={t('booking.confirm')}
          onPress={() => router.replace(`/(customer)/booking/${serviceId}/confirmation`)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  title: { textAlign: 'center', fontSize: 22 },
  label: { textAlign: 'right', color: 'hsl(199, 41%, 12%)', marginBottom: 8 },

  textarea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'hsl(198, 21%, 88%)',
    padding: 14,
    fontFamily: 'Rubik',
    fontSize: 15,
    color: 'hsl(199, 41%, 12%)',
    minHeight: 100,
    textAlignVertical: 'top',
  },

  addressCard: { gap: 10, padding: 14 },
  addressRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  addressInfo: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  mapThumb: {
    height: 80,
    backgroundColor: 'hsl(180, 20%, 92%)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryCard: { gap: 12 },
  summaryTitle: { textAlign: 'right', color: 'hsl(199, 41%, 12%)', fontSize: 16 },
  summaryRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
});
