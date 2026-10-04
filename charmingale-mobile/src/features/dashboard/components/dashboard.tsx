

import { View, Text, ScrollView, TouchableOpacity, Image, Animated, RefreshControl, Modal, Pressable } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";

import { useCategoryStore } from "@/features/categories/store";
import { CategoryPreview } from "@/features/categories";
import LoadingScreen from "@/components/common/loadingScreen";
import { useDashboardStore } from "../store";
import { formatStudiedTime } from "@/lib/utils";
import { router } from "expo-router";
import { signOut } from "@/lib/google";


import { useNotificationStore } from "@/features/notification/store";




const MOTIVATION_MESSAGES = [
  "One concept at a time. You've got this. 💪",
  "Future RN in the making, keep going! 🎓",
  "You don't need to be perfect, just consistent. 🌷",
  "Tired? Rest, but don't quit. 🤍",
  "Every topic you finish is a step closer to the PNLE. ✨",
  "Believe in yourself. You're more ready than you think. 💗",
  "Small progress is still progress. 🌸",
];



const Dashboard = () => {

  const { loading, getCategories } = useCategoryStore();
  const {
    getDashboardStats,
    totalTopics, completedTopics, totalStudiedSeconds, streakCounts,
    isLoading, name
  } = useDashboardStore();
  const { notification, getNotification, loadingNotification } = useNotificationStore();
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  const [msgIndex, setMsgIndex] = useState(() => Math.floor(Math.random() * MOTIVATION_MESSAGES.length));
  const fade = useRef(new Animated.Value(1)).current;



  const loadDashboard = async () => {
    try {
      await Promise.all([
        getCategories(),
        getDashboardStats(),
        getNotification(),
      ]);
      
    } catch (err) {
      // optional: handle error, e.g. Alert.alert("Error", "Failed to load dashboard")
      console.error(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboard();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    router.replace("/sign-in");
  };

  useEffect(() => {
    loadDashboard();
  }, []);



  

  // loop motivation message: fade out -> next message -> fade in
  useEffect(() => {
    const timer = setInterval(() => {

      Animated.timing(fade, { toValue: 0, duration: 1000, useNativeDriver: true }).start(() => {
        setMsgIndex((prev) => (prev + 1) % MOTIVATION_MESSAGES.length);
        Animated.timing(fade, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
      });

    }, 6000);
    return () => clearInterval(timer);
  
  }, []);



  
  if (loading.isCategory || isLoading || loadingNotification) return <LoadingScreen />


  const percent = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
  // assumes 120 mins per concept (allocatedMinutes sa seed)
  const hoursLeft = Math.round(((totalTopics - completedTopics) * 120) / 60);



  const getDisplayName = (name: string | null) => {
    if (!name) return "there";

    const first = name.trim().split(/[\s-]+/)[0];

    // Shiermae-Safhiera, Shiermae Safhiera, shiermae safhiera -> Charmy
    if (first.toLowerCase() === "shiermae") return "Charm";

    return first;
  };



  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']} >

      {/* Header */}
      <View className="px-5 py-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="bg-roseDeep rounded-2xl">
            <Image
              source={require("@/assets/images/charmingale.png")}
              style={{ width: 36, height: 36, borderRadius: 10 }}
            />
          </View>

          <Text className="text-roseDeep text-2xl font-bold">Charmingale</Text>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="rounded-full p-2 bg-rose/10"
            onPress={() => router.push({ pathname: "/notification" })}
          >
            <View>
              <Ionicons name="notifications" size={20} color="#C6195C" />
              {
                (() => notification.some((n) => !n.read)
                  ? <View className="absolute top-0 right-0 w-2 h-2 rounded-full bg-roseDeep" />
                  : null
                )()
              }
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-full p-2 bg-rose/10"
            onPress={() => setMenuOpen(true)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#C6195C" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable className="flex-1" onPress={() => setMenuOpen(false)}>
          <View
            className="absolute right-5 top-24 bg-white rounded-2xl border border-rose/10 py-2 w-44"
            style={{ elevation: 6 }}
          >
            <TouchableOpacity
              className="flex-row items-center gap-3 px-4 py-3"
              onPress={handleSignOut}
            >
              <Feather name="log-out" size={16} color="#C6195C" />
              <Text className="text-roseDeep font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
            
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}
            
      refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#C6195C"]}
            tintColor="#C6195C"
          />
        }
      
      
      >
        {/* Greeting */}
        <View className="px-5 pt-2 pb-3">
          <Text className="text-ink text-lg font-bold">Hello, {getDisplayName(name)} RN! 👋</Text>
          <Animated.View style={{ opacity: fade, minHeight: 32 }}>
            <Text className="text-muted text-sm mt-1">{MOTIVATION_MESSAGES[msgIndex]}</Text>
          </Animated.View>
        </View>

        {/* Hero progress card */}
        <View className="mx-5 mb-4 bg-white rounded-2xl p-5 border border-rose/10">
          <Text className="text-muted text-[10px] uppercase tracking-wide mb-1.5 font-semibold">
            Overall Progress
          </Text>
          <View className="flex-row items-end gap-2 mb-4">
            <Text className="text-ink text-5xl font-bold">{completedTopics}</Text>
            <Text className="text-muted text-base font-medium mb-1.5">/{totalTopics} Topics done</Text>
          </View>

          {/* Progress bar */}
          <View className="h-2 bg-blush rounded-full overflow-hidden mb-1 ">
            <View
              className="h-full bg-rose rounded-full"
              style={{ width: `${percent}%` }}
            />
          </View>
          
          
          <Text className="text-muted text-[10px]">
            {Math.round(percent)}% complete
          </Text>
        </View>

        {/* Quick stat cards row */}
        <View className="flex-row gap-3 px-5 mb-4">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-rose/10">
            <View className="w-8 h-8 rounded-full bg-blush items-center justify-center mb-2">
              <Feather name="target" size={14} color="#C6195C" />
            </View>
            <Text className="text-ink text-xl font-bold">{hoursLeft}h</Text>
            <Text className="text-muted text-[10px]">Hours left</Text>
          </View>

          <View className="flex-1 bg-white rounded-2xl p-4 border border-rose/10">
            <View className="w-8 h-8 rounded-full bg-blush items-center justify-center mb-2">
              <Feather name="clock" size={14} color="#C6195C" />
            </View>
            <Text className="text-ink text-xl font-bold">{formatStudiedTime(totalStudiedSeconds)}</Text>
            <Text className="text-muted text-[10px]">Studied</Text>
          </View>

          <View className="flex-1 bg-white rounded-2xl p-4 border border-rose/10">
            <View className="w-8 h-8 rounded-full bg-gold/15 items-center justify-center mb-2">
              <Feather name="zap" size={14} color="#C79A46" />
            </View>
            <Text className="text-ink text-xl font-bold">{streakCounts}</Text>
            <Text className="text-muted text-[10px]">Day streak</Text>
          </View>
        </View>

        {/* Categories */}
        <View className="px-5 mb-2 mt-6">
          <Text className="text-ink font-bold">List Category topics</Text>
        </View>

        <CategoryPreview />

      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;