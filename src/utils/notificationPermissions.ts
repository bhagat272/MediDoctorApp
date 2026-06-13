import firebase from "@react-native-firebase/app";
import { Platform } from "react-native";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { kUserFCMToken } from "../redux/apis/commonValue";
import { DEVICE_INFO } from "./helper";
import { getData, setData } from "../redux/apis/keyChain";

const messaging = firebase.messaging();

const IS_IOS = Platform.OS === "ios";

export async function updateDeviceToken() {
  try {
    let token: string | null = null;
    if (IS_IOS) {
      token = await getFCMToken();
    } else {
      token = await checkFirebasePermission();
    }

    return token;
  } catch (error) {
    console.error("Error updating device token:", error);
    return null;
  }
}

export async function getFCMToken(): Promise<string | null> {
  console.log("getFCMToken");
  try {
    const cachedToken = await getData<string>(kUserFCMToken);
    if (cachedToken) {
      console.log("Using cached FCM token:", cachedToken);
      DEVICE_INFO.device_token = cachedToken;
      return cachedToken;
    }

    if (IS_IOS) {
      await messaging.registerDeviceForRemoteMessages();
    }

    console.log("Fetching new FCM token...");
    const fcmToken = await messaging.getToken();

    if (fcmToken) {
      DEVICE_INFO.device_token = fcmToken;
      await setData(kUserFCMToken, fcmToken);
      console.log("New FCM token saved:", fcmToken);
    } else {
      console.warn("No FCM token returned from Firebase");
    }

    return fcmToken;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

export async function checkFirebasePermission(): Promise<string | null> {
  try {
    const permissionGranted = await messaging.hasPermission();
    if (permissionGranted) {
      return await getFCMToken();
    } else {
      return await requestFirebasePermission();
    }
  } catch (error) {
    console.error("Error checking Firebase permission:", error);
    return null;
  }
}

export async function requestFirebasePermission(): Promise<string | null> {
  try {
    const permissionGranted = await messaging.requestPermission();
    if (permissionGranted) {
      return await getFCMToken();
    } else {
      console.warn("User denied notification permission");
      return null;
    }
  } catch (error) {
    console.error("Error requesting Firebase permission:", error);
    return null;
  }
}
 
export const requestAndroidNotificationPermission =
  async (): Promise<boolean> => {
    if (Platform.OS !== "android") return true;
    if (Platform.Version < 33) return true;

    const status = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    console.log("Android notification permission status:", status);

    if (status === RESULTS.GRANTED) return true;

    if (status === RESULTS.DENIED) {
      const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      console.log("Android notification permission request result:", result);
      return result === RESULTS.GRANTED;
    }

    return false; // blocked / unavailable
  };

export function listenForFCMTokenRefresh() {
  messaging.onTokenRefresh(async (newToken) => {
    console.log("FCM token refreshed:", newToken);
    DEVICE_INFO.device_token = newToken;
    await setData(kUserFCMToken, newToken);
  });
}
