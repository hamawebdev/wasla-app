import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';

const PRIMARY = 'hsl(258, 52%, 54%)';
const MUTED_BG = 'hsl(200, 20%, 94%)';

interface Segment {
  key: string;
  label: string;
}

interface Props {
  segments: Segment[];
  selected: string;
  onChange: (key: string) => void;
}

export function SegmentedControl({ segments, selected, onChange }: Props) {
  return (
    <View style={styles.container}>
      {segments.map((seg) => {
        const active = seg.key === selected;
        return (
          <Pressable
            key={seg.key}
            style={[styles.segment, active && styles.segmentActive]}
            onPress={() => onChange(seg.key)}
          >
            <Text
              variant="label"
              weight="medium"
              style={[styles.label, active && styles.labelActive]}
            >
              {seg.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    backgroundColor: MUTED_BG,
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentActive: { backgroundColor: PRIMARY },
  label: { color: 'hsl(198, 15%, 45%)' },
  labelActive: { color: '#fff' },
});
