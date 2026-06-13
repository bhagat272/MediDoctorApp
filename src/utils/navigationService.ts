import { DeviceEventEmitter, Platform } from "react-native";
import { requestNotifications } from "react-native-permissions";
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import { handleNotificationNavigationFromPayload } from "../utils/notificationNavigationHandler";
import { profileAction } from "../redux/actions/userSessionAction";
import store from "../redux/store";
import { handlePush } from "../navigation/navigationService";
// import { show } from "./VoipBackgroundHandler";
// import RNCallKeep from "react-native-callkeep";

export const setupNotificationService = async () => {
  try {
    const permission = await requestNotifications(["alert", "sound"]);

    if (permission.status !== "granted") {
      return;
    }

    // Android requires a channel for ANY notification
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      sound: "default",
      importance: AndroidImportance.HIGH,
    });

    // Set up background event handler
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log("Notifee background event received:", type, detail);

      if (type === EventType.PRESS) {
        console.log("Background notification pressed:", detail.notification);
        // Navigation will be handled when app starts
        // The initial notification handler in index.js will catch this
      }
    });
  } catch (error) {
    console.log("Setup notification service error:", error);
  }
};

export const displayNotification = async (remoteMessage: any) => {
  try {
    console.log(
      ">>>>>>>>>>>>>> Displaying notification with payload:",
      remoteMessage,
    );
    const { notification, data } = remoteMessage;

    const formattedData = {
      type: data?.type || "",
      payload: data?.data || "",
    };

    await notifee.displayNotification({
      title: notification?.title || "Notification",
      body: notification?.body || "",
      android: {
        channelId: "default",
        smallIcon: "ic_launcher",
        sound: "default",
        importance: AndroidImportance.HIGH,
        pressAction: { id: "default", launchActivity: "default" },
      },
      data: formattedData,
    });
  } catch (error) {
    console.log("Display notification error:", error);
  }
};

type ParsedNotification = {
  type: string | null;
  data: Record<string, any> | null;
};

export const parseNotificationPayload = (
  remoteMessage: any,
): ParsedNotification => {
  try {
    const data = remoteMessage?.data ?? {};
    const { type = null, extras, ...rest } = data;

    let parsedExtras = null;

    if (extras) {
      parsedExtras = typeof extras === "string" ? JSON.parse(extras) : extras;
    } else if (Object.keys(rest).length > 0) {
      // fallback: use remaining data as payload
      parsedExtras = rest;
    }

    console.log("remoteMessage parseNotificationPayload", data);

    return {
      type,
      data: parsedExtras,
    };
  } catch (error) {
    console.log("❌ Notification parse error", error);
    return { type: null, data: null };
  }
};

export const registerNotificationListeners = () => {
  const unsubscribeOnMessage = messaging().onMessage(
    async (remoteMessage: any) => {
      console.log("notificationServices111", remoteMessage);

      const { type }: any = parseNotificationPayload(remoteMessage);
      if (
        type === "AGORA_AUDIO_CALL" ||
        type === "AGORA_VIDEO_CALL" ||
        type === "AGORA_CALL_CANCELED" ||
        type === "AGORA_VIDEO_CALL_DISCONNECT"
      ) {
        return;
      }
      console.log(
        "🔔 Foreground push received:",
        "type====>",
        type,
        remoteMessage,
      );

      store.dispatch(profileAction());
      if (type === "MISSED_CALL" || type === "AGORA_CALL_CANCELED") {
        // RNNotificationCall.hideNotification();
        if (Platform.OS === "ios") {
          // RNCallKeep.endAllCalls();
        }
      }

      // ✅ Only emit event for selected types
      if (
        type === "CHAT_MESSAGE" ||
        type === "CONNECTION_ACCEPTED" ||
        type === "GOAL_REMINDER" ||
        type === "admin_broadcast"
      ) {
        DeviceEventEmitter.emit("notification_received");
      }

      // ✅ Display notification ONLY for allowed types
      await displayNotification(remoteMessage);
    },
  );

  const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp(
    (remoteMessage) => {
      console.log("App opened from notification (background):", remoteMessage);
      const { type, data } = parseNotificationPayload(remoteMessage);

      if (
        type === "AGORA_AUDIO_CALL" ||
        type === "AGORA_VIDEO_CALL" ||
        type === "AGORA_CALL_CANCELED"
      ) {
        console.log("video callll", type);
        return;
      }

      if (remoteMessage) {
        handleNotificationNavigationFromPayload(remoteMessage);
      }
    },
  );

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      console.log("Initial notification (FCM):", remoteMessage);
      const { type } = parseNotificationPayload(remoteMessage);

      if (
        type === "AGORA_AUDIO_CALL" ||
        type === "AGORA_VIDEO_CALL" ||
        type === "AGORA_CALL_CANCELED"
      ) {
        return;
      }

      if (remoteMessage) {
        setTimeout(() => {
          handleNotificationNavigationFromPayload(remoteMessage);
        }, 2500);
      }
    });

  const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
    console.log("Notifee foreground event received:", type, detail);
    if (type === EventType.PRESS) {
      handleNotificationNavigationFromPayload(detail.notification);
    }
  });

  return () => {
    unsubscribeOnMessage();
    unsubscribeOnNotificationOpened();
    unsubscribeNotifee();
  };
};
