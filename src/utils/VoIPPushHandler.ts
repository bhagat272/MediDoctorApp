// import VoipPushNotification, {
//   VoipNotification,
//   VoipPushEvent,
// } from "react-native-voip-push-notification";
// import RNCallKeep, { CallKeepOptions } from "react-native-callkeep";
// import { DeviceEventEmitter, AppState, Platform } from "react-native";
// import { removeItemValue, setData, getData } from "../redux/apis/keyChain";
// import { VoipCallAccept, VoipCallData } from "../redux/apis/commonValue";
// import {
//   socketConnectionCheck,
//   socketEmit,
//   socketEvent,
//   socketInit,
//   socketIsConnected,
//   socketReconnect,
// } from "../utils/socket";
// import { socketInstance } from "../utils/helper";
// import { setVoipCallAccepted } from "../utils/voipState";

// let currentVoipData: any = null; // Current incoming call payload
// let isCallKeepAccept = false; // Tracks if user has answered via CallKeep
// let isEndCallHandled = false; // Prevents multiple endCall executions
// let lastAnswerTime = 0; // Timestamp when call was answered
// let isCallActive = false; // Tracks if call is currently active
// let answeredCallUUID: string | null = null; // Tracks answered call UUID

// const callKeepOptions: CallKeepOptions = {
//   ios: {
//     appName: "MediDoctor", // Required for iOS
//   },
// };

// export const setupCallKeep = async (): Promise<void> => {
//   await RNCallKeep.setup(callKeepOptions);
//   RNCallKeep.setAvailable(true);
// };

// export const methodCallDisconnect = () => {
//   if (!currentVoipData) return;

//   RNCallKeep.endAllCalls();

//   if (!socketIsConnected() && socketInstance.socket) {
//     socketReconnect();
//   }
//   console.log("currentVoipData>>>>>>>", currentVoipData);

//   // 🔹 Extract data from nested structure
//   const callData = currentVoipData?.data || currentVoipData;
//   console.log("callData", callData);
//   const data: any = {
//     group_id: callData?.group,
//     user_id: global.userData?.id,
//     call_type: callData?.call_type || "video", // Use call_type from payload
//     call_token: callData?.call_token,
//     other_user_id: callData?.sender,
//   };

//   // Check if it's a group call
//   if (callData?.group) {
//     data.group_id = callData?.group;
//   }

//   console.log("data>>>>>> IOS", data);
//   console.log(
//     "SOcket Connect When show hit the socket",
//     socketConnectionCheck(),
//   );
//   socketEmit(socketEvent.reject_call, data, (res) => {
//     console.log("res>>>>>> IOS>>>> after socket hit", res);
//     DeviceEventEmitter.emit("voip_call_cut");
//     cleanupCallState();
//   });
// };

// const cleanupCallState = () => {
//   currentVoipData = null;
//   isCallKeepAccept = false;
//   isEndCallHandled = false;
//   isCallActive = false;
//   lastAnswerTime = 0;
//   answeredCallUUID = null;

//   removeItemValue(VoipCallData);
//   removeItemValue(VoipCallAccept);
// };

// const saveVoipData = async (data: any) => {
//   currentVoipData = data;
//   await setData(VoipCallData, data);
// };

// VoipPushNotification.addEventListener(
//   "notification",
//   async (notification: VoipNotification) => {
//     console.log("notification>>>>>>>>> IOS ", notification);
//     await socketConnectionCheck();
//     await socketReconnect();

//     // 🔹 Extract the nested data structure
//     const voipData =
//       notification?.data?.data || notification?.data || notification;
//     await saveVoipData(voipData);

//     // Reset flags for new call
//     isEndCallHandled = false;
//     isCallActive = false;
//     lastAnswerTime = 0;
//     answeredCallUUID = null;

//     if (voipData?.notification_type === "AGORA_VIDEO_CALL_DISCONNECT") {
//       RNCallKeep.endAllCalls();
//       cleanupCallState();
//       return;
//     }
//   },
// );

// VoipPushNotification.addEventListener(
//   "didLoadWithEvents",
//   async (events: VoipPushEvent[]) => {
//     await socketInit();
//     // await socketConnectionCheck();
//     // await socketReconnect();
//     if (!Array.isArray(events)) return;

