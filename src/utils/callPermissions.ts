import { PermissionsAndroid, Platform } from "react-native";

export async function requestCallPermissions() {
  if (Platform.OS !== "android") return true;

  const permissions = [
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
  ];

  const granted = await PermissionsAndroid.requestMultiple(permissions);

  return Object.values(granted).every(
    (status) => status === PermissionsAndroid.RESULTS.GRANTED,
  );
}
