import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './button';
import { Text } from './text';

interface Props {
  illustration: React.ReactNode;
  title: string;
  body?: string;
  cta?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
}

export function EmptyState({ illustration, title, body, cta }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>{illustration}</View>
      <Text variant="heading" weight="semibold" style={styles.title}>
        {title}
      </Text>
      {body && (
        <Text variant="body" style={styles.body}>
          {body}
        </Text>
      )}
      {cta && (
        <Button
          variant={cta.variant ?? 'secondary'}
          label={cta.label}
          onPress={cta.onPress}
          style={styles.cta}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  illustration: {
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    color: 'hsl(199, 41%, 12%)',
  },
  body: {
    textAlign: 'center',
    color: 'hsl(198, 15%, 45%)',
    lineHeight: 24,
  },
  cta: {
    marginTop: 8,
    minWidth: 180,
  },
});
