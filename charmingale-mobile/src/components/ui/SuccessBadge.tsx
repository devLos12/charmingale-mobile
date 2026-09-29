import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const GREEN = '#16a34a';

type P = { size?: number };

export default function SuccessBadge({ size = 96 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke={GREEN} strokeWidth="4" />
      <Path
        d="M32 51 L45 64 L69 38"
        stroke={GREEN}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}