//     for (const event of events) {
//       const { name, data } = event;
//       console.log("Load event Data", data);
//       if (
//         name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
//       ) {
//         // 🔹 Extract the nested data structure
//         const voipData = data?.data?.data || data?.data || data;
//         await saveVoipData(voipData);

//         isEndCallHandled = false;
//         isCallActive = false;
//         lastAnswerTime = 0;
//         answeredCallUUID = null;

//         if (voipData?.notification_type === "AGORA_VIDEO_CALL_DISCONNECT") {
//           RNCallKeep.endAllCalls();
//           cleanupCallState();
//           continue;
//         }
//       }
//     }
//   },
// );

// RNCallKeep.addEventListener("answerCall", async ({ callUUID }) => {
//   socketConnectionCheck();
//   RNCallKeep.backToForeground();
//   if (Platform.OS === "android") return;

//   console.log(
//     "************************************** IOS ANSWER******************",
//     currentVoipData,
//   );

//   socketConnectionCheck();
//   if (!currentVoipData) {
//     const stored = await getData(VoipCallData);
//     console.log("stored>>>>>> IOS", stored);
//     if (stored) currentVoipData = stored;
//   }

//   if (!currentVoipData?.data && !currentVoipData?.group) return;

//   isCallKeepAccept = true;
//   isEndCallHandled = false;
//   isCallActive = true;
//   lastAnswerTime = Date.now();
//   answeredCallUUID = callUUID;

//   RNCallKeep.setCurrentCallActive(callUUID);

//   setVoipCallAccepted(true);

//   await setData(VoipCallAccept, "true");

//   socketReconnect();
//   console.log(
//     "**************************************currentVoipData",
//     currentVoipData,
//   );

//   // 🔹 Send the properly structured data
//   DeviceEventEmitter.emit("receiver_call_connect_voip", currentVoipData);
// });

// RNCallKeep.addEventListener("endCall", async ({ callUUID }) => {
//   RNCallKeep.backToForeground();
//   socketReconnect();
//   console.log("callUUID>>>>>> IOS", callUUID);
//   if (Platform.OS === "android") return;
//   const timeSinceAnswer = Date.now() - lastAnswerTime;
//   if (isCallActive && timeSinceAnswer < 3000) return;

//   if (isEndCallHandled) return;
//   console.log("answeredCallUUID>>>>>> IOS", answeredCallUUID);

//   if (answeredCallUUID && callUUID !== answeredCallUUID) return;
//   console.log("currentVoipData>>>>>> IOS", currentVoipData);

//   if (!currentVoipData) {
//     const stored = await getData(VoipCallData);
//     if (stored) currentVoipData = stored;
//   }
//   console.log("isCallActive>>>>>> IOS", isCallActive);

//   if (!currentVoipData && !isCallActive) return;

//   isEndCallHandled = true;
//   isCallActive = false;
//   console.log("currentVoipData>>>>>> IOS", currentVoipData);

//   setTimeout(() => {
//     socketReconnect();
//     methodCallDisconnect();
//   }, 100);
// });

// let previousAppState = AppState.currentState;

// AppState.addEventListener("change", (nextAppState) => {
//   if (
//     previousAppState.match(/inactive|background/) &&
//     nextAppState === "active" &&
//     isCallKeepAccept &&
//     !isCallActive
//   ) {
//     setTimeout(() => {
//       RNCallKeep.endAllCalls();
//       cleanupCallState();
//     }, 300);
//   }

//   previousAppState = nextAppState;
// });

// export const forceCleanupCall = () => {
//   RNCallKeep.endAllCalls();
//   cleanupCallState();
// };

// import VoipPushNotification, {
//   VoipNotification,
//   VoipPushEvent,
// } from "react-native-voip-push-notification";
// import RNCallKeep, { CallKeepOptions } from "react-native-callkeep";
// import { DeviceEventEmitter, AppState, Platform, Linking } from "react-native";
// import { removeItemValue, setData, getData } from "../redux/apis/keyChain";
// import { VoipCallAccept, VoipCallData } from "../redux/apis/commonValue";
// import {
//   socketConnectionCheck,
//   socketEmit,
//   socketEvent,
//   socketInit,
//   socketIsConnected,
//   socketReconnect,
//   ensureSocketConnected,
//   socketEmitAsync,
//   waitForSocketConnection,
// } from "../utils/socket";
// import { socketInstance } from "../utils/helper";
// import { setVoipCallAccepted } from "../utils/voipState";

