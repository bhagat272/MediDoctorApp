import DeviceInfo from "react-native-device-info";
import { showToastMessage } from "./toast";
import {
  KAUthToken,
  kSorryError,
  kUserData,
  kUserToken,
} from "../redux/apis/commonValue";
import { getData, removeItemValue, setData } from "../redux/apis/keyChain";
import { handleSetRoot } from "../navigation/navigationService";
import { PermissionsAndroid, Platform } from "react-native";
import {
  socketConnectionCheck,
  socketCustomLogoutDisconnect,
  socketEmit,
  socketEvent,
  socketIsConnected,
} from "./socket";
import { userPayload } from "../redux/reducer/userSessionReducer";
import base64 from "react-native-base64";
import { keys } from "./firebaseRemoteConfig";
import { isNetworkAvailable } from "../redux/apis/network";
import Sound from "react-native-sound";
import imagePath from "../theme/imagePath";
import RNCallKeep from "react-native-callkeep";

export const socketInstance: any = {
  socket: null,
  isCustomDisconnect: false,
  isDuringConnection: false,
  launchApp: true,
  last_api_call_time: "",
};

export const setDefaultValues = (navigation: any) => {
  global.navRef = navigation;
};

export const setGlobalUserToken = (token: string | any) => {
  global.userToken = token;
};
export const setUserData = (data: object | any) => {
  global.userData = data;
};

export const showErrorMessage = () => {
  showToastMessage(kSorryError);
};

export const logout = async (isLogin = true) => {
  setGlobalUserToken("");
  setUserData("");
  await removeItemValue(kUserData);
  await removeItemValue(kUserToken);
  await removeItemValue(KAUthToken);
  if (socketIsConnected()) {
    socketCustomLogoutDisconnect();
  }
  if (isLogin) {
    handleSetRoot({ name: "Login" });
  }
};

export const getDeviceUniqueId = async () => {
  let device = await DeviceInfo.getUniqueId();
  DEVICE_INFO.device_unique_id = device;
  return device;
};

export const DEVICE_INFO = {
  device_type: Platform.OS.toLocaleUpperCase(),
  device_id: DeviceInfo.getDeviceId(),
  device_unique_id: "",
  device_token: "",
  voip_token: "",
};

export const saveAuthToken = (authToken: string) => {
  global.authToken = authToken;
};

export interface ValidateFormType {
  value: object;
  status?: boolean;
}

export const updateUserData = (userDetail: any, dispatch: any) => {
  setData(kUserData, userDetail);
  setUserData(userDetail);
  dispatch(userPayload(userDetail));
};

export const methodSecurityEncoded = (data: any) => {
  let singleEncode = base64.encode(data);
  let encodeSingleWithPass = base64.encode(singleEncode + keys?.Kpass);
  let sendEncode = base64.encode(
    singleEncode + keys?.Kpass + encodeSingleWithPass,
  );
  console.log("sendEncode-----------", sendEncode);
  return sendEncode;
};

export const methodSecurityDecoded = (data: any) => {
  let doubleDecodeString = base64.decode(data);
  let singleDat = doubleDecodeString.split(keys?.Kpass);
  if (singleDat && singleDat.length > 0) {
    let singleEndCodeData = singleDat[0];
    let singleDecodeString = base64.decode(singleEndCodeData);
    //console.log('sendDecode-----------', singleDecodeString);
    return singleDecodeString;
  }
};

export const to24Hour = (time: string, period: "AM" | "PM") => {
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const toMinutes = (time: string, period: "AM" | "PM") => {
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

type PeriodType = "AM" | "PM";

export const from24To12Hour = (time24: string) => {
  let [h, m] = time24.split(":").map(Number);
  const period: PeriodType = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;

  return {
    time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    period,
  };
};

export const formateSeconds = (seconds: any) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(secs).padStart(2, "0")}`;
};

export const getGroupId = (uId: any, otherId: any) => {
  return uId < otherId ? uId + "-" + otherId : otherId + "-" + uId;
};

// for calling ----------------

export var callRing: any = null;
export const assignSuccessSound = (initCall: boolean) => {
  let ringTone = initCall ? imagePath.user : imagePath.user;
  callRing = new Sound(ringTone, (error) => {
    callRing?.setNumberOfLoops(-1);
    if (error) {
      return;
    }
  });
};

var myInterval: any = "";
export const ringPlay = (initCall: boolean = false) => {
  assignSuccessSound(initCall);

  // callRing??.setNumberOfLoops(-1);
  myInterval = setInterval(() => {
    callRing?.play();
  }, 1000);
};

export const ringStop = () => {
  if (myInterval) {
    clearInterval(myInterval);
  }
  callRing?.stop();
  if (callRing?.isPlaying()) {
    callRing?.stop();
  }
};

export const disconnectCall = async (callObject: any) => {
  let connection = await isNetworkAvailable();
  if (connection) {
    let socketConnected = socketIsConnected();
    if (socketConnected) {
      try {
        socketEmit(
          socketEvent.call_disconnect,
          {
            other_user_id: callObject?.sender,
            group_id: callObject?.group,
          },
          (res) => {
            if (res?.code == 404) {
              showToastMessage(res?.message);
              return false;
            }

            if (res?.status) {
              return true;
            }
          },
        );
      } catch (error) {}
    } else {
      socketConnectionCheck();

      // showToastMessage("Please wait to connect...", "info");
    }
  }
};

export const callAccept = async (callObject: any) => {
  let connection = await isNetworkAvailable();
  if (connection) {
    let socketConnected = socketIsConnected();
    if (socketConnected) {
      socketEmit(
        socketEvent.accept_call,
        {
          other_user_id: callObject?.sender,
          group_id: callObject?.group,
          is_verification_done: true,
          schedule_call_id: callObject?.schedule_call_id,
        },
        (res) => {
          if (res?.code == 404) {
            showToastMessage(res?.message);
            return true;
          }

          if (res?.status) {
            return res;
          }
        },
      );
    } else {
      socketConnectionCheck();
    }
  }
};

export async function requestCallPermissionsOnStart() {
  if (Platform.OS !== "android") return;

  const permissions = [
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    PermissionsAndroid.PERMISSIONS.CALL_PHONE,
  ];

  if (Platform.Version >= 33) {
    permissions.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }

  try {
    const result = await PermissionsAndroid.requestMultiple(permissions);
    return result;
  } catch (e) {
    console.warn("Permission request failed", e);
  }
}
export const isCallKeepEnabled = async (): Promise<boolean> => {
  if (Platform.OS === "ios") return true;

  try {
    const enabled = await RNCallKeep.checkPhoneAccountEnabled();
    return !!enabled;
  } catch (e) {
    console.log("checkPhoneAccountEnabled error", e);
    return false;
  }
};

const CALL_PAYLOAD_PREFIX = "CALL_PAYLOAD_";

export const storeCallPayload = async (callUUID: any, payload: any) => {
  await setData(`${CALL_PAYLOAD_PREFIX}${callUUID}`, payload);
};

export const getCallPayload = async (callUUID: any) => {
  return await getData(`${CALL_PAYLOAD_PREFIX}${callUUID}`);
};

export const removeCallPayload = async (callUUID: any) => {
  await removeItemValue(`${CALL_PAYLOAD_PREFIX}${callUUID}`);
};
