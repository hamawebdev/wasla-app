import { I18nManager } from 'react-native';

export const isRTL = I18nManager.isRTL;

// Flip a numeric value (e.g., margin/padding) for RTL layouts.
export function flipForRTL(value: number): number {
  return isRTL ? -value : value;
}

// Returns 'right' in RTL (back arrow points right), 'left' in LTR.
export const backArrowDirection = isRTL ? 'right' : 'left';

// Flex direction helpers that respect RTL.
export const rowDirection = isRTL ? 'row-reverse' : 'row';
export const startSide = isRTL ? 'right' : 'left';
export const endSide = isRTL ? 'left' : 'right';

// Progress fill direction: RTL bars should fill from the right.
export const progressFillDirection = isRTL ? 'right' : 'left';