// let currentVoipData: any = null;
// let isCallKeepAccept = false;
// let isEndCallHandled = false;
// let lastAnswerTime = 0;
// let isCallActive = false;
// let answeredCallUUID: string | null = null;
// let isRejectInProgress = false;
// let userClickedAnswer = false; // 🔹 NEW: Track if user clicked answer (not reject)
// let callStartTime = 0;

// const callKeepOptions: CallKeepOptions = {
//   ios: {
//     appName: "MediDoctor",
//   },
// };

// export const setupCallKeep = async (): Promise<void> => {
//   await RNCallKeep.setup(callKeepOptions);
//   RNCallKeep.setAvailable(true);
// };

// export const methodCallDisconnect = async () => {
//   if (!currentVoipData) {
//     console.log("⚠️ No call data to disconnect");
//     return;
//   }

//   if (isRejectInProgress) {
//     console.log("⚠️ Reject already in progress, skipping...");
//     return;
//   }

//   isRejectInProgress = true;

//   RNCallKeep.endAllCalls();

//   console.log("currentVoipData>>>>>>>", currentVoipData);

//   const callData = currentVoipData?.data || currentVoipData;
//   console.log("callData", callData);

//   const data: any = {
//     group_id: callData?.group,
//     user_id: global.userData?.id,
//     call_type: callData?.call_type || "video",
//     call_token: callData?.call_token,
//     other_user_id: callData?.sender,
//   };

//   if (callData?.group) {
//     data.group_id = callData?.group;
//   }

//   console.log("data>>>>>> IOS", data);

//   try {
//     console.log("🔄 Ensuring socket is connected before reject...");

//     if (!socketInstance.socket) {
//       await socketInit();
//     } else if (!socketIsConnected()) {
//       socketReconnect();
//       await socketInit();
//     }

//     const isConnected = await waitForSocketConnection(5000);

//     if (!isConnected) {
//       console.log("❌ Socket failed to connect, queuing reject...");
//     }

//     console.log("📤 Sending reject_call event...");

//     socketEmit(socketEvent.reject_call, data, (res) => {
//       console.log("res>>>>>> IOS>>>> after socket hit", res);
//       DeviceEventEmitter.emit("voip_call_cut");
//       cleanupCallState();
//       isRejectInProgress = false;
//     });

//     setTimeout(() => {
//       if (isRejectInProgress) {
//         console.log("⚠️ Reject timeout, cleaning up anyway");
//         DeviceEventEmitter.emit("voip_call_cut");
//         cleanupCallState();
//         isRejectInProgress = false;
//       }
//     }, 3000);
//   } catch (error) {
//     console.log("❌ Error during reject:", error);
//     cleanupCallState();
//     isRejectInProgress = false;
//   }
// };

// const cleanupCallState = () => {
//   currentVoipData = null;
//   isCallKeepAccept = false;
//   isEndCallHandled = false;
//   isCallActive = false;
//   lastAnswerTime = 0;
//   answeredCallUUID = null;
//   userClickedAnswer = false;
//   callStartTime = 0;

//   removeItemValue(VoipCallData);
//   removeItemValue(VoipCallAccept);
// };

// const saveVoipData = async (data: any) => {
//   currentVoipData = data;
//   await setData(VoipCallData, data);
// };

// VoipPushNotification.addEventListener(
//   "notification",
//   async (notification: VoipNotification) => {
//     setupCallKeep();
//     console.log("notification>>>>>>>>> IOS ", notification);

//     if (!socketInstance.socket) {
//       console.log("🔄 VoIP push received, initializing socket...");
//       socketInit();
//     } else if (!socketIsConnected()) {
//       console.log("🔄 VoIP push received, reconnecting socket...");
//       socketReconnect();
//       await socketInit();
//     }

//     const voipData =
//       notification?.data?.data || notification?.data || notification;
//     await saveVoipData(voipData);

//     isEndCallHandled = false;
//     isCallActive = false;
//     lastAnswerTime = 0;
//     answeredCallUUID = null;
//     isRejectInProgress = false;
//     userClickedAnswer = false;
//     callStartTime = Date.now();

//     if (voipData?.notification_type === "AGORA_VIDEO_CALL_DISCONNECT") {
//       RNCallKeep.endAllCalls();
//       cleanupCallState();
//       return;
//     }
//   },
// );

