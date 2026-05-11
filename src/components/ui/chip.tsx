import React from 'react';
import type { PressableProps } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props extends PressableProps {
  label: string;
  selected?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export function Chip({ label, selected = false, onRemove, icon, ...props }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.base, selected && styles.selected]}
      {...props}
    >
      {icon && <>{icon}</>}
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} accessibilityLabel="إزالة">
          <Text style={[styles.remove, selected && styles.selectedLabel]}>✕</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'hsl(258, 45%, 96%)',
    minHeight: 36,
  },
  selected: {
    backgroundColor: 'hsl(258, 52%, 54%)',
  },
  label: {
    fontFamily: 'Rubik',
    fontSize: 14,
    fontWeight: '500',
    color: 'hsl(199, 25%, 25%)',
  },
  selectedLabel: {
    color: 'hsl(210, 100%, 99%)',
  },
  remove: {
    fontSize: 12,
    color: 'hsl(199, 25%, 25%)',
    marginStart: 2,
  },
});
