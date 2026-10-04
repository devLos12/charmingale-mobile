import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { useCategoryStore } from "../store";
import LoadingScreen from "@/components/common/loadingScreen";





const CategoryScreen = ({ colorName }: { colorName: string }) => {
    
    const { categoryTopics, getCategoryTopics, loading } = useCategoryStore();

    useEffect(() => {
        getCategoryTopics(colorName);
    }, [colorName]);
    
    

    const groupedTopics = useMemo(() => {
        const groups: Record<string, typeof categoryTopics> = {};

        categoryTopics.forEach((item) => {
            if (!groups[item.topicHeader]) groups[item.topicHeader] = [];
            groups[item.topicHeader].push(item);
        });

        return Object.entries(groups).sort(
            (a, b) => a[1][0].topicOrder - b[1][0].topicOrder
        );

    }, [categoryTopics]);

    
    const handleTopic = ( conceptId : number) => {
        router.push({
            pathname: '/concept/[conceptId]',
            params: { conceptId: conceptId }
        });
    }




    const allConceptsSorted = useMemo(() => {
        return [...categoryTopics].sort((a, b) => 
            a.topicOrder - b.topicOrder || a.conceptOrder - b.conceptOrder
        );
    }, [categoryTopics]);



    if(loading.isCategoryTopic) return <LoadingScreen/>
    
        

    return (
        <SafeAreaView className="flex-1 bg-blush" edges={['top']}>
            <View className="flex-row gap-3 items-center bg-transparent p-6">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center rounded-full bg-rose/10"
                    activeOpacity={0.8}
                >
                    <Feather name="arrow-left" size={20} color="#8E1145" />
                </TouchableOpacity>
                <Text className="text-roseDeep font-bold text-lg">Topics/Concepts</Text>
            </View>

            <ScrollView className="flex-1 px-5 pt-4">
            {groupedTopics.map(([topicHeader, concepts]) => (
                <View key={topicHeader} className="mb-6">
                
                {concepts[0].groupLabel ? (
                    <>
                        <Text className="text-ink font-bold text-base">{concepts[0].groupLabel}</Text>
                        <Text className="text-ink text-base mb-2">{topicHeader}</Text>
                    </>
                ): (
                    <Text className="text-ink font-bold text-base mb-2">{topicHeader}</Text>
                )}
                
                {concepts
                    .sort((a, b) => a.conceptOrder - b.conceptOrder)
                    .map((concept) => {

                        const globalIndex = allConceptsSorted.findIndex(c => c.id === concept.id);
                        const isUnlocked = globalIndex === 0 || allConceptsSorted[globalIndex - 1].completed;

                        
                        return (
                            <TouchableOpacity
                                onPress={() => isUnlocked && handleTopic(concept.id)}
                                disabled={!isUnlocked}
                                key={concept.id}
                                className={`bg-white rounded-xl p-4 mb-2 flex-row items-center justify-between ${!isUnlocked ? 'opacity-50' : ''}`}
                            >
                                <View className="flex-col flex-1 mr-3 bg">
                                    <Text className="text-ink text-sm"
                                    numberOfLines={3}
                                    >{concept.conceptText}</Text>
                                    <Text className="text-muted text-xs">{concept.allocatedMinutes}min</Text>
                                </View>

                                {concept.completed ? (
                                    <Feather name="check-circle" size={16} color="#16a34a" />
                                ) : isUnlocked ? (
                                    <Feather name="unlock" size={16} color="#999" />
                                ) : (
                                    <Feather name="lock" size={16} color="#999" />
                                )}
                            </TouchableOpacity>
                        );
                    })
                }

                </View>
            ))}
            </ScrollView>
        </SafeAreaView>
  );
};

export default CategoryScreen;