// VoipPushNotification.addEventListener(
//   "didLoadWithEvents",
//   async (events: VoipPushEvent[]) => {
//     setupCallKeep();
//     console.log("📱 didLoadWithEvents - App launched from VoIP");

//     await socketInit();

//     if (!Array.isArray(events)) return;

//     for (const event of events) {
//       const { name, data } = event;
//       console.log("Load event Data", data);

//       if (
//         name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
//       ) {
//         const voipData = data?.data?.data || data?.data || data;
//         await saveVoipData(voipData);

//         isEndCallHandled = false;
//         isCallActive = false;
//         lastAnswerTime = 0;
//         answeredCallUUID = null;
//         isRejectInProgress = false;
//         userClickedAnswer = false;
//         callStartTime = Date.now();

//         if (voipData?.notification_type === "AGORA_VIDEO_CALL_DISCONNECT") {
//           RNCallKeep.endAllCalls();
//           cleanupCallState();
//           continue;
//         }
//       }
//     }
//   },
// );

// RNCallKeep.addEventListener("answerCall", async ({ callUUID }) => {
//   if (Platform.OS === "android") return;
//   await socketInit();
//   const deepLink = `medidoctor://Home`;
//   console.log("🔗 Opening deep link:", deepLink);

//   Linking.openURL(deepLink);
//   RNCallKeep.backToForeground();

//   console.log(
//     "************************************** IOS ANSWER******************",
//     currentVoipData,
//   );

//   // 🔹 Mark that user clicked ANSWER
//   userClickedAnswer = true;

//   if (!socketInstance.socket) {
//     await socketInit();
//   } else if (!socketIsConnected()) {
//     socketReconnect();
//   }

//   if (!currentVoipData) {
//     const stored = await getData(VoipCallData);
//     console.log("stored>>>>>> IOS", stored);
//     if (stored) currentVoipData = stored;
//   }

//   if (!currentVoipData?.data && !currentVoipData?.group) return;

//   isCallKeepAccept = true;
//   isEndCallHandled = false;
//   isCallActive = true;
//   lastAnswerTime = Date.now();
//   answeredCallUUID = callUUID;

//   RNCallKeep.setCurrentCallActive(callUUID);
//   setVoipCallAccepted(true);
//   await setData(VoipCallAccept, "true");

//   console.log(
//     "**************************************currentVoipData",
//     currentVoipData,
//   );

//   DeviceEventEmitter.emit("receiver_call_connect_voip", currentVoipData);
// });

// RNCallKeep.addEventListener("endCall", async ({ callUUID }) => {
//   console.log("🔴 endCall triggered, callUUID:", callUUID);

//   RNCallKeep.backToForeground();

//   if (Platform.OS === "android") return;

//   // 🔹 CHECK 1: Already handled
//   if (isEndCallHandled) {
//     console.log("⚠️ endCall already handled, skipping...");
//     return;
//   }

//   // 🔹 CHECK 2: Just answered (prevent accidental immediate hang up)
//   const timeSinceAnswer = Date.now() - lastAnswerTime;
//   if (isCallActive && timeSinceAnswer < 3000) {
//     console.log("⚠️ Call just answered, ignoring premature endCall");
//     return;
//   }

//   // 🔹 CHECK 3: Different UUID
//   console.log("answeredCallUUID>>>>>> IOS", answeredCallUUID);
//   if (answeredCallUUID && callUUID !== answeredCallUUID) {
//     console.log("⚠️ endCall for different UUID, skipping...");
//     return;
//   }

//   console.log("currentVoipData>>>>>> IOS", currentVoipData);

//   if (!currentVoipData) {
//     const stored = await getData(VoipCallData);
//     if (stored) currentVoipData = stored;
//   }

//   console.log("isCallActive>>>>>> IOS", isCallActive);
//   console.log("userClickedAnswer>>>>>> IOS", userClickedAnswer);

//   if (!currentVoipData && !isCallActive) {
//     console.log("⚠️ No call data and not active, skipping reject");
//     return;
//   }

//   // 🔹 IMPORTANT: Always send reject for any endCall, UNLESS it's system auto-dismiss
//   // System auto-dismiss happens after ~30 seconds, but we should reject before that
//   const timeSinceCallStart = Date.now() - callStartTime;

