import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, Easing } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const COLORS = ['#C6195C', '#F472B6', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA'];
const PIECE_COUNT = 28;

type Piece = {
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotateStart: number;
  drift: number;
};

function makePieces(): Piece[] {
  return Array.from({ length: PIECE_COUNT }).map(() => ({
    x: Math.random() * SCREEN_W,
    delay: Math.random() * 400,
    duration: 2200 + Math.random() * 1200,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 6,
    rotateStart: Math.random() * 360,
    drift: (Math.random() - 0.5) * 80,
  }));
}

function ConfettiPiece({ piece }: { piece: Piece }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = () => {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: piece.duration,
        delay: piece.delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => loop());
    };
    loop();
  }, []);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, SCREEN_H + 40],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, piece.drift],
  });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [`${piece.rotateStart}deg`, `${piece.rotateStart + 360}deg`],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: piece.x,
        top: -Math.random() * 200,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate }],
      }}
    >
      <Svg width={piece.size} height={piece.size * 1.6}>
        <Rect width={piece.size} height={piece.size * 1.6} rx={2} fill={piece.color} />
      </Svg>
    </Animated.View>
  );
}

export default function ConfettiOverlay() {
  const pieces = useRef(makePieces()).current;

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} piece={p} />
      ))}
    </View>
  );
}