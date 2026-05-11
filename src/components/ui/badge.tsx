import React from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

type Variant = 'primary' | 'accent' | 'success' | 'warning' | 'destructive' | 'muted';

interface Props {
  label: string;
  variant?: Variant;
  style?: ViewStyle;
}

const variantStyles: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: 'hsl(258, 52%, 54%)', text: 'hsl(210, 100%, 99%)' },
  accent: { bg: 'hsl(258, 45%, 96%)', text: 'hsl(198, 25%, 36%)' },
  success: { bg: 'hsl(142, 60%, 90%)', text: 'hsl(142, 71%, 25%)' },
  warning: { bg: 'hsl(38, 90%, 90%)', text: 'hsl(38, 80%, 28%)' },
  destructive: { bg: 'hsl(0, 84%, 92%)', text: 'hsl(0, 84%, 38%)' },
  muted: { bg: 'hsl(200, 20%, 94%)', text: 'hsl(198, 15%, 45%)' },
};

export function Badge({ label, variant = 'primary', style }: Props) {
  const colors = variantStyles[variant];
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.bg },
        style,
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  label: {
    fontFamily: 'Rubik',
    fontSize: 12,
    fontWeight: '500',
  },
});