//   // If more than 30 seconds and user never clicked answer, it's auto-dismiss
//   if (timeSinceCallStart > 30000 && !userClickedAnswer) {
//     console.log("⚠️ Call auto-dismissed by iOS after 30s");
//     RNCallKeep.endAllCalls();
//     cleanupCallState();
//     return;
//   }

//   isEndCallHandled = true;
//   isCallActive = false;

//   console.log("📤 User rejected call or hung up, sending reject_call...");

//   await methodCallDisconnect();
// });

// let previousAppState = AppState.currentState;

// AppState.addEventListener("change", (nextAppState) => {
//   console.log(`App state changed: ${previousAppState} -> ${nextAppState}`);

//   if (
//     previousAppState.match(/inactive|background/) &&
//     nextAppState === "active"
//   ) {
//     if (!socketIsConnected() && socketInstance.socket) {
//       console.log("🔄 App became active, reconnecting socket...");
//       socketReconnect();
//     }

//     // 🔹 If user answered call but then app became inactive (call ended)
//     if (isCallKeepAccept && !isCallActive) {
//       setTimeout(() => {
//         RNCallKeep.endAllCalls();
//         cleanupCallState();
//       }, 300);
//     }
//   }

//   // 🔹 If app goes to background and call is NOT answered, reject it
//   if (
//     nextAppState.match(/inactive|background/) &&
//     previousAppState === "active" &&
//     !userClickedAnswer &&
//     currentVoipData
//   ) {
//     console.log(
//       "⚠️ App went to background without answering call, rejecting...",
//     );
//     setTimeout(async () => {
//       if (!userClickedAnswer && currentVoipData) {
//         await methodCallDisconnect();
//       }
//     }, 500);
//   }

//   previousAppState = nextAppState;
// });

// export const forceCleanupCall = () => {
//   RNCallKeep.endAllCalls();
//   cleanupCallState();
//   isRejectInProgress = false;
// };

import VoipPushNotification, {
  VoipNotification,
  VoipPushEvent,
} from "react-native-voip-push-notification";
import RNCallKeep, { CallKeepOptions } from "react-native-callkeep";
import { DeviceEventEmitter, AppState, Platform, Linking } from "react-native";
import { removeItemValue, setData, getData } from "../redux/apis/keyChain";
import { VoipCallAccept, VoipCallData } from "../redux/apis/commonValue";
import {
  socketConnectionCheck,
  socketEmit,
  socketEvent,
  socketInit,
  socketIsConnected,
  socketReconnect,
  ensureSocketConnected,
  socketEmitAsync,
  waitForSocketConnection,
} from "../utils/socket";
import { socketInstance } from "../utils/helper";
import { setVoipCallAccepted } from "../utils/voipState";

let currentVoipData: any = null;
let isCallKeepAccept = false;
let isEndCallHandled = false;
let lastAnswerTime = 0;
let isCallActive = false;
let answeredCallUUID: string | null = null;
let isRejectInProgress = false;
let userClickedAnswer = false;
let callStartTime = 0;
let hasOpenedApp = false; // 🔹 NEW: Track if app was opened

const callKeepOptions: CallKeepOptions = {
  ios: {
    appName: "MediDoctor",
  },
};

export const setupCallKeep = async (): Promise<void> => {
  await RNCallKeep.setup(callKeepOptions);
  RNCallKeep.setAvailable(true);
};

export const methodCallDisconnect = async () => {
  if (!currentVoipData) {
    console.log("⚠️ No call data to disconnect");
    return;
  }

  if (isRejectInProgress) {
    console.log("⚠️ Reject already in progress, skipping...");
    return;
  }

  isRejectInProgress = true;

  RNCallKeep.endAllCalls();

  console.log("currentVoipData>>>>>>>", currentVoipData);

  const callData = currentVoipData?.data || currentVoipData;
  console.log("callData", callData);

  const data: any = {
    group_id: callData?.group,
    user_id: global.userData?.id,
    call_type: callData?.call_type || "video",
    call_token: callData?.call_token,
    other_user_id: callData?.sender,
  };

  if (callData?.group) {
    data.group_id = callData?.group;
  }

  console.log("data>>>>>> IOS", data);

  try {
    console.log("🔄 Ensuring socket is connected before reject...");

    if (!socketInstance.socket) {
      await socketInit();
    } else if (!socketIsConnected()) {
      socketReconnect();
      await socketInit();
    }

    const isConnected = await waitForSocketConnection(5000);

    if (!isConnected) {
      console.log("❌ Socket failed to connect, queuing reject...");
    }

    console.log("📤 Sending reject_call event...");

    socketEmit(socketEvent.reject_call, data, (res) => {
      console.log("res>>>>>> IOS>>>> after socket hit", res);
      DeviceEventEmitter.emit("voip_call_cut");
      cleanupCallState();
      isRejectInProgress = false;
    });

    setTimeout(() => {
      if (isRejectInProgress) {
        console.log("⚠️ Reject timeout, cleaning up anyway");
        DeviceEventEmitter.emit("voip_call_cut");
        cleanupCallState();
        isRejectInProgress = false;
      }
    }, 3000);
  } catch (error) {
    console.log("❌ Error during reject:", error);
    cleanupCallState();
    isRejectInProgress = false;
  }
};

