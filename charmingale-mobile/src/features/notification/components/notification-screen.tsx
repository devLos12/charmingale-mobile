import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { router } from 'expo-router';
import { useNotificationStore } from '../store';
import LoadingScreen from '@/components/common/loadingScreen';
import { NotificationList } from './notification-list';




export const NotificationScreen = () => {
    const { loadingNotification, notification } = useNotificationStore();
    const unreadCount = notification.filter((item) => !item.read).length;


    if (loadingNotification) return <LoadingScreen />;


    return (
        <SafeAreaView className="flex-1 bg-blush">
            <View className="flex-row items-center gap-3 bg-transparent p-6">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center rounded-full bg-rose/10"
                        activeOpacity={0.8}
                    >
                        <Feather name="arrow-left" size={20} color="#8E1145" />
                    </TouchableOpacity>

                    <View className="flex-1 flex-row items-center justify-between">
                        <Text className="text-xl font-semibold text-roseDeep">Notifications</Text>

                        {unreadCount > 0 && (
                            <View className="rounded-full bg-rose/10 px-2.5 py-1">
                                <Text className="text-sm font-medium text-roseDeep">{unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>

            <View className="flex-1 px-4 pb-6 pt-4">
                <NotificationList notification={notification} />
            </View>


        </SafeAreaView>
    );
};