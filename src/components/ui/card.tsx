import React from 'react';
import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';

interface Props extends ViewProps {
  elevated?: boolean;
}

export function Card({ elevated = false, style, children, ...props }: Props) {
  return (
    <View
      style={[styles.base, elevated && styles.elevated, style]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: 'hsl(196, 22%, 10%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  elevated: {
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
});
