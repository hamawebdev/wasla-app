import React from 'react';
import type { TextProps } from 'react-native';
import { Text as RNText, StyleSheet } from 'react-native';

type Variant = 'body' | 'label' | 'caption' | 'heading' | 'price';

interface Props extends TextProps {
  variant?: Variant;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

const weightMap = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

const sizeMap: Record<Variant, number> = {
  caption: 14,
  label: 14,
  body: 16,
  heading: 22,
  price: 16,
};

export function Text({ variant = 'body', weight = 'regular', style, ...props }: Props) {
  return (
    <RNText
      style={[
        styles.base,
        { fontSize: sizeMap[variant], fontWeight: weightMap[weight] },
        variant === 'heading' && styles.heading,
        variant === 'price' && styles.price,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Rubik',
    lineHeight: 26,
    letterSpacing: -0.16,
    writingDirection: 'rtl',
  },
  heading: {
    lineHeight: 34,
    fontWeight: '600',
  },
  price: {
    fontWeight: '600',
  },
});
