import React, { ReactNode, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus, View, Text, StyleSheet } from "react-native";
import ReactNativeBiometrics, {
  FaceID,
  TouchID,
  Biometrics,
  BiometryType,
} from "react-native-biometrics";
import { socketConnectionCheck } from "../utils/socket";

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

type BiometricState =
  | "idle"
  | "available"
  | "authenticated"
  | "failed"
  | "locked"
  | "not-supported";

type BiometricGuardProps = {
  children: ReactNode;
  allow?: boolean;
  onAutenticated?: () => void;
};

export const BiometricGuard: React.FC<BiometricGuardProps> = ({
  children,
  allow = true,
  onAutenticated = () => {},
}) => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const isAuthenticating = useRef(false);

  const [biometricState, setBiometricState] = useState<BiometricState>("idle");
  const [biometryType, setBiometryType] = useState<BiometryType | null>(null);

  const authenticate = async () => {
    if (isAuthenticating.current) return;
    isAuthenticating.current = true;

    try {
      const result = await rnBiometrics.simplePrompt({
        promptMessage:
          biometryType === FaceID
            ? "Authenticate with Face ID"
            : biometryType === TouchID
              ? "Authenticate with Touch ID"
              : "Authenticate with Biometrics",
      });
      console.log("result====>", { result });
      if (!result.success) {
        init();
        socketConnectionCheck();
      } else {
        onAutenticated();
      }
      setBiometricState(result.success ? "authenticated" : "failed");
      socketConnectionCheck();
    } catch (e: any) {
      if (e?.error?.toLowerCase()?.includes("lockout")) {
        setBiometricState("locked");
        socketConnectionCheck();
      } else {
        setBiometricState("failed");
        socketConnectionCheck();
      }
    } finally {
      isAuthenticating.current = false;
      socketConnectionCheck();
    }
  };

  /**
   * Detect biometric availability
   */
  const init = async () => {
    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();

      if (!available || !biometryType) {
        setBiometricState("not-supported");
        onAutenticated();
        return;
      }

      setBiometryType(biometryType);
      setBiometricState("available");
      // authenticate();
    } catch {
      setBiometricState("not-supported");
    }
  };

  /**
   * AppState handler
   */
  const handleAppStateChange = (nextState: AppStateStatus) => {
    if (!allow) return;

    const wasInBackground =
      appState.current === "background" || appState.current === "inactive";

    if (
      wasInBackground &&
      nextState === "active" &&
      biometricState !== "authenticated"
    ) {
      authenticate();
    }

    appState.current = nextState;
  };

  useEffect(() => {
    if (biometricState === "available") {
      authenticate();
    }
  }, [biometricState]);

  useEffect(() => {
    if (allow && biometricState === "idle") {
      init();
    }

    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, [allow, biometricState]);

  /**
   * Lock UI
   */
  if (biometricState !== "authenticated") {
    return (
      <View style={styles.lockedContainer}>
        <Text style={styles.lockedText}>
          🔒{" "}
          {biometryType === FaceID
            ? "Face ID"
            : biometryType === TouchID
              ? "Touch ID"
              : "Biometric"}{" "}
          Required
        </Text>
      </View>
    );
  }
  if (!allow) {
    return <>{children}</>;
  }

  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  lockedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
