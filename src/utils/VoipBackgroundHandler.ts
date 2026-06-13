// voipCall.js

/**
 * This file handles all VOIP call notification logic:
 * - Shows incoming full-screen call UI
 * - Handles Answer & Decline events
 * - Handles call disconnect logic
 * - Works for both FCM (foreground/background) and Notifee
 */

import messaging from "@react-native-firebase/messaging";
import RNNotificationCall from "react-native-full-screen-notification-incoming-call";
import { DeviceEventEmitter, Linking, Platform } from "react-native";

import PushNotification from "react-native-push-notification";
import {
  socketConnectionCheck,
  socketEmit,
  socketEvent,
  socketIsConnected,
  socketReconnect,
} from "../utils/socket";
import { VoipCallAccept, VoipCallData } from "../redux/apis/commonValue";
import { getData, removeItemValue, setData } from "../redux/apis/keyChain";
import { socketInstance } from "../utils/helper";
// import { joinedRoom } from "../utils/socket";
import RNCallKeep from "react-native-callkeep";

/* -------------------------------------------------------------------------- */
/*                           SHOW INCOMING CALL SCREEN                        */
/* -------------------------------------------------------------------------- */
/**
 * Displays full-screen incoming call UI using RNNotificationCall.
 * This works for both Android & iOS (with CallKeep).
 */
const show = async (payLoad: any) => {
  try {
    const userObject = payLoad;
    const dic = { data: userObject };
    console.log("🔵 [SHOW] userObject:", userObject);

    // ✅ CRITICAL: Await both setData calls to ensure persistence in kill mode
    await setData(VoipCallData, dic);
    // await setData(VoipCallAccept, "true");

    console.log("✅ [SHOW] Data saved to keychain");

    // Determine caller name (Group vs Single)
    const callerName = userObject?.sender_name;

    // ✅ Verify data was saved (for debugging)
    const getuserData: any = await getData(VoipCallData);
    console.log("🔍 [SHOW] Verification - Retrieved data:", getuserData);

    if (getuserData) {
      console.log("📞 [SHOW] Displaying notification for:", callerName);
      RNNotificationCall.displayNotification(
        // Unique UUID for call
        "22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad",
        null,
        60000, // timeout in ms
        {
          channelId: "com.medidoctor.app",
          channelName: "Incoming video call",
          notificationIcon: "ic_launcher",
          notificationTitle: callerName || "Unknown Caller",
          notificationBody: "Incoming call",
          answerText: "Answer",
          declineText: "Decline",
          notificationColor: "colorAccent",
          isVideo: false,
          notificationSound: '',
          payload: { name: payLoad }, // Pass payload for later reference
        },
      );
    } else {
      console.error(
        "❌ [SHOW] Data verification failed - notification not displayed",
      );
    }
  } catch (error) {
    console.error("❌ [SHOW] Error in show function:", error);
  }
};

/* -------------------------------------------------------------------------- */
/*                         DISCONNECT / DECLINE HANDLER                       */
/* -------------------------------------------------------------------------- */
/**
 * Called when user declines call or caller disconnects.
 * It ensures socket is connected, then emits call_disconnect event.
 */
const methodCallDisconnect = (payload: any) => {
  if (!socketIsConnected() && socketInstance.socket) {
    socketReconnect();
  }

  // Remove incoming call screen
  RNNotificationCall.backToApp();

  socketEmit(
    socketEvent.call_disconnect,
    {
      other_user_id: payload?.sender,
      user_id: global?.userData?.id,
      call_type: payload?.call_type,
      isGroup: payload?.isGroup,
    },
    (res) => { },
  );
};

/* -------------------------------------------------------------------------- */
/*                     EVENT: User Taps "Answer" on Incoming UI               */
/* -------------------------------------------------------------------------- */
RNNotificationCall.addEventListener("answer", async (data: any) => {
  RNNotificationCall.backToApp();
  try {
    console.log("🟢 [ANSWER] Answer button tapped, raw data:", data);

    const userObject = JSON?.parse(data?.payload)?.name;
    console.log("🟢 [ANSWER] Parsed userObject:", userObject);

    const dic = { data: userObject };

    // Remove all pending notifications
    PushNotification?.cancelAllLocalNotifications();

    // ✅ CRITICAL: Await both setData calls to ensure persistence before deep link
    console.log("💾 [ANSWER] Saving data to keychain...");
    await setData(VoipCallData, dic);
    await setData(VoipCallAccept, "true");
    console.log("✅ [ANSWER] Data saved successfully");

    // ✅ Verify data was saved (for debugging in kill mode)
    const verification = await getData(VoipCallData);
    console.log("🔍 [ANSWER] Verification - Data in keychain:", verification);

    // ✅ Small delay to ensure data is fully persisted (especially important in kill mode)
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Open app & route to call screen (deep link)
    // console.log("🔗 [ANSWER] Opening deep link: medidoctor://Home");
    // Linking?.openURL("medidoctor://").catch((err) => {
    //   console.error("❌ [ANSWER] Deep link failed:", err);
    // });

    // Notify app listeners
    console.log("📡 [ANSWER] Emitting receiver_call_connect_voip event");
    DeviceEventEmitter.emit("receiver_call_connect_voip", dic);
  } catch (error) {
    console.error("❌ [ANSWER] Error in answer handler:", error);
  }
});

