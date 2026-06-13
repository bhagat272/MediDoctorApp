// /**
//  * @format
//  */
// import "./src/utils/VoipBackgroundHandler";
// import "./src/utils/VoIPPushHandler";
// import { AppRegistry, DeviceEventEmitter, Platform } from "react-native";
// import App from "./App";
// import { name as appName } from "./app.json";
// import { useEffect } from "react";
// import { socketConnectionCheck } from "./src/utils/socket";
// import { handleNotificationNavigationFromPayload } from "./src/utils/notificationNavigationHandler";
// import notifee, { EventType } from "@notifee/react-native";

// function Root() {
//   globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

//   useEffect(() => {
//     async function checkInitialNotification() {
//       const initialNotification = await notifee.getInitialNotification();

//       console.log("Initial notification:", initialNotification);

//       if (initialNotification?.notification?.data) {
//         handleNotificationNavigationFromPayload(
//           initialNotification.notification.data,
//         );
//       }
//     }

//     checkInitialNotification();
//   }, []);

//   useEffect(() => {
//     socketConnectionCheck();

//     // Initialize CallKeep on app start
//     // initializeCallKeep();

//     let callDisconnected = DeviceEventEmitter.addListener(
//       "call_disconnected",
//       async (response) => {
//         console.log("call_disconnected index----------");
//         RNCallKeep.endAllCalls();
//         // activeCalls.clear();
//       },
//     );

//     return () => {
//       // callDisconnected.remove();
//     };
//   }, []);

//   return <App />;
// }

// AppRegistry.registerComponent(appName, () => Root);

/**
 * @format
 */
import "./src/utils/VoipBackgroundHandler";
import "./src/utils/VoIPPushHandler";
import { AppRegistry, DeviceEventEmitter, Platform } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { useEffect } from "react";
import { socketConnectionCheck, socketInit } from "./src/utils/socket";
import { handleNotificationNavigationFromPayload } from "./src/utils/notificationNavigationHandler";
import notifee, { EventType } from "@notifee/react-native";
import RNCallKeep from "react-native-callkeep";

function Root() {
  globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

  useEffect(() => {
    async function checkInitialNotification() {
      const initialNotification = await notifee.getInitialNotification();

      console.log("Initial notification:", initialNotification);

      if (initialNotification?.notification) {
        // Add a delay to ensure navigation is ready
        setTimeout(() => {
          handleNotificationNavigationFromPayload(
            initialNotification.notification,
          );
        }, 2500);
      }
    }

    checkInitialNotification();
  }, []);

  useEffect(() => {
    socketConnectionCheck()

    // Initialize CallKeep on app start
    // initializeCallKeep();

    let callDisconnected = DeviceEventEmitter.addListener(
      "call_disconnected",
      async (response) => {
        console.log("call_disconnected index----------");
        RNCallKeep.endAllCalls();
        // activeCalls.clear();
      },
    );

    return () => {
      // callDisconnected.remove();
    };
  }, []);

  return <App />;
}

AppRegistry.registerComponent(appName, () => Root);
