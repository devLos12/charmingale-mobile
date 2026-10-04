import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

import { BASE_URL } from "@/constant";
import { ApiResponse } from "@/@types";
import { getToken } from "@/lib/google";




Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // shows as banner while app is foregrounded
    shouldShowList: true,   // shows in notification list/center
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});




/** Request permission, kunin ang Expo push token, i-send sa backend. Tawagin sa root layout mount. */
export const registerForPushNotifications = async () => {

  if (!Device.isDevice) {
    console.log("Push notifications need a physical device.");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#C6195C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permission denied.");
    return null;
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    console.log("Missing EAS project ID.");
    return null;
  }

  const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;



  // i-send sa backend para masave sa DeviceToken table
  try {
    
    
    const res = await fetch(`${BASE_URL}/api/notification/push-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify({ token: pushTokenString }),
    });
    
    const data: ApiResponse = await res.json();
    if(!res.ok || !data.success) throw new Error(data.message);

    if(data.success) console.log(data.message);

  } catch (err) {
    console.log("Failed to register push token:", err instanceof Error && err.message);
  }

  return pushTokenString;
};