/* -------------------------------------------------------------------------- */
/*                     EVENT: User Taps "Decline" on Incoming UI              */
/* -------------------------------------------------------------------------- */
RNNotificationCall.addEventListener("endCall", (data) => {
  try {
    const parsedPayload = JSON.parse(data?.payload || "{}");

    const payLoad = {
      sender: parsedPayload?.name?.sender,
      call_type: parsedPayload?.name?.call_type,
      isGroup: parsedPayload?.name?.isGroup,
    };

    methodCallDisconnect(payLoad);
  } catch (error: any) {
    console.error("❌ JSON.parse error:", error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                     BACKGROUND PUSH HANDLER (App KILLED)                   */
/* -------------------------------------------------------------------------- */
/**
 * Triggered when device receives push in background / killed state.
 */
messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
  console.log("remoteMessage>>>>>>>>>>>>>>>>>>***", remoteMessage);
  socketConnectionCheck();

  if (!remoteMessage?.data) return;

  const payLoad = JSON.parse(remoteMessage?.data?.extras);
  console.log("payLoad", payLoad);
  // Disconnect events
  // if (
  //   payLoad?.notification_type === "AGORA_VIDEO_CALL_DISCONNECT" ||
  //   payLoad?.notification_type === "AGORA_AUDIO_CALL_DISCONNECT" ||
  //   remoteMessage?.data?.type === "AGORA_CALL_CANCELED"
  // ) {
  //   RNNotificationCall.hideNotification();
  //   return;
  // }
  if (
    payLoad?.notification_type === "AGORA_VIDEO_CALL_DISCONNECT" ||
    payLoad?.type === "AGORA_VIDEO_CALL_DISCONNECT" ||
    payLoad?.notification_type === "AGORA_AUDIO_CALL_DISCONNECT" ||
    remoteMessage?.data?.type === "AGORA_CALL_CANCELED"
  ) {
    removeItemValue(VoipCallAccept);
    removeItemValue(VoipCallData);
    RNNotificationCall.hideNotification();
    if (Platform.OS === 'ios') {
      RNCallKeep.endAllCalls()
    }
    return;
  }
  const { callUUID } = payLoad || {};

  // Incoming call while app is already open
  if (callUUID) {
    try {
      show(payLoad?.data);
    } catch (err) {
      console.error("Error displaying incoming call in foreground:", err);
    }
  }
});

/* -------------------------------------------------------------------------- */
/*                     FOREGROUND PUSH HANDLER (App OPEN)                     */
/* -------------------------------------------------------------------------- */
messaging().onMessage(async (remoteMessage: any) => {
  console.log("remoteMessage>>>>>>>>>>>>>>>>>>***", remoteMessage);
  socketConnectionCheck();
  if (!remoteMessage?.data) return;

  const payLoad = JSON.parse(remoteMessage?.data?.extras);
  console.log("payLoad", payLoad);
  // Disconnect events
  if (
    payLoad?.notification_type === "AGORA_VIDEO_CALL_DISCONNECT" ||
    payLoad?.type === "AGORA_VIDEO_CALL_DISCONNECT" ||
    payLoad?.notification_type === "AGORA_AUDIO_CALL_DISCONNECT" ||
    remoteMessage?.data?.type === "AGORA_CALL_CANCELED"
  ) {
    removeItemValue(VoipCallAccept);
    removeItemValue(VoipCallData);
    RNNotificationCall.hideNotification();
    if (Platform.OS === 'ios') {
      RNCallKeep.endAllCalls()
    }
    return;
  }

  const { callUUID } = payLoad || {};

  // Incoming call while app is already open
  if (callUUID) {
    try {
      show(payLoad?.data);
    } catch (err) {
      console.error("Error displaying incoming call in foreground:", err);
    }
  }
});
