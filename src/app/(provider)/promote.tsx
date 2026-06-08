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
import { formatNumber } from '@/lib/format';
import { rowDirection, textAlignStart } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED = 'hsl(198, 15%, 45%)';
const DARK = 'hsl(199, 41%, 12%)';
const ACCENT = 'hsl(38, 92%, 50%)';

export default function PromoteScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleUsePoints = () => {
    showMessage({
      message: t('provider.promote_success_title'),
      description: t('provider.promote_success_body'),
      type: 'success',
    });
    router.back();
  };

  const handleBuyDirect = () => {
    showMessage({
      message: t('provider.redirect_payment'),
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
            'provider.promote_benefit_1',
            'provider.promote_benefit_2',
            'provider.promote_benefit_3',
            'provider.promote_benefit_4',
          ].map((benefitKey) => (
            <View key={benefitKey} style={styles.benefitRow}>
              <Star size={14} color={ACCENT} fill={ACCENT} />
              <Text variant="body" style={styles.benefitText}>
                {t(benefitKey)}
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
                {t('provider.redeem_points')}
              </Text>
            </View>
            <Text variant="heading" weight="semibold" style={styles.optionPrice}>
              {`${formatNumber(500)} ${t('loyalty.points_unit')}`}
            </Text>
            <Text variant="caption" style={styles.optionNote}>{t('provider.current_balance_points', { points: 350 })}</Text>
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
                {t('provider.direct_payment')}
              </Text>
            </View>
            <Text variant="heading" weight="semibold" style={styles.optionPrice}>
              {`${formatNumber(990)} ${t('common.dzd')}`}
            </Text>
            <Text variant="caption" style={styles.optionNote}>{t('provider.for_7_days')}</Text>
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
  benefitRow: { flexDirection: rowDirection, alignItems: 'center', gap: 10 },
  benefitText: { flex: 1, textAlign: textAlignStart, color: DARK },

  options: { flexDirection: rowDirection, gap: 12 },
  optionCard: { flex: 1, gap: 10, alignItems: 'center' },
  optionHeader: { flexDirection: rowDirection, alignItems: 'center', gap: 6 },
  optionPrice: { textAlign: 'center', color: DARK, fontSize: 22 },
  optionNote: { textAlign: 'center', color: MUTED },
});
