import { MotiView } from 'moti';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

interface ItemProps {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

function SkeletonItem({ width = '100%', height = 16, radius = 8, style }: ItemProps) {
  return (
    <MotiView
      from={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 800, loop: true }}
      style={[
        {
          width: width as number,
          height,
          borderRadius: radius,
          backgroundColor: 'hsl(200, 20%, 92%)',
        },
        style,
      ]}
    />
  );
}

type Variant = 'card-list' | 'detail' | 'grid';

interface ScreenSkeletonProps {
  variant?: Variant;
}

export function ScreenSkeleton({ variant = 'card-list' }: ScreenSkeletonProps) {
  if (variant === 'grid') {
    return (
      <View style={styles.gridContainer}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.gridItem}>
            <SkeletonItem height={80} radius={12} />
            <SkeletonItem height={12} style={{ marginTop: 8 }} width="70%" />
          </View>
        ))}
      </View>
    );
  }

  if (variant === 'detail') {
    return (
      <View style={styles.detailContainer}>
        <SkeletonItem height={220} radius={0} />
        <View style={styles.detailBody}>
          <SkeletonItem height={28} width="80%" />
          <SkeletonItem height={14} style={{ marginTop: 8 }} />
          <SkeletonItem height={14} style={{ marginTop: 4 }} width="60%" />
          <View style={styles.infoGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonItem key={i} height={60} width="47%" radius={10} />
            ))}
          </View>
        </View>
      </View>
    );
  }

  // card-list
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={styles.cardSkeleton}>
          <SkeletonItem height={180} radius={12} />
          <View style={styles.cardBody}>
            <SkeletonItem height={18} width="70%" />
            <SkeletonItem height={13} style={{ marginTop: 6 }} width="50%" />
            <SkeletonItem height={13} style={{ marginTop: 4 }} width="40%" />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: { gap: 12, padding: 16 },
  cardSkeleton: { gap: 0 },
  cardBody: { gap: 4, padding: 12 },

  detailContainer: {},
  detailBody: { gap: 8, padding: 16 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
  gridItem: { width: '30%' },
});
