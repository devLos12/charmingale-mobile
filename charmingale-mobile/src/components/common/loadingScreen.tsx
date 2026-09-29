import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Animated, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Svg, { Path } from 'react-native-svg';




const AnimatedPath = Animated.createAnimatedComponent(Path);

const HEARTBEAT_PATH =
  "M0,75 L70,75 L90,60 L105,90 L125,65 L145,95 L175,20 L195,135 L220,80 L235,65 L250,80 L400,80";
const PATH_LENGTH = 620;


const LoadingScreen = () => {
    const dashOffset = useRef(new Animated.Value(PATH_LENGTH)).current;
    const textFade = useRef(new Animated.Value(0.4)).current;
    const [dots, setDots] = useState("");

    useEffect(() => {
        const beatLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(dashOffset, {
                    toValue: 0,
                    duration: 1400,
                    useNativeDriver: false,
                }),
                Animated.delay(400),
                Animated.timing(dashOffset, {
                    toValue: PATH_LENGTH,
                    duration: 0,
                    useNativeDriver: false,
                }),
            ])
        );

        const textLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(textFade, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(textFade, { toValue: 0.4, duration: 700, useNativeDriver: true }),
            ])
        );

        beatLoop.start();
        textLoop.start();

        const dotInterval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 400);

        return () => {
            beatLoop.stop();
            textLoop.stop();
            clearInterval(dotInterval);
        };
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-blush items-center justify-center">
            
            <View className="items-center">
                <Svg width={180} height={65} viewBox="0 0 400 150">
                    {/* base light track - laging visible */}
                    <Path
                        d={HEARTBEAT_PATH}
                        stroke="#F5A9C0"
                        strokeWidth={8}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* dark sweep na gumaguhit papunta sa kanan */}
                    <AnimatedPath
                        d={HEARTBEAT_PATH}
                        stroke="#C6195C"
                        strokeWidth={8}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={PATH_LENGTH}
                        strokeDashoffset={dashOffset}
                    />
                </Svg>

                <Animated.Text
                    style={{ opacity: textFade }}
                    className="text-muted text-xs mt-1"
                >
                    Loading{dots}
                </Animated.Text>
            </View>
        </SafeAreaView>
    );
};

export default LoadingScreen;