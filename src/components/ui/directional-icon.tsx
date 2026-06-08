import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';

import { isRTL } from '@/lib/rtl';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

// "Forward" / drill-in chevron: points in the reading direction.
// RTL reads right-to-left, so forward points left; LTR points right.
export function ChevronForward(props: IconProps) {
  const Icon = isRTL ? ChevronLeft : ChevronRight;
  return <Icon {...props} />;
}

// "Back" chevron: points against the reading direction.
export function ChevronBack(props: IconProps) {
  const Icon = isRTL ? ChevronRight : ChevronLeft;
  return <Icon {...props} />;
}

// "Back" arrow (e.g. header back button): points against the reading direction.
export function ArrowBack(props: IconProps) {
  const Icon = isRTL ? ArrowRight : ArrowLeft;
  return <Icon {...props} />;
}

// "Forward" arrow: points in the reading direction.
export function ArrowForward(props: IconProps) {
  const Icon = isRTL ? ArrowLeft : ArrowRight;
  return <Icon {...props} />;
}
