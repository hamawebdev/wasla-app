import { useRouter } from 'expo-router';
import { Star, Zap } from 'lucide-react-native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { StarBadgeIllustration } from '@/components/illustrations';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const ACCENT = 'hsl(38, 92%, 50%)';

export default function PromoteScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleUsePoints = () => {
    showMessage({
      message: 'تم استخدام 500 نقطة بنجاح!',
      description: 'خدماتكِ ستظهر في القائمة المميزة لمدة 7 أيام',
      type: 'success',
    });
    router.back();
  };

  const handleBuyDirect = () => {
    showMessage({
      message: 'سيتم إعادة توجيهكِ لبوابة الدفع',
      type: 'info',
    });
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <StarBadgeIllustration size={120} />
        </View>

        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('provider.promote_title')}
        </Text>
        <Text variant="body" style={styles.body}>
          {t('provider.promote_body')}
        </Text>

        {/* Benefits list */}
        <Card style={styles.benefitsCard}>
          {[
            'ظهور خدماتكِ في أعلى نتائج البحث',
            'شارة "مميزة" على كل خدمة',
            'إشعار لأكثر من 200 عميلة في المنطقة',
            'مدة 7 أيام كاملة',
          ].map((benefit, i) => (
            <View key={i} style={styles.benefitRow}>
              <Star size={14} color={ACCENT} fill={ACCENT} />
              <Text variant="body" style={styles.benefitText}>
                {benefit}
              </Text>
            </View>
          ))}
        </Card>

        {/* Options */}
        <View style={styles.options}>
          <Card style={styles.optionCard} elevated>
            <View style={styles.optionHeader}>
              <Zap size={20} color={PRIMARY} />
              <Text variant="label" weight="semibold" style={{ color: PRIMARY }}>
                استبدال النقاط
              </Text>
            </View>
            <Text variant="heading" weight="semibold" style={styles.optionPrice}>
              500 نقطة
            </Text>
            <Text variant="caption" style={styles.optionNote}>رصيدكِ الحالي: 350 نقطة</Text>
            <Button
              variant="secondary"
              label={t('provider.use_points')}
              onPress={handleUsePoints}
              disabled
            />
          </Card>

          <Card style={styles.optionCard} elevated>
            <View style={styles.optionHeader}>
              <Star size={20} color={ACCENT} />
              <Text variant="label" weight="semibold" style={{ color: DARK }}>
                الدفع المباشر
              </Text>
            </View>
            <Text variant="heading" weight="semibold" style={styles.optionPrice}>
              990 د.ج
            </Text>
            <Text variant="caption" style={styles.optionNote}>لمدة 7 أيام</Text>
            <Button
              variant="primary"
              label={t('provider.buy_direct')}
              onPress={handleBuyDirect}
            />
          </Card>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },

  illustrationWrap: { alignItems: 'center', paddingVertical: 8 },
  title: { textAlign: 'center', fontSize: 22, color: DARK },
  body: { textAlign: 'center', color: MUTED, lineHeight: 24 },

  benefitsCard: { gap: 10 },
  benefitRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  benefitText: { flex: 1, textAlign: 'right', color: DARK },

  options: { flexDirection: 'row-reverse', gap: 12 },
  optionCard: { flex: 1, gap: 10, alignItems: 'center' },
  optionHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  optionPrice: { textAlign: 'center', color: DARK, fontSize: 22 },
  optionNote: { textAlign: 'center', color: MUTED },
});