const cleanupCallState = () => {
  currentVoipData = null;
  isCallKeepAccept = false;
  isEndCallHandled = false;
  isCallActive = false;
  lastAnswerTime = 0;
  answeredCallUUID = null;
  userClickedAnswer = false;
  callStartTime = 0;
  hasOpenedApp = false; // 🔹 Reset app open flag

  removeItemValue(VoipCallData);
  removeItemValue(VoipCallAccept);
};

const saveVoipData = async (data: any) => {
  currentVoipData = data;
  await setData(VoipCallData, data);
};

VoipPushNotification.addEventListener(
  "notification",
  async (notification: VoipNotification) => {
    setupCallKeep();
    console.log("📞 VoIP notification received (background processing only)");

    // 🔹 Initialize socket for background processing
    if (!socketInstance.socket) {
      console.log("🔄 VoIP push received, initializing socket...");
      socketInit();
    } else if (!socketIsConnected()) {
      console.log("🔄 VoIP push received, reconnecting socket...");
      socketReconnect();
      await socketInit();
    }

    const voipData =
      notification?.data?.data || notification?.data || notification;
    await saveVoipData(voipData);

    isEndCallHandled = false;
    isCallActive = false;
    lastAnswerTime = 0;
    answeredCallUUID = null;
    isRejectInProgress = false;
    userClickedAnswer = false;
    callStartTime = Date.now();
    hasOpenedApp = false; // 🔹 Reset

    if (voipData?.notification_type === "AGORA_VIDEO_CALL_DISCONNECT") {
      RNCallKeep.endAllCalls();
      cleanupCallState();
      return;
    }

    // 🔹 DO NOT open app here - just store data
    console.log("✅ VoIP data stored, waiting for user action...");
  },
);

VoipPushNotification.addEventListener(
  "didLoadWithEvents",
  async (events: VoipPushEvent[]) => {
    setupCallKeep();
    console.log("📱 didLoadWithEvents - App launched from VoIP");

    await socketInit();

    if (!Array.isArray(events)) return;

    for (const event of events) {
      const { name, data } = event;
      console.log("Load event Data", data);

      if (
        name === VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
      ) {
        const voipData = data?.data?.data || data?.data || data;
        await saveVoipData(voipData);

        isEndCallHandled = false;
        isCallActive = false;
        lastAnswerTime = 0;
        answeredCallUUID = null;
        isRejectInProgress = false;
        userClickedAnswer = false;
        callStartTime = Date.now();
        hasOpenedApp = false;

        if (voipData?.notification_type === "AGORA_VIDEO_CALL_DISCONNECT") {
          RNCallKeep.endAllCalls();
          cleanupCallState();
          continue;
        }
      }
    }
  },
);

