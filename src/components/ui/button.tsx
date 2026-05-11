import React from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
type Size = 'lg' | 'md' | 'sm';

interface Props extends PressableProps {
  variant?: Variant;
  size?: Size;
  label: string;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  variant = 'primary',
  size = 'lg',
  label,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {leftIcon && !loading && leftIcon}
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : '#7c5dfa'}
          size="small"
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`], styles[`${size}Label`]]}>
          {label}
        </Text>
      )}
      {rightIcon && !loading && rightIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    minHeight: 56,
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: 'Rubik',
    fontWeight: '500',
    textAlign: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },

  /* Variants */
  primary: { backgroundColor: 'hsl(258, 52%, 54%)' },
  primaryLabel: { color: 'hsl(210, 100%, 99%)', fontSize: 16 },

  secondary: { backgroundColor: 'hsl(258, 45%, 96%)' },
  secondaryLabel: { color: 'hsl(199, 25%, 25%)', fontSize: 16 },

  destructive: { backgroundColor: 'hsl(0, 84%, 60%)' },
  destructiveLabel: { color: 'hsl(0, 0%, 98%)', fontSize: 16 },

  ghost: { backgroundColor: 'transparent' },
  ghostLabel: { color: 'hsl(258, 52%, 54%)', fontSize: 16 },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'hsl(258, 52%, 54%)',
  },
  outlineLabel: { color: 'hsl(258, 52%, 54%)', fontSize: 16 },

  /* Sizes */
  lg: { minHeight: 56 },
  lgLabel: { fontSize: 16 },

  md: { minHeight: 44, paddingHorizontal: 16 },
  mdLabel: { fontSize: 15 },

  sm: { minHeight: 36, paddingHorizontal: 12, borderRadius: 6 },
  smLabel: { fontSize: 14 },
});
