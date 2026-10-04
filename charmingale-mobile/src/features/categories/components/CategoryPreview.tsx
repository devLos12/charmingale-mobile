import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCategoryStore } from "../store";
import { router } from "expo-router";

const CategoryPreview = () => {

  const { categories } = useCategoryStore();

  const handleNavigate = (colorName: string) => {
    router.push({
      pathname: "/categories/[colorName]",
      params: { colorName: colorName },
    });
  };

  
  return (
    categories.map((data, i) => {

      // index 0 laging unlocked, the rest unlock kapag tapos na yung previous category
      const isUnlocked = i === 0 || categories[i - 1].isCompleted;

      return (
        <View className="px-5 mb-6" key={i}>
          <View className="bg-white rounded-2xl p-5 border border-rose/10">
            <View className="flex-row gap-2 mb-1">

              <View className="flex-row items-baseline gap-2">
                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: data.colorHex }} />
                <Text className="text-ink text-base font-bold">{data.colorName}</Text>
              </View>
              <Text
                className="text-ink text-base font-bold flex-1"
                numberOfLines={10}
                ellipsizeMode="tail"
              >
                — {data.categoryName}
              </Text>
            </View>

            <Text className="text-muted text-xs mb-4">
              {data.topicDone} / {`${data.topicTotal} topics total`}
            </Text>

            <TouchableOpacity
              className={`bg-rose rounded-xl py-3.5 items-center flex-row justify-center gap-2 ${isUnlocked ? "opacity-100" : "opacity-75"}`}
              onPress={() => handleNavigate(data.colorName)}
              disabled={!isUnlocked}
            >
              <Feather name={isUnlocked ? "play" : "lock"} size={14} color="#FFFFFF" />
              <Text className="text-white font-semibold text-sm">Continue studying</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    })
  );
};

export default CategoryPreview;