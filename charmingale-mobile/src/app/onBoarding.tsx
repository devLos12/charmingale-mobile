import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Rect, Path, G, Line } from 'react-native-svg';





const ROSE = '#C6415A';
const DEEP = '#8E1145';
const BLUSH = '#FFE4EA';
const WHITE = '#FFFFFF';

type P = { size?: number };

// 1. Welcome: book + heart
function Slide1({ size = 260 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="90" fill={BLUSH} />
      <Path d="M35 75 Q70 65 100 80 L100 150 Q70 138 35 148 Z" fill={ROSE} />
      <Path d="M165 75 Q130 65 100 80 L100 150 Q130 138 165 148 Z" fill={DEEP} />
      <Path d="M45 85 Q70 78 92 90" stroke={WHITE} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d="M45 100 Q70 93 92 105" stroke={WHITE} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d="M155 85 Q130 78 108 90" stroke={WHITE} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path d="M155 100 Q130 93 108 105" stroke={WHITE} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Path
        d="M100 62 C100 48 80 44 80 58 C80 70 100 80 100 80 C100 80 120 70 120 58 C120 44 100 48 100 62 Z"
        fill={ROSE}
      />
      <Circle cx="150" cy="45" r="5" fill={ROSE} opacity="0.4" />
      <Circle cx="45" cy="50" r="4" fill={DEEP} opacity="0.3" />
    </Svg>
  );
}

// 2. Unlock topics: open padlock
function Slide2({ size = 260 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="90" fill={BLUSH} />
      <Path
        d="M72 92 V70 A28 28 0 0 1 128 70 V78"
        stroke={DEEP}
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <Rect x="55" y="92" width="90" height="70" rx="14" fill={ROSE} />
      <Circle cx="100" cy="122" r="9" fill={WHITE} />
      <Rect x="96" y="124" width="8" height="18" rx="4" fill={WHITE} />
      <Path d="M158 52 L161 60 L169 63 L161 66 L158 74 L155 66 L147 63 L155 60 Z" fill={ROSE} />
      <Path d="M40 60 L42 66 L48 68 L42 70 L40 76 L38 70 L32 68 L38 66 Z" fill={DEEP} opacity="0.5" />
    </Svg>
  );
}

// 3. Timer: clock
function Slide3({ size = 260 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="90" fill={BLUSH} />
      <Rect x="88" y="26" width="24" height="12" rx="4" fill={DEEP} />
      <Rect x="96" y="36" width="8" height="10" fill={DEEP} />
      <Circle cx="100" cy="106" r="60" fill={WHITE} stroke={ROSE} strokeWidth="10" />
      <Line x1="100" y1="58" x2="100" y2="66" stroke={DEEP} strokeWidth="4" strokeLinecap="round" />
      <Line x1="100" y1="146" x2="100" y2="154" stroke={DEEP} strokeWidth="4" strokeLinecap="round" />
      <Line x1="48" y1="106" x2="56" y2="106" stroke={DEEP} strokeWidth="4" strokeLinecap="round" />
      <Line x1="144" y1="106" x2="152" y2="106" stroke={DEEP} strokeWidth="4" strokeLinecap="round" />
      <Line x1="100" y1="106" x2="100" y2="76" stroke={DEEP} strokeWidth="6" strokeLinecap="round" />
      <Line x1="100" y1="106" x2="124" y2="118" stroke={ROSE} strokeWidth="6" strokeLinecap="round" />
      <Circle cx="100" cy="106" r="6" fill={DEEP} />
    </Svg>
  );
}

// 4. Study files: document
function Slide4({ size = 260 }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="90" fill={BLUSH} />
      <Rect x="58" y="40" width="80" height="108" rx="10" fill={ROSE} opacity="0.35" transform="rotate(-8 98 94)" />
      <G>
        <Path d="M68 44 H116 L142 70 V152 A8 8 0 0 1 134 160 H68 A8 8 0 0 1 60 152 V52 A8 8 0 0 1 68 44 Z" fill={WHITE} stroke={DEEP} strokeWidth="4" />
        <Path d="M116 44 V70 H142" fill={BLUSH} stroke={DEEP} strokeWidth="4" strokeLinejoin="round" />
        <Rect x="72" y="86" width="52" height="6" rx="3" fill={ROSE} />
        <Rect x="72" y="102" width="56" height="6" rx="3" fill={ROSE} opacity="0.6" />
        <Rect x="72" y="118" width="40" height="6" rx="3" fill={ROSE} opacity="0.6" />
        <Rect x="72" y="134" width="30" height="14" rx="4" fill={DEEP} />
      </G>
    </Svg>
  );
}

const SLIDES = [
  { id: '1', Art: Slide1, title: 'Welcome to Charmingale', desc: 'Your PNLE review buddy, all in one place.' },
  { id: '2', Art: Slide2, title: 'Unlock Topic by Topic', desc: 'Finish one topic to unlock the next one.' },
  { id: '3', Art: Slide3, title: 'Track Your Time', desc: 'Timer and pause tracking for every session.' },
  { id: '4', Art: Slide4, title: 'Study Files', desc: 'Open your PDFs and notes right inside the app.' },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  const finish = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/');
  };

  const next = () => {
    if (isLast) return finish();
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-blush">
      {/* Skip */}
      <View className="items-end px-6 pt-4 h-12">
        {!isLast && (
          <TouchableOpacity onPress={finish}>
            <Text className="text-roseDeep font-semibold">Skip</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Slides */}
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => {
          const Art = item.Art;
          return (
            <View style={{ width }} className="items-center justify-center px-10">
              <Art size={width * 0.7} />
              <Text className="text-roseDeep text-2xl font-bold mt-8 text-center">{item.title}</Text>
              <Text className="text-muted text-base mt-3 text-center">{item.desc}</Text>
            </View>
          );
        }}
      />

      {/* Dots */}
      <View className="flex-row justify-center gap-2 mb-6">
        {SLIDES.map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full ${i === index ? 'w-6 bg-rose' : 'w-2 bg-rose/30'}`}
          />
        ))}
      </View>

      {/* Next / Get Started */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={next}
          activeOpacity={0.8}
          className="bg-rose rounded-full py-4 items-center"
        >
          <Text className="text-white font-bold text-base">
            {isLast ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}