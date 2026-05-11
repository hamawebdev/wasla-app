import React from 'react';
import { Circle, Ellipse, Line, Path, Rect, Svg } from 'react-native-svg';

interface IllustrationProps {
  color?: string;
  size?: number;
}

const DEFAULT_COLOR = 'hsl(258, 52%, 54%)';
const MUTED_COLOR = 'hsl(198, 15%, 45%)';

export function WomanWithMapIllustration({ color = DEFAULT_COLOR, size = 160 }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      {/* Map */}
      <Rect x="20" y="60" width="80" height="60" rx="6" stroke={color} strokeWidth="2.5" />
      <Line x1="20" y1="82" x2="100" y2="82" stroke={color} strokeWidth="1.5" />
      <Line x1="55" y1="60" x2="55" y2="120" stroke={color} strokeWidth="1.5" />
      {/* Pin */}
      <Path d="M72 68 C72 62 80 58 80 68 C80 75 72 80 72 80 C72 80 64 75 64 68 Z" stroke={color} strokeWidth="2" fill="none" />
      <Circle cx="72" cy="68" r="3" fill={color} />
      {/* Woman silhouette */}
      <Circle cx="125" cy="45" r="12" stroke={color} strokeWidth="2.5" fill="none" />
      <Path d="M113 75 Q118 58 125 58 Q132 58 137 75" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Line x1="125" y1="75" x2="125" y2="95" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="125" y1="85" x2="113" y2="95" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="125" y1="85" x2="137" y2="95" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Stars */}
      <Path d="M30 45 L32 40 L34 45 L39 45 L35 48 L36 53 L32 50 L28 53 L29 48 L25 45 Z" fill={color} opacity="0.5" />
      <Path d="M45 30 L46.5 26 L48 30 L52 30 L49 32.5 L50 36.5 L46.5 34 L43 36.5 L44 32.5 L41 30 Z" fill={color} opacity="0.3" />
    </Svg>
  );
}

export function ChatBubblesIllustration({ color = DEFAULT_COLOR, size = 160 }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      {/* Bubble 1 */}
      <Rect x="15" y="40" width="90" height="50" rx="12" stroke={color} strokeWidth="2.5" />
      <Path d="M35 90 L25 105" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="35" y1="55" x2="85" y2="55" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="35" y1="68" x2="70" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Bubble 2 */}
      <Rect x="55" y="75" width="90" height="50" rx="12" stroke={MUTED_COLOR} strokeWidth="2.5" />
      <Path d="M125 125 L135 138" stroke={MUTED_COLOR} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="75" y1="90" x2="125" y2="90" stroke={MUTED_COLOR} strokeWidth="2" strokeLinecap="round" />
      <Line x1="75" y1="103" x2="105" y2="103" stroke={MUTED_COLOR} strokeWidth="2" strokeLinecap="round" />
      {/* Lock icon */}
      <Rect x="68" y="28" width="24" height="18" rx="3" stroke={color} strokeWidth="2" fill="none" />
      <Path d="M72 28 Q72 20 80 20 Q88 20 88 28" stroke={color} strokeWidth="2" fill="none" />
      <Circle cx="80" cy="37" r="2.5" fill={color} />
    </Svg>
  );
}

