import { useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { signIn } from '@/features/auth/use-auth-store';
import { useAuthStore } from '@/features/auth/use-auth-store';

const PRIMARY = 'hsl(258, 52%, 54%)';
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OtpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const role = useAuthStore.use.role();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) { setError(t('errors.otp_invalid')); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    // Accept any 6-digit code in mock mode
    signIn({ access: 'mock-token', refresh: 'mock-refresh' });
    setLoading(false);
    if (role === 'provider') {
      router.replace('/(auth)/provider-setup');
    } else {
      router.replace('/(customer)/');
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text variant="heading" weight="semibold" style={styles.title}>
          {t('auth.otp_title')}
        </Text>

        {__DEV__ && (
          <View style={styles.devHint}>
            <Text variant="caption" style={styles.devHintText}>
              {t('auth.dev_otp_hint')}
            </Text>
          </View>
        )}

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <OtpBox
              key={index}
              value={digit}
              ref={(el) => { inputs.current[index] = el; }}
              onChangeText={(v) => handleChange(v, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              focused={false}
            />
          ))}
        </View>

        {error ? (
          <Text variant="caption" style={styles.error}>{error}</Text>
        ) : null}

        <Button
          variant="primary"
          label={t('common.confirm')}
          onPress={handleVerify}
          loading={loading}
        />

        <Pressable
          onPress={() => setResendTimer(RESEND_SECONDS)}
          disabled={resendTimer > 0}
        >
          <Text variant="label" style={[styles.resend, resendTimer > 0 && styles.resendDisabled]}>
            {resendTimer > 0
              ? t('auth.otp_resend_in', { seconds: resendTimer })
              : t('auth.otp_resend')}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const OtpBox = React.forwardRef<TextInput, {
  value: string;
  onChangeText: (v: string) => void;
  onKeyPress: (e: { nativeEvent: { key: string } }) => void;
  focused: boolean;
}>(({ value, onChangeText, onKeyPress }, ref) => {
  const { TextInput } = require('react-native');
  return (
    <TextInput
      ref={ref}
      value={value}
      onChangeText={onChangeText}
      onKeyPress={onKeyPress}
      style={styles.otpBox}
      keyboardType="numeric"
      maxLength={1}
      textAlign="center"
      selectTextOnFocus
    />
  );
});
OtpBox.displayName = 'OtpBox';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 24, alignItems: 'center', justifyContent: 'center' },
  title: { textAlign: 'center', fontSize: 22 },

  devHint: {
    backgroundColor: 'hsl(258, 45%, 96%)',
    borderRadius: 8,
    padding: 10,
  },
  devHintText: { color: PRIMARY, textAlign: 'center' },

  otpRow: { flexDirection: 'row-reverse', gap: 10 },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'hsl(198, 21%, 88%)',
    fontSize: 22,
    fontFamily: 'Rubik',
    fontWeight: '600',
    color: 'hsl(199, 41%, 12%)',
    backgroundColor: '#fff',
    textAlign: 'center',
  },

  error: { color: 'hsl(0, 84%, 60%)', textAlign: 'center' },
  resend: { color: PRIMARY, textAlign: 'center', minHeight: 44 },
  resendDisabled: { color: 'hsl(198, 15%, 45%)' },
});
