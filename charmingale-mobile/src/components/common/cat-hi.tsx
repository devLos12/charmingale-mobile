import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, useWindowDimensions, View } from "react-native";
import Svg, { Circle, Ellipse, Line, Path } from "react-native-svg";

const ROSE = "#C6415A";
const DEEP = "#8E1145";
const WHITE = "#FFFFFF";

const SIZE = 130;

type Edge = "bottom" | "top" | "left" | "right";
const EDGES: Edge[] = ["bottom", "top"];

// ikot ng buong pusa para laging nakadikit ang ilalim sa gilid ng screen
const ANGLE: Record<Edge, number> = { bottom: 0, top: 180, left: 90, right: -90 };

const randomSpot = (prev?: Edge) => {
  const options = EDGES;
  return {
    edge: options[Math.floor(Math.random() * options.length)],
    pos: 0.12 + Math.random() * 0.76,
  };
};

const fill = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  width: SIZE,
  height: SIZE,
};

const CatPeek = () => {
  const { width, height } = useWindowDimensions();
  const [spot, setSpot] = useState(() => randomSpot());

  const slide = useRef(new Animated.Value(0)).current;
  const hello = useRef(new Animated.Value(0)).current; // 0 = tahimik, 1 = nag-hi
  const wave = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(0)).current;

  // paikot-ikot na sequence ng pagsilip
  useEffect(() => {
    let cancelled = false;

    const run = () => {
      slide.setValue(0);
      hello.setValue(0);
      wave.setValue(0);
      setSpot((prev) => randomSpot(prev.edge));

      const waves = Array.from({ length: 4 }).flatMap(() => [
        Animated.timing(wave, { toValue: 1, duration: 230, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wave, { toValue: 0, duration: 230, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]);

      Animated.sequence([
        Animated.delay(1000),
        Animated.spring(slide, { toValue: 1, bounciness: 12, speed: 10, useNativeDriver: true }),
        Animated.delay(500),
        Animated.timing(hello, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.sequence(waves),
        Animated.delay(200),
        Animated.timing(hello, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.delay(600),
        Animated.timing(slide, { toValue: 0, duration: 400, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.delay(2500),
      ]).start(({ finished }) => {
        if (finished && !cancelled) run();
      });
    };

    run();

    return () => {
      cancelled = true;
      slide.stopAnimation();
      hello.stopAnimation();
      wave.stopAnimation();
    };
  }, []);

  // pag-indayog ng ulo at pagkurap, tuloy-tuloy
  useEffect(() => {
    const bobbing = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );

    const blinking = Animated.loop(
      Animated.sequence([
        Animated.delay(2300),
        Animated.timing(blink, { toValue: 1, duration: 70, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 0, duration: 90, useNativeDriver: true }),
        Animated.delay(900),
        Animated.timing(blink, { toValue: 1, duration: 70, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 0, duration: 90, useNativeDriver: true }),
      ])
    );

    bobbing.start();
    blinking.start();

    return () => {
      bobbing.stop();
      blinking.stop();
    };
  }, []);

  const { edge, pos } = spot;
  const angle = ANGLE[edge];

  let left = 0;
  let top = 0;
  if (edge === "bottom") { left = pos * (width - SIZE); top = height - SIZE; }
  else if (edge === "top") { left = pos * (width - SIZE); top = 0; }
  else if (edge === "left") { left = 0; top = pos * (height - SIZE); }
  else { left = width - SIZE; top = pos * (height - SIZE); }

  const translateY = slide.interpolate({ inputRange: [0, 1], outputRange: [SIZE + 6, 0] });
  const headTilt = bob.interpolate({ inputRange: [0, 1], outputRange: ["-4deg", "4deg"] });
  const waveRotate = wave.interpolate({ inputRange: [0, 1], outputRange: ["-16deg", "18deg"] });
  const pawY = hello.interpolate({ inputRange: [0, 1], outputRange: [45, 0] });
  const notHello = hello.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const eyesOpen = blink.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const bubbleScale = hello.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        width: SIZE,
        height: SIZE,
        transform: [{ rotate: `${angle}deg` }, { translateY }],
      }}
    >
      {/* ULO: umiindayog sa leeg */}
      <Animated.View
        style={{ ...fill, transform: [{ rotate: headTilt }], transformOrigin: "50% 98%" }}
      >
        <Svg width={SIZE} height={SIZE} viewBox="0 0 130 130">
          {/* leeg */}
          <Ellipse cx="65" cy="132" rx="34" ry="16" fill={WHITE} stroke={DEEP} strokeWidth="3" />

          {/* tenga */}
          <Path d="M32 62 L27 26 L59 46 Z" fill={WHITE} stroke={DEEP} strokeWidth="3" strokeLinejoin="round" />
          <Path d="M98 62 L103 26 L71 46 Z" fill={WHITE} stroke={DEEP} strokeWidth="3" strokeLinejoin="round" />
          <Path d="M34 54 L32 36 L50 47 Z" fill={ROSE} />
          <Path d="M96 54 L98 36 L80 47 Z" fill={ROSE} />

          {/* ulo */}
          <Circle cx="65" cy="84" r="40" fill={WHITE} stroke={DEEP} strokeWidth="3" />

          {/* guhit sa noo */}
          <Path d="M59 47 L60 56" stroke={ROSE} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <Path d="M65 46 L65 56" stroke={ROSE} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <Path d="M71 47 L70 56" stroke={ROSE} strokeWidth="3" strokeLinecap="round" opacity="0.6" />

          {/* pisngi */}
          <Circle cx="38" cy="94" r="6" fill={ROSE} opacity="0.35" />
          <Circle cx="92" cy="94" r="6" fill={ROSE} opacity="0.35" />

          {/* ilong at bibig */}
          <Path d="M61 88 L69 88 L65 93 Z" fill={ROSE} />
          <Path d="M65 93 Q61 99 56 96" stroke={DEEP} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <Path d="M65 93 Q69 99 74 96" stroke={DEEP} strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* balbas */}
          <Line x1="32" y1="90" x2="14" y2="85" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
          <Line x1="32" y1="97" x2="14" y2="99" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
          <Line x1="98" y1="90" x2="116" y2="85" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
          <Line x1="98" y1="97" x2="116" y2="99" stroke={DEEP} strokeWidth="2" strokeLinecap="round" />
        </Svg>

        {/* mata: bukas at kumukurap, tahimik */}
        <Animated.View style={{ ...fill, opacity: notHello }}>
          <Animated.View style={{ ...fill, opacity: eyesOpen }}>
            <Svg width={SIZE} height={SIZE} viewBox="0 0 130 130">
              <Circle cx="49" cy="80" r="7" fill={DEEP} />
              <Circle cx="81" cy="80" r="7" fill={DEEP} />
              <Circle cx="51.5" cy="77.5" r="2.4" fill={WHITE} />
              <Circle cx="83.5" cy="77.5" r="2.4" fill={WHITE} />
            </Svg>
          </Animated.View>
          <Animated.View style={{ ...fill, opacity: blink }}>
            <Svg width={SIZE} height={SIZE} viewBox="0 0 130 130">
              <Path d="M42 81 L56 81" stroke={DEEP} strokeWidth="3.5" strokeLinecap="round" />
              <Path d="M74 81 L88 81" stroke={DEEP} strokeWidth="3.5" strokeLinecap="round" />
            </Svg>
          </Animated.View>
        </Animated.View>

        {/* mata: masaya (^ ^) kapag nag-hi */}
        <Animated.View style={{ ...fill, opacity: hello }}>
          <Svg width={SIZE} height={SIZE} viewBox="0 0 130 130">
            <Path d="M42 83 Q49 74 56 83" stroke={DEEP} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <Path d="M74 83 Q81 74 88 83" stroke={DEEP} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </Svg>
        </Animated.View>
      </Animated.View>

      {/* KAMAY na kumakaway: umaangat mula sa gilid */}
      <Animated.View style={{ ...fill, opacity: hello, transform: [{ translateY: pawY }] }}>
        <Animated.View
          style={{ ...fill, transform: [{ rotate: waveRotate }], transformOrigin: "76% 100%" }}
        >
          <Svg width={SIZE} height={SIZE} viewBox="0 0 130 130">
            <Path d="M99 136 Q109 114 106 92" stroke={DEEP} strokeWidth="19" fill="none" strokeLinecap="round" />
            <Path d="M99 136 Q109 114 106 92" stroke={WHITE} strokeWidth="13" fill="none" strokeLinecap="round" />
            <Circle cx="106" cy="86" r="11" fill={WHITE} stroke={DEEP} strokeWidth="3" />
            <Circle cx="106" cy="88" r="4" fill={ROSE} />
          </Svg>
        </Animated.View>
      </Animated.View>

      {/* PAA na nakakapit sa gilid */}
      <Svg width={SIZE} height={SIZE} viewBox="0 0 130 130" style={fill}>
        <Ellipse cx="38" cy="128" rx="14" ry="10" fill={WHITE} stroke={DEEP} strokeWidth="3" />
        <Ellipse cx="92" cy="128" rx="14" ry="10" fill={WHITE} stroke={DEEP} strokeWidth="3" />
        <Path d="M33 124 L33 129 M38 123 L38 129 M43 124 L43 129" stroke={ROSE} strokeWidth="2" strokeLinecap="round" />
        <Path d="M87 124 L87 129 M92 123 L92 129 M97 124 L97 129" stroke={ROSE} strokeWidth="2" strokeLinecap="round" />
      </Svg>

      {/* Hi! bubble, kontra-ikot para laging tuwid ang text */}
      <Animated.View
        style={{
          position: "absolute",
          top: -12,
          left: -16,
          opacity: hello,
          transform: [{ rotate: `${-angle}deg` }, { scale: bubbleScale }],
        }}
      >
        <View className="rounded-full bg-[#8E1145] px-3 py-1">
          <Text className="text-sm font-bold text-white">Hi! Welcome</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default CatPeek;