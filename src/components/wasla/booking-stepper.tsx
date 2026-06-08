import { Check } from 'lucide-react-native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { rowDirection } from '@/lib/rtl';

const PRIMARY = 'hsl(258, 52%, 54%)';
const PRIMARY_TINT = 'hsl(258, 45%, 96%)';
const MUTED_BG = 'hsl(180, 20%, 92%)';
const MUTED_FG = 'hsl(198, 15%, 45%)';
const TRACK = 'hsl(198, 21%, 88%)';

type Step = 1 | 2 | 3;

interface Props {
  currentStep: Step;
}

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: 'booking.step_date' },
  { id: 2, label: 'booking.step_details' },
  { id: 3, label: 'booking.step_confirm' },
];

export function BookingStepper({ currentStep }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.track} />
      {STEPS.map((step) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <View key={step.id} style={styles.stepCol}>
            <View
              style={[
                styles.circle,
                (isCompleted || isActive) && styles.circleActive,
                isActive && styles.circleRing,
              ]}
            >
              {isCompleted ? (
                <Check size={16} color="#fff" strokeWidth={3} />
              ) : (
                <Text
                  variant="label"
                  weight="medium"
                  style={isActive ? styles.numActive : styles.numMuted}
                >
                  {step.id}
                </Text>
              )}
            </View>
            <Text
              variant="caption"
              weight="medium"
              style={[styles.label, (isCompleted || isActive) && styles.labelActive]}
            >
              {t(step.label)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: rowDirection,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: 8,
  },
  track: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: 15,
    height: 2,
    backgroundColor: TRACK,
  },
  stepCol: {
    alignItems: 'center',
    gap: 8,
    width: 72,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MUTED_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: PRIMARY,
  },
  circleRing: {
    borderWidth: 4,
    borderColor: PRIMARY_TINT,
  },
  numActive: { color: '#fff', fontSize: 13 },
  numMuted: { color: MUTED_FG, fontSize: 13 },
  label: {
    color: MUTED_FG,
    fontSize: 12,
    textAlign: 'center',
  },
  labelActive: {
    color: PRIMARY,
  },
});
