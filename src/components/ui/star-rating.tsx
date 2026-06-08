import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './text';
import { rowDirection } from '@/lib/rtl';

interface Props {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
  showCount?: boolean;
  count?: number;
}

export function StarRating({
  value,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
  showCount = false,
  count,
}: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value);
        return (
          <Pressable
            key={i}
            onPress={() => interactive && onChange?.(i + 1)}
            hitSlop={4}
            disabled={!interactive}
          >
            <Text
              style={[
                styles.star,
                { fontSize: size },
                filled ? styles.filled : styles.empty,
              ]}
            >
              {filled ? '★' : '☆'}
            </Text>
          </Pressable>
        );
      })}
      {showCount && count !== undefined && (
        <Text variant="caption" style={styles.count}>
          ({count})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: rowDirection,
    alignItems: 'center',
    gap: 2,
  },
  star: {
    fontFamily: 'Rubik',
  },
  filled: { color: '#f59e0b' },
  empty: { color: 'hsl(200, 20%, 80%)' },
  count: {
    color: 'hsl(198, 15%, 45%)',
    marginStart: 4,
  },
});