// 🔹 ANSWER CALL - Open app ONLY here
RNCallKeep.addEventListener("answerCall", async ({ callUUID }) => {
  if (Platform.OS === "android") return;

  console.log("✅ User clicked ANSWER - Opening app now...");

  // 🔹 Mark that user physically clicked answer
  userClickedAnswer = true;
  hasOpenedApp = true;

  // 🔹 Initialize socket
  await socketInit();

  // 🔹 Open app via deep link
  const deepLink = `medidoctor://Home`;
  console.log("🔗 Opening deep link:", deepLink);

  try {
    await Linking.openURL(deepLink);
    RNCallKeep.backToForeground();
  } catch (error) {
    console.log("⚠️ Deep link failed, using backToForeground:", error);
    RNCallKeep.backToForeground();
  }

  if (!socketInstance.socket) {
    await socketInit();
  } else if (!socketIsConnected()) {
    socketReconnect();
  }

  if (!currentVoipData) {
    const stored = await getData(VoipCallData);
    console.log("stored>>>>>> IOS", stored);
    if (stored) currentVoipData = stored;
  }

  if (!currentVoipData?.data && !currentVoipData?.group) return;

  isCallKeepAccept = true;
  isEndCallHandled = false;
  isCallActive = true;
  lastAnswerTime = Date.now();
  answeredCallUUID = callUUID;

  RNCallKeep.setCurrentCallActive(callUUID);
  setVoipCallAccepted(true);
  await setData(VoipCallAccept, "true");

  console.log("✅ Call accepted, notifying React Native...");

  // 🔹 Short delay to ensure app is open before navigating
  setTimeout(() => {
    DeviceEventEmitter.emit("receiver_call_connect_voip", currentVoipData);
  }, 500);
});

// 🔹 END CALL - Open app if rejecting
RNCallKeep.addEventListener("endCall", async ({ callUUID }) => {
  console.log("🔴 User clicked END/REJECT");

  if (Platform.OS === "android") return;

  // 🔹 If user rejected call (never clicked answer), open app to show rejection
  if (!userClickedAnswer && !hasOpenedApp) {
    console.log("📱 Opening app to show call rejection...");
    try {
      const deepLink = `medidoctor://Home`;
      await Linking.openURL(deepLink);
      RNCallKeep.backToForeground();
      hasOpenedApp = true;
    } catch (error) {
      console.log("⚠️ Could not open app on reject:", error);
    }
  }

  // 🔹 CHECK 1: Already handled
  if (isEndCallHandled) {
    console.log("⚠️ endCall already handled, skipping...");
    return;
  }

  // 🔹 CHECK 2: Just answered (prevent accidental immediate hang up)
  const timeSinceAnswer = Date.now() - lastAnswerTime;
  if (isCallActive && timeSinceAnswer < 3000) {
    console.log("⚠️ Call just answered, ignoring premature endCall");
    return;
  }

  // 🔹 CHECK 3: Different UUID
  if (answeredCallUUID && callUUID !== answeredCallUUID) {
    console.log("⚠️ endCall for different UUID, skipping...");
    return;
  }

  if (!currentVoipData) {
    const stored = await getData(VoipCallData);
    if (stored) currentVoipData = stored;
  }

  if (!currentVoipData && !isCallActive) {
    console.log("⚠️ No call data and not active, skipping reject");
    return;
  }

  // 🔹 Check for iOS auto-dismiss (30 seconds)
  const timeSinceCallStart = Date.now() - callStartTime;
  if (timeSinceCallStart > 30000 && !userClickedAnswer) {
    console.log("⚠️ Call auto-dismissed by iOS after 30s");
    RNCallKeep.endAllCalls();
    cleanupCallState();
    return;
  }

  isEndCallHandled = true;
  isCallActive = false;

  console.log("📤 Sending reject_call...");
  await methodCallDisconnect();
});

let previousAppState = AppState.currentState;

AppState.addEventListener("change", (nextAppState) => {
  console.log(`App state changed: ${previousAppState} -> ${nextAppState}`);

  if (
    previousAppState.match(/inactive|background/) &&
    nextAppState === "active"
  ) {
    if (!socketIsConnected() && socketInstance.socket) {
      console.log("🔄 App became active, reconnecting socket...");
      socketReconnect();
    }

    if (isCallKeepAccept && !isCallActive) {
      // setTimeout(() => {
      //   RNCallKeep.endAllCalls();
      //   cleanupCallState();
      // }, 300);
    }
  }

  // 🔹 If app goes to background without answering
  if (
    nextAppState.match(/inactive|background/) &&
    previousAppState === "active" &&
    !userClickedAnswer &&
    currentVoipData
  ) {
    console.log("⚠️ App went to background without answering, rejecting...");
    // setTimeout(async () => {
    //   if (!userClickedAnswer && currentVoipData) {
    //     await methodCallDisconnect();
    //   }
    // }, 500);
  }

  previousAppState = nextAppState;
});

export const forceCleanupCall = () => {
  RNCallKeep.endAllCalls();
  cleanupCallState();
  isRejectInProgress = false;
};
