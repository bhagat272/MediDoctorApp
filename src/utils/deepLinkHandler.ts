import { Linking, AppState } from "react-native";
import { navigationRef } from "./navigationRef";

let deepLinkUrl: string | null = null;

export const initializeDeepLinking = () => {
  // Handle deep link when app is already open
  Linking.addEventListener("url", ({ url }) => {
    console.log("🔗 Deep link received (app open):", url);
    handleDeepLink(url);
  });

  // Handle deep link when app is opened from closed state
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log("🔗 Deep link received (app closed):", url);
      handleDeepLink(url);
    }
  });
};

const handleDeepLink = (url: string) => {
  console.log("🔗 Processing deep link:", url);

  try {
    const route = url.replace(/.*?:\/\//g, ""); // Remove scheme
    const routeName = route.split("?")[0]; // Get route name
    const params = getQueryParams(url); // Get parameters

    console.log("Route:", routeName);
    console.log("Params:", params);

    // Navigate based on deep link
    switch (routeName) {
      case "incoming-call":
        navigateToIncomingCall(params);
        break;
      case "home":
        navigateToHome();
        break;
      case "call-screen":
        navigateToCallScreen(params);
        break;
      default:
        console.log("Unknown deep link route:", routeName);
    }
  } catch (error) {
    console.error("Error handling deep link:", error);
  }
};

const getQueryParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const queryString = url.split("?")[1];

  if (queryString) {
    queryString.split("&").forEach((param) => {
      const [key, value] = param.split("=");
      params[key] = decodeURIComponent(value);
    });
  }

  return params;
};

const navigateToHome = () => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: "Home" as never }],
    });
  }
};

const navigateToIncomingCall = (params: Record<string, string>) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate("IncomingCallScreen" as never, params as never);
  }
};

const navigateToCallScreen = (params: Record<string, string>) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate("CallScreen" as never, params as never);
  }
};

// Trigger deep link programmatically
export const openDeepLink = (url: string) => {
  Linking.openURL(url);
};
