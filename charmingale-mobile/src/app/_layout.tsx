import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../../global.css";
import { useEffect } from "react";

import { registerForPushNotifications } from "@/lib/push";


const RootLayout = () => {


  useEffect(()=>{
    registerForPushNotifications();
    AsyncStorage.getItem('hasSeenOnboarding').then((seen) => {
      if (!seen) {
        setTimeout(() => router.replace('/onBoarding'), 0);
      }
    });
  },[]);
  
  
  return (

    <SafeAreaProvider >
      <Stack screenOptions={{ contentStyle: { backgroundColor: '#FDEDF2' } }}>
        <Stack.Screen name="onBoarding" options={{ headerShown: false }}/>
        <Stack.Screen name="index" options={{ headerShown: false }}/>
        <Stack.Screen name="categories/[colorName]" options={{ headerShown: false }}/>
        <Stack.Screen name="concept/[conceptId]" options={{ headerShown: false }}/>
        <Stack.Screen name="pdf-viewer" options={{ headerShown: false }}/>
        <Stack.Screen name="concept-completed" options={{ headerShown: false }}/>
        <Stack.Screen name="notification" options={{ headerShown: false }}/>
      </Stack>
    </SafeAreaProvider>
    
  );
};



export default RootLayout;