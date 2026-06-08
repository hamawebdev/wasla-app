import { isRTL } from './i18n';

// Wasla drives layout direction from the selected language rather than the native
// RTL engine (which is locked to LTR in lib/i18n). `isRTL` is resolved once at
// module load from the active language; switching language reloads the app, so it
// is safe to read these as constants inside static StyleSheets.
export { isRTL };

// Flip a numeric value (e.g., translateX offset) for RTL layouts.
export function flipForRTL(value: number): number {
  return isRTL ? -value : value;
}

// Row flex direction that respects the selected language. Typed as a narrow
// literal union so it is assignable to both ViewStyle and component props.
export const rowDirection: 'row' | 'row-reverse' = isRTL ? 'row-reverse' : 'row';

// Text alignment to the reading start (right in RTL, left in LTR). Narrow literal
// union so it also satisfies TextInput's stricter `textAlign` prop.
export const textAlignStart: 'left' | 'right' = isRTL ? 'right' : 'left';

// Writing direction for Text / TextInput content.
export const writingDir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';

// Physical sides resolved from reading direction.
export const startSide = isRTL ? 'right' : 'left';
export const endSide = isRTL ? 'left' : 'right';

// Back affordance points toward where you came from: right in RTL, left in LTR.
export const backArrowDirection = isRTL ? 'right' : 'left';

// Progress bars fill from the reading start.
export const progressFillDirection = isRTL ? 'right' : 'left';
