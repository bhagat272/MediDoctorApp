import React from "react";
import { Alert, Platform } from "react-native";
import {
  check,
  request,
  PERMISSIONS,
  openSettings,
} from "react-native-permissions";
import { AppConstant } from "../constants/appconstant";
import { messages } from "./permissionMessage";

export const settingAlert = (msg) => {
  setTimeout(() => {
    Alert.alert(
      AppConstant.appName,
      msg,
      Platform.OS == "ios"
        ? [
            {
              text: "CONTINUE",
              onPress: () => {},
              style: "cancel",
            },
          ]
        : [
            {
              text: "CONTINUE",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "SETTINGS",
              onPress: () => {
                openSettings().catch(() => {
                  console.warn("cannot open settings");
                });
              },
            },
          ],
      { cancelable: false },
    );
  }, 700);
};

export const cameraPermissions = async (cb) => {
  await check(
    Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    }),
  ).then((result) => {
    console.log("result", result);
    if (result == "granted" || result == "limited") {
      return cb(true);
    } else if (result == "blocked" || result == "unavailable") {
      settingAlert(messages.CAMERA_PERMISSION_SETTING);
      return cb(false);
    }
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
        ios: PERMISSIONS.IOS.CAMERA,
      }),
    ).then((status) => {
      console.log("result status", status);
      if (status == "granted") {
        return cb(true);
      } else if (status == "blocked") {
        settingAlert(messages.CAMERA_PERMISSION_SETTING);
        cb(false);
      }
    });
  });
};

export const cameraPermissionsForCall = async () => {
  try {
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    });

    const result = await check(permission);
    console.log("Camera permission result:", result);

    // If already granted or limited
    if (result === "granted" || result === "limited") {
      return true;
    }

    // If blocked or unavailable, show settings alert
    if (result === "blocked" || result === "unavailable") {
      settingAlert(messages.CAMERA_PERMISSION_SETTING);
      return false;
    }

    // Request permission if not yet determined
    const status = await request(permission);
    console.log("Camera permission status after request:", status);

    if (status === "granted" || status === "limited") {
      return true;
    }

    // If blocked after request, show settings alert
    if (status === "blocked") {
      settingAlert(messages.CAMERA_PERMISSION_SETTING);
      return false;
    }

    return false;
  } catch (error) {
    console.error("Camera permission error:", error);
    return false;
  }
};

export const galleryPermissions = async (cb) => {
  await check(
    Platform.select({
      android:
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    }),
  ).then((result) => {
    console.log("result----------", result);
    if (Platform.OS === "android") {
      return cb(true);
    }
    if (result == "granted" || result == "limited") {
      return cb(true);
    } else if (result == "blocked" || result == "unavailable") {
      settingAlert(messages.GALLERY_PERMISSION_SETTING);
      return cb(false);
    }
    request(
      Platform.select({
        android:
          Platform.Version >= 33
            ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      }),
    ).then((status) => {
      console.log("status----------", status);

      if (status == "granted") {
        cb(true);
      } else if (status == "blocked") {
        if (Platform.OS === "ios") {
          settingAlert(messages.GALLERY_PERMISSION_SETTING);
        }
        cb(false);
      }
    });
  });
};

export const checkMicroPhonePermission = async () => {
  return new Promise(async (resolve, reject) => {
    await check(
      Platform.select({
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
        ios: PERMISSIONS.IOS.MICROPHONE,
      }),
    ).then((result) => {
      if (result == "granted" || result == "limited") {
        resolve(true);
      } else if (result == "blocked" || result == "unavailable") {
        settingAlert(messages.MICROPHONE_PERMISSION_SETTING);
        resolve(false);
        return;
      }
      request(
        Platform.select({
          android: PERMISSIONS.ANDROID.RECORD_AUDIO,
          ios: PERMISSIONS.IOS.MICROPHONE,
        }),
      ).then((status) => {
        if (status == "granted" || status == "limited") {
          resolve(true);
        } else {
          settingAlert(messages.MICROPHONE_PERMISSION_SETTING);
          resolve(false);
          return;
        }
      });
    });
  });
};
