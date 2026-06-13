import React, { useEffect, useMemo, useRef } from "react";
import { AppState, Platform, StatusBar, Text, TextInput } from "react-native";
import DeviceInfo from "react-native-device-info";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";
import { LoaderView } from "./src/components";
import Routes from "./src/navigation/navigationStack";
import store from "./src/redux/store";

import messaging from "@react-native-firebase/messaging";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import VoipPushNotification from "react-native-voip-push-notification";
import { initializeDeepLinking } from "./src/utils/deepLinkHandler";
import { DEVICE_INFO, socketInstance } from "./src/utils/helper";
import {
  registerNotificationListeners,
  setupNotificationService,
} from "./src/utils/navigationService";
import {
  getFCMToken,
  requestAndroidNotificationPermission,
} from "./src/utils/notificationPermissions";
import { socketIsConnected, socketReconnect } from "./src/utils/socket";

function App() {
  const appState = useRef(AppState.currentState);
  const callUUID = uuid.v4().toString();
  useEffect(() => {
    if (Platform.OS === "ios") {
      VoipPushNotification.registerVoipToken();
      permission();
    }
  }, []);

  // useEffect(() => {
  //   checkCallPermission();

  //   // requestCallPermissions();
  // }, []);

  const permission = async () => {
    await initializeDeepLinking();
  };

  useEffect(() => {
    // Disable font scaling for Text components
    if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
    (Text as any).defaultProps.allowFontScaling = false;

    // Disable font scaling for TextInput components
    if ((TextInput as any).defaultProps == null)
      (TextInput as any).defaultProps = {};
    (TextInput as any).defaultProps.allowFontScaling = false;
  }, []);

  useEffect(() => {
    let unsubscribeTokenRefresh: any;

    (async () => {
      if (Platform.OS === "android") {
        await requestAndroidNotificationPermission();
      }

      const uniqueId = await DeviceInfo.getUniqueId();
      DEVICE_INFO.device_unique_id = uniqueId;

      //  Try initial token
      let token = await getFCMToken();

      if (token) {
        DEVICE_INFO.device_token = token;
        console.log("FCM TOKEN (initial):", token);
      } else {
        console.log("FCM token not ready yet, waiting...");
      }

      //  Listen for delayed token (IMPORTANT)
      unsubscribeTokenRefresh = messaging().onTokenRefresh((newToken) => {
        DEVICE_INFO.device_token = newToken;
        console.log("FCM TOKEN (refresh):", newToken);
      });
    })();

    return () => {
      if (unsubscribeTokenRefresh) unsubscribeTokenRefresh();
    };
  }, []);

  useEffect(() => {
    setupNotificationService();
    const unsubscribe = registerNotificationListeners();
    return unsubscribe;
  }, []);

  const usePlatformEdges = (): Edge[] => {
    return useMemo(
      () =>
        Platform.OS === "android"
          ? ["left", "right", "bottom"]
          : ["left", "right"],
      [],
    );
  };
  const edges = usePlatformEdges();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        global?.userData
      ) {
        setTimeout(() => {
          if (!socketIsConnected() && socketInstance.socket) {
            socketReconnect();
          }
        }, 5000);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [global?.userData]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={edges}
    >
      <Provider store={store}>
        <StatusBar
          translucent
          backgroundColor={"transparent"}
          barStyle={"dark-content"}
        />

        <Routes />
        <FlashMessage
          duration={3000}
          position="top"
          icon={"auto"}
          floating={true}
          animated={true}
          style={{
            marginTop:
              Platform.OS === "android" && StatusBar.currentHeight
                ? StatusBar.currentHeight + 10
                : 0,
          }}
        />
        <LoaderView />
      </Provider>
    </SafeAreaView>
  );
}

export default App;
