import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { NotificationProps } from "../types";
import { formatRelativeTime } from "@/lib/utils";
import { useUpdateNotification } from "../hooks/update-notification";
import { useNotificationStore } from "../store";




export const NotificationList = ({ notification }: NotificationProps) => {
  
  const { updateNotification, loadingUpdate, } = useUpdateNotification();

    
  if (notification.length === 0) {
    return (
      <View className="flex-1 items-center justify-center rounded-3xl border border-rose/10 bg-white/60 px-6 py-10">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-rose/10">
          <Ionicons name="notifications-off-outline" size={32} color="#C6195C" />
        </View>
        <Text className="text-base font-semibold text-ink">No notifications yet</Text>
        <Text className="mt-2 text-center text-xs text-muted">
          You will see updates here once something new arrives.
        </Text>
      </View>
    );
  }

  
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      className="flex-1"
    >
      {notification.map((data) => (
        <TouchableOpacity
          key={data.id}
          onPress={ async () => {

            if(loadingUpdate) return

            if (data.path ) router.push({ pathname: data.path as any });


            if(!data.read){
              const success = await updateNotification(data.id);
              
              if(success){
                useNotificationStore.setState((state) => ({
                  notification: state.notification.map((n) => 
                    n.id === data.id ? {...n, read: true } : n
                  )
                }))
              }
            }
          }}

          
          activeOpacity={0.8}
        className={`mb-3 flex-row items-start rounded-xl  p-4 bg-white`}
        >
          {!data.read && <View className={`mt-2 mr-3 h-2.5 w-2.5 rounded-full ${!data.read ? "bg-rose" : "bg-transparent"}`} />}

          <View className={`flex-1 flex-row items-center ${!data.read ? "opacity-100" : "opacity-75"}`}>
            <View className={data.read ? "ml-2 flex-1" : "flex-1"}>
              <Text className={`text-ink text-sm capitalize ${!data.read ? "font-semibold" : "font-normal"}`}>{data.title}</Text>
              <Text className={`capitalize mt-1 text-xs leading-5 text-muted ${!data.read ? "font-medium" : "font-normal"}`}>{data.body}</Text>

              <View className="flex-row items-center justify-between">
                <Text className={`text-[10px] text-muted ${!data.read ? "font-medium" : "font-normal" }`}>
                  {formatRelativeTime(data.createdAt)}
                </Text>
              </View>
            </View>
            
            {data.path && <Feather name="chevron-right" size={21} color="#A8748A" />}
          </View>

        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};