export function StarBadgeIllustration({ color = DEFAULT_COLOR, size = 160 }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      {/* Badge shape */}
      <Path
        d="M80 15 L95 50 L135 50 L105 72 L118 108 L80 88 L42 108 L55 72 L25 50 L65 50 Z"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
      />
      {/* Inner star */}
      <Path
        d="M80 35 L87 55 L108 55 L92 67 L98 87 L80 75 L62 87 L68 67 L52 55 L73 55 Z"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        opacity="0.15"
      />
      {/* Coins */}
      <Circle cx="120" cy="115" r="15" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
      <Circle cx="135" cy="125" r="12" stroke="#f59e0b" strokeWidth="2" fill="none" />
      <Line x1="120" y1="108" x2="120" y2="122" stroke="#f59e0b" strokeWidth="2" />
      <Path d="M115 112 Q120 109 125 112" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

export function BinocularsIllustration({ color = DEFAULT_COLOR, size = 140 }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <Circle cx="45" cy="80" r="28" stroke={color} strokeWidth="2.5" fill="none" />
      <Circle cx="95" cy="80" r="28" stroke={color} strokeWidth="2.5" fill="none" />
      <Circle cx="45" cy="80" r="16" stroke={color} strokeWidth="1.5" fill={color} opacity="0.1" />
      <Circle cx="95" cy="80" r="16" stroke={color} strokeWidth="1.5" fill={color} opacity="0.1" />
      <Line x1="73" y1="80" x2="67" y2="80" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Rect x="58" y="52" width="24" height="20" rx="4" stroke={color} strokeWidth="2" fill="none" />
      <Line x1="30" y1="60" x2="45" y2="52" stroke={MUTED_COLOR} strokeWidth="2" strokeLinecap="round" />
      <Line x1="110" y1="60" x2="95" y2="52" stroke={MUTED_COLOR} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function EmptyCalendarIllustration({ color = MUTED_COLOR, size = 140 }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <Rect x="15" y="30" width="110" height="95" rx="10" stroke={color} strokeWidth="2.5" fill="none" />
      <Line x1="15" y1="58" x2="125" y2="58" stroke={color} strokeWidth="2" />
      <Line x1="40" y1="20" x2="40" y2="44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="100" y1="20" x2="100" y2="44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Circle cx="40" cy="76" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="70" cy="76" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="100" cy="76" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="40" cy="100" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="70" cy="100" r="5" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

export function DisconnectedPlugIllustration({ size = 140 }: IllustrationProps) {
  const color = MUTED_COLOR;
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <Path d="M50 30 L50 70" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Path d="M90 30 L90 70" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Path d="M35 70 L105 70 L105 90 Q105 110 70 110 Q35 110 35 90 Z" stroke={color} strokeWidth="2.5" fill="none" />
      <Line x1="70" y1="110" x2="70" y2="125" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <Line x1="40" y1="125" x2="100" y2="125" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Broken connection */}
      <Path d="M55 45 L60 40 L65 50 L70 38" stroke={DEFAULT_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MapPinIllustration({ color = DEFAULT_COLOR, size = 140 }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <Path
        d="M70 20 C48 20 32 36 32 55 C32 80 70 115 70 115 C70 115 108 80 108 55 C108 36 92 20 70 20 Z"
        stroke={color}
        strokeWidth="2.5"
        fill={color}
        fillOpacity="0.1"
      />
      <Circle cx="70" cy="55" r="14" stroke={color} strokeWidth="2.5" fill="none" />
      <Circle cx="70" cy="55" r="5" fill={color} />
      {/* Ripple */}
      <Ellipse cx="70" cy="125" rx="35" ry="8" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" />
    </Svg>
  );
}

export function HandshakeIllustration({ color = DEFAULT_COLOR, size = 160 }: IllustrationProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" fill="none">
      {/* Left hand */}
      <Path d="M20 90 L55 65 L75 80" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M55 65 L60 55 L75 65 L80 80" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Right hand */}
      <Path d="M140 90 L105 65 L85 80" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M105 65 L100 55 L85 65 L80 80" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Handshake center */}
      <Circle cx="80" cy="85" r="12" stroke={color} strokeWidth="2.5" fill={color} fillOpacity="0.12" />
      <Path d="M73 85 L78 90 L90 78" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Stars */}
      <Line x1="40" y1="45" x2="40" y2="55" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <Line x1="35" y1="50" x2="45" y2="50" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <Line x1="115" y1="40" x2="115" y2="50" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <Line x1="110" y1="45" x2="120" y2="45" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}
