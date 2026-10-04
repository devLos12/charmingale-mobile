import { useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { signInWithGoogle } from "@/lib/google";
import { registerForPushNotifications } from "@/lib/push";

import GoogleLogo from "@/components/common/google-logo";
import CatPeek from "@/components/common/cat-hi";


export default function SignIn() {
  const [loading, setLoading] = useState(false);


  const handleSignIn = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle();

      if (user) {
        await registerForPushNotifications();
        router.replace("/");
      }

    } catch (error) {

      Alert.alert(
        "Sign in failed",
        error instanceof Error ? error.message : "Please try again"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <View className="flex-1 items-center justify-center overflow-hidden px-8">
      <CatPeek />

      <View className="bg-roseDeep rounded-3xl mb-5">
        <Image
          source={require("@/assets/images/charmingale.png")}
          style={{ width: 96, height: 96, borderRadius: 24 }}
        />
      </View>

      <Text className="text-3xl font-bold text-[#8E1145]">Charmingale</Text>
      <Text className="mt-2 mb-10 text-center text-gray-600">
        Sign in to start your PNLE review
      </Text>

      <Pressable
        onPress={handleSignIn}
        disabled={loading}
        className={`w-full flex-row items-center justify-center gap-3 rounded-full bg-[#8E1145] py-4 ${loading ? "opacity-50" : ""}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <View className={`h-7 w-7 items-center justify-center rounded-full bg-white`} >
              <GoogleLogo size={16} />
            </View>
            <Text className="text-base font-semibold text-white">
              Continue with Google
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}