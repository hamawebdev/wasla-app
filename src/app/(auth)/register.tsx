import { useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { setProfile } from '@/features/auth/use-auth-store';

const PRIMARY = 'hsl(258, 52%, 54%)';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = t('errors.required');
    if (!phone.trim() || !/^\d{9}$/.test(phone.trim())) e.phone = t('errors.phone_invalid');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setLoading(true);
    // Mock: save profile then go to OTP
    setProfile({ name: name.trim(), phone: `+213${phone.trim()}`, email: email.trim() || undefined });
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    router.push('/(auth)/otp');
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text variant="heading" weight="semibold" style={styles.heading}>
          إنشاء حساب
        </Text>

        <Card style={styles.card}>
          <Input
            label={t('auth.full_name')}
            placeholder={t('auth.full_name_placeholder')}
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoComplete="name"
          />

          <View style={styles.phoneRow}>
            <View style={styles.prefix}>
              <Text variant="label" weight="medium" style={styles.prefixText}>+213</Text>
            </View>
            <View style={styles.phoneInput}>
              <Input
                placeholder="5XX XXX XXX"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                error={errors.phone}
                maxLength={9}
              />
            </View>
          </View>

          <Text variant="label" style={styles.phoneLabel}>{t('auth.phone')}</Text>

          <Input
            label={t('auth.email')}
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Card>

        <Button
          variant="primary"
          label={t('auth.send_otp')}
          onPress={handleSend}
          loading={loading}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text variant="caption" style={styles.dividerText}>{t('auth.or')}</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button variant="outline" label={t('auth.google')} onPress={() => {}} />
        <Button variant="outline" label={t('auth.facebook')} onPress={() => {}} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  heading: { textAlign: 'center', fontSize: 26, color: 'hsl(199, 41%, 12%)' },
  card: { gap: 14 },

  phoneLabel: {
    textAlign: 'right',
    color: 'hsl(199, 41%, 12%)',
    fontWeight: '500',
    marginBottom: -8,
  },
  phoneRow: { flexDirection: 'row-reverse', gap: 8, alignItems: 'flex-end' },
  prefix: {
    backgroundColor: 'hsl(200, 20%, 94%)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'hsl(198, 21%, 88%)',
    paddingHorizontal: 14,
    minHeight: 56,
    justifyContent: 'center',
  },
  prefixText: { color: PRIMARY },
  phoneInput: { flex: 1 },

  divider: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'hsl(198, 21%, 88%)' },
  dividerText: { color: 'hsl(198, 15%, 45%)' },
});
