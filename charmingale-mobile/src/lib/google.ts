import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";



const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = "auth_token";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);



export const signOut = async () => {
  await GoogleSignin.signOut();
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};



export async function signInWithGoogle() {
  
  await GoogleSignin.hasPlayServices();

  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) return null; // nag-cancel ang user

  const idToken = response.data.idToken;

  const res = await fetch(`${API_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message);

  await SecureStore.setItemAsync(TOKEN_KEY, json.data.token);
  return json.data.user;
}