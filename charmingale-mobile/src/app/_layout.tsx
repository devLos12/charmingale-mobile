import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import "../../global.css";
import { useEffect } from "react";

import { getToken } from "@/lib/google";
import { View } from "react-native";



const NavBarFade = () => {
  const insets = useSafeAreaInsets();
  const layers = 40;
  const total = insets.bottom + 40; // haba ng fade

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: total }}
    >
      {Array.from({ length: layers }).map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: total * (1 - i / layers),
            backgroundColor: "rgba(255,255,255,0.01)",
          }}
        />
      ))}
    </View>
  );
};


const RootLayout = () => {

  useEffect(()=>{

    (async () => {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      
      if (!seen) {
        setTimeout(() => router.replace('/onBoarding'), 0);
        return;
      }
            
      const token = await getToken();

      if (!token) {
        setTimeout(() => router.replace('/sign-in'), 0);
      }

    })();

  },[]);
  


    
  return (

    <SafeAreaProvider >
      <Stack screenOptions={{ contentStyle: { backgroundColor: '#FFF0F5' } }}>
        <Stack.Screen name="onBoarding" options={{ headerShown: false }}/>
        <Stack.Screen name="sign-in" options={{ headerShown: false }}/>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="categories/[colorName]" options={{ headerShown: false }}/>
        <Stack.Screen name="concept/[conceptId]" options={{ headerShown: false }}/>
        <Stack.Screen name="pdf-viewer" options={{ headerShown: false }}/>
        <Stack.Screen name="concept-completed" options={{ headerShown: false }}/>
        <Stack.Screen name="notification" options={{ headerShown: false }}/>
      </Stack>
      <NavBarFade />
    </SafeAreaProvider>
    
  );
};



export default RootLayout;