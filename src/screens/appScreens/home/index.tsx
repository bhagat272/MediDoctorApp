import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  AppState,
  DeviceEventEmitter,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { profileAction } from "../../../redux/actions/userSessionAction";
import {
  socketConnectionCheck,
  socketCustomDisconnect,
  socketIsConnected,
  socketReconnect,
} from "../../../utils/socket";
import imagePath from "../../../theme/imagePath";
import {
  IMAGE_URL,
  JSON_HEADER,
  VoipCallAccept,
  VoipCallData,
} from "../../../redux/apis/commonValue";
import { CustomAlert, ImageLoadView, StripeConnect } from "../../../components";
import {
  stripeConnectAction,
  userListForChatAction,
} from "../../../redux/actions/appSessionAction";
import { Colors } from "../../../theme";
import styles from "./styles";
import { translateText } from "../../../utils/language";
import { isNetworkAvailable } from "../../../redux/apis/network";
import { DEVICE_INFO, showErrorMessage } from "../../../utils/helper";
import { APP_SESSION_API } from "../../../redux/apis/endpoints";
import { showToastMessage } from "../../../utils/toast";
import { post } from "../../../redux/apis/apiHelper";
import { getData, removeItemValue } from "../../../redux/apis/keyChain";
import VoipPushNotification from "react-native-voip-push-notification";
import { getFCMToken } from "../../../utils/notificationPermissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNCallKeep from "react-native-callkeep";
import {
  cameraPermissions,
  cameraPermissionsForCall,
  checkMicroPhonePermission,
} from "../../../permissions/appPermissions";
import { loading } from "../../../redux/reducer/loadingReducer";
import RNNotificationCall from "react-native-full-screen-notification-incoming-call";
import { loading as Loader } from "../../../redux/reducer/loadingReducer";

const Home = (props: any) => {
  const dispatch = useDispatch();
  const [userList, setUserList] = useState<any>([]);
  const { userData } = useSelector((state: any) => state.session);
  const [isPer, setIsPer] = useState(false);
  const [parameter, setParameter] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [stripeConnectURL, setStripeConnectURL] = useState("");
  const [stripeModalShow, setStripeModalShow] = useState(false);
  const hasNavigatedRef = useRef(false);
  const isFetchingRef = useRef(false);
  useEffect(() => {
    socketConnectionCheck();
    if (Platform.OS === "ios") {
      VoipPushNotification.registerVoipToken();
    }
  }, []);
  useEffect(() => {
    checkCallPermission();
    return () => {
      socketCustomDisconnect()

    }
  }, []);

  useEffect(() => {
    dispatch(profileAction());
  }, [dispatch]);

  // useEffect(() => {

  //   AppState.addEventListener("change", (state: any) => {
  //     if (state != "inactive" || state === "background") {
  //       socketCustomDisconnect();
  //     }
  //   });
  // }, []);


  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (state) => {
  //     console.log("AppState:", state);

  //     if (state === "inactive") {
  //       socketCustomDisconnect();
  //     }
  //   });

  //   return () => {
  //     socketCustomDisconnect()
  //     subscription.remove();
  //   };
  // }, []);


  useEffect(() => {
    if (Platform.OS === "ios") {
      VoipPushNotification.addEventListener("register", async (voipToken) => {
        if (!voipToken && Platform.OS === "ios") return;
        // Send this token to your backend server
        let dic: any = { ...DEVICE_INFO };
        let token = await getFCMToken();
        console.log("voipToken--" + voipToken);

        if (voipToken) {
          dic.voip_token = voipToken;
        } else {
          dic.voip_token = "simulator";
        }

        if (token) {
          dic.device_token = token;
        }

        Object.assign(DEVICE_INFO, dic);
        updateDeviceTokenRequest();
      });
      // Trigger token registration
    }

    // else {
    //   (async () => {
    //     let dic: any = { ...DEVICE_INFO };
    //     let token = await getFCMToken();

    //     if (token) {
    //       dic.device_token = token;
    //     }
    //     Object.assign(DEVICE_INFO, dic);
    //     // console.log('dic--fcm--11--->', dic);
    //     updateDeviceTokenRequest();
    //   })();
    // }
    return () => {
      // VoipPushNotification.removeEventListener("register");
    };
  }, []);



  // useEffect(() => {
  //   if (parameter && isPer) {
  //     props.navigation.navigate("VideoCall", parameter);
  //   }
  // }, [parameter, isPer]);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getVoipStoredDataWithRetry = async (retries = 5, delay = 300) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      socketConnectionCheck();
      const agoraCred = await getData(VoipCallData);
      const callAccept = await getData(VoipCallAccept);

      console.log(`VoIP fetch attempt ${attempt}:`, { agoraCred, callAccept });

      if (agoraCred && callAccept === "true") {
        return { agoraCred, callAccept };
      }

      if (attempt < retries) {
        await sleep(delay);
      }
    }

    return { agoraCred: null, callAccept: null };
  };

  /* ---------------------------------- */
  /* Component Logic */
  /* ---------------------------------- */

  useEffect(() => {
    getLinkingData(); // for killed / cold start

    const sub = DeviceEventEmitter.addListener(
      "receiver_call_connect_voip",
      () => {
        getLinkingData(); // foreground / background
      },
    );

    return () => {
      sub.remove(); // VERY IMPORTANT
    };
  }, []);

  const getLinkingData = async () => {
    console.log("🔍 [getLinkingData] Starting data retrieval...");
    console.log("🔍 [getLinkingData] Keys:", { VoipCallData, VoipCallAccept });

    let agoraCred: any = await getData(VoipCallData);
    let callAccept = await getData(VoipCallAccept);
    let callUUID = await getData("callUUID");
    dispatch(Loader(true));
    console.log(
      "📦 [getLinkingData] Raw agoraCred:",
      JSON.stringify(agoraCred, null, 2),
    );
    console.log("📦 [getLinkingData] Raw callAccept:", callAccept);
    console.log("📦 [getLinkingData] Raw callUUID:", callUUID);

    if (Platform.OS === "android") {
      console.log("🤖 [ANDROID] Processing call data...");
      if (agoraCred && callAccept == "true") {
        console.log("✅ [ANDROID] Data found, processing...");
        console.log("agoraCred--" + JSON.stringify(agoraCred));
        console.log("agoraCred--" + JSON.stringify(agoraCred.data.groupData));
        removeItemValue(VoipCallData);
        removeItemValue(VoipCallAccept);

        const dic = {
          sender: agoraCred?.data?.sender,
          sender_name: agoraCred?.data?.sender_name,
          sender_image: agoraCred?.data?.sender_image,
        };

        const groupMembers = [
          {
            id: agoraCred?.data?.receiver,
            name: agoraCred?.data?.receiver_name,
            profile_image: agoraCred?.data?.receiver_image,
          },
        ];

        const paramObj = {
          groupDetails: agoraCred?.data?.groupData,
          groupId: agoraCred?.data?.group,
          initCall: false,
          call_type: agoraCred?.data?.call_type,
          members: groupMembers,
          userObject: dic,
          callUUID: callUUID,
        };


        console.log(
          "🚀 [ANDROID] Navigating with params:",
          JSON.stringify(paramObj, null, 2),
        );
        console.log(
          "paramObj before accept--" +
          JSON.stringify(paramObj) +
          " name " +
          userData?.name,
        );
        setParameter(paramObj);

        const mic = await checkMicroPhonePermission();
        const cam = await cameraPermissionsForCall();
        dispatch(Loader(false));
        console.log("Navigating to VideoCall with paramObj:", JSON.stringify(paramObj, null, 2));

        if (mic && cam) {
          if (hasNavigatedRef.current) return;
          hasNavigatedRef.current = false;
          setTimeout(async () => {
            const isConnected = await isNetworkAvailable();
            if (isConnected) {
              props.navigation.navigate("VideoCall", paramObj);
              dispatch(Loader(false));
            } else {
              showToastMessage("No internet connection", "danger");
              dispatch(Loader(false));
            }
          }, 1500);
        }
      } else {
        console.log("❌ [ANDROID] No data found or callAccept not true");
        console.log("   - agoraCred exists:", !!agoraCred);
        console.log("   - callAccept value:", callAccept);
        dispatch(Loader(false));
      }
    } else {
      // 🔹 iOS handling with proper data extraction
      console.log("🍎 [iOS] Processing call data...");
      if (agoraCred && callAccept == "true") {
        console.log("✅ [iOS] Data found, processing...");
        console.log("agoraCred IOS raw:", agoraCred);
        console.log("callAccept IOS:", callAccept);

        // 🔹 Extract the actual call data (handling nested structure)
        const callData = agoraCred?.data || agoraCred;

        removeItemValue(VoipCallData);
        removeItemValue(VoipCallAccept);

        const dic = {
          sender: callData?.sender,
          sender_name: callData?.sender_name,
          sender_image: callData?.sender_image,
        };

        const groupMembers = [
          {
            id: callData?.receiver,
            name: callData?.receiver_name,
            profile_image: callData?.receiver_image,
          },
        ];

        const paramObj = {
          groupDetails: callData?.groupData,
          groupId: callData?.group,
          initCall: false,
          call_type: callData?.call_type,
          members: groupMembers,
          userObject: dic,
          call_token: callData?.call_token,
          call_channel: callData?.call_channel,
          callUUID: callUUID,
        };

        console.log(
          "🚀 [iOS] Navigating with params:",
          JSON.stringify(paramObj, null, 2),
        );
        console.log("paramObj IOS before navigation:", paramObj);
        console.log("dic IOS:", dic);
        console.log("groupMembers IOS:", groupMembers);

        // 🔹 Clear the stored data
        removeItemValue(VoipCallData);
        removeItemValue(VoipCallAccept);

        const mickper = await checkMicroPhonePermission();
        const camera = await cameraPermissionsForCall();
        dispatch(loading(false));
        if (mickper && camera) {
          setTimeout(async () => {
            const isConnected = await isNetworkAvailable();
            if (isConnected) {
              console.log("iOS Navigation to VideoCall with params:", paramObj);
              // RNCallKeep.endAllCalls();
              props.navigation.navigate("VideoCall", paramObj);
              dispatch(Loader(false));
            } else {
              showToastMessage("No internet connection", "danger");
              if (Platform.OS == "ios") {
                // RNCallKeep.endAllCalls();
                dispatch(Loader(false));
              }
              if (Platform.OS === "android") {
                RNNotificationCall.hideNotification()
                dispatch(Loader(false));

              }
            }
          }, 1500);
        } else {
          console.warn("iOS: Camera/Microphone permission denied");
          // Optionally show an alert
          // Alert.alert('Permission required', 'Call permission is required');
        }
      } else {
        console.log("❌ [iOS] No data found or callAccept not true");
        console.log("   - agoraCred exists:", !!agoraCred);
        console.log("   - callAccept value:", callAccept);
        dispatch(Loader(false));
      }
    }
  };
  const updateDeviceTokenRequest = async () => {
    console.log("DEVICE_INFO>>>>>>>>>>>>><<<<<?????????", DEVICE_INFO);
    try {
      const response = await post({
        url: APP_SESSION_API?.doctor_update_fcm,
        data: JSON.stringify(DEVICE_INFO),
        header: JSON_HEADER,
      });
      console.log("UPDATE_DEVICE_TOKEN:<<<<<<<<<<<<<<<<", response);

      if (response.status == true) {
      } else {
        showToastMessage(response.message);
      }
    } catch (error) {
      showErrorMessage();
    }
  };
  useEffect(() => {
    if (
      Platform.OS == "android" &&
      global?.userData &&
      DEVICE_INFO.device_token != "simulator"
    ) {
      // console.log("req-=-=-=-=-=-=>", DEVICE_INFO);
      updateDeviceTokenRequest();
    }
  }, [DEVICE_INFO]);

  const connectStripe = async () => {
    try {
      const response: any = await dispatch(stripeConnectAction({}));

      const { status, url } = response;

      if (status === "true" && url) {
        setStripeConnectURL(url);
        setStripeModalShow(true);
        setShowConfirm(false);
      } else {
        showToastMessage("Unable to initiate Stripe connection.", "danger");
      }
    } catch (error: any) {
      console.error("Stripe connection failed:", error);
      showToastMessage("Stripe connection failed.", "danger");
    }
  };

  const checkCallPermission = async () => {

    try {
      // ⚠️ Not typed in TS but works at runtime
      const enabled = await (RNCallKeep as any).checkPhoneAccountEnabled();
      console.log("enabale", enabled);
      if (!enabled) {
        // Alert.alert(
        //   "Call Permission Required",
        //   "You have denied call permission. To receive calls, please enable it from settings.",
        //   [
        //     {
        //       text: "Cancel",
        //       style: "cancel",
        //     },
        //     {
        //       text: "OK",
        //       onPress: () => {
        //         Linking.openSettings(); // ✅ Correct way
        //       },
        //     },
        //   ],
        //   { cancelable: true },
        // );
      } else {
        await AsyncStorage.setItem("call_permission", JSON.stringify(true));
      }
    } catch (error) {
      console.log("Call permission check error", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ImageLoadView
          source={
            userData?.profile_picture
              ? { uri: userData.profile_picture }
              : imagePath.user_icon
          }
          style={styles.profileImage}
        />
        <Text numberOfLines={3} ellipsizeMode="tail" style={styles.userName}>
          {userData?.name.length > 20
            ? +userData?.name?.substring(0, 14) + "..."
            : userData?.name}
        </Text>
      </View>

      {/* Appointments Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => props.navigation.navigate("Appointments")}
      >
        <View style={styles.iconWrapper}>
          <Image source={imagePath.appointment_icon} style={styles.cardIcon} />
        </View>
        <Text style={styles.cardText}>{translateText("appointments")}</Text>
      </TouchableOpacity>

      {/* Manage Availability Card */}
      <TouchableOpacity
        hitSlop={5}
        style={styles.card}
        onPress={() => {
          console.log("userData ", userData);

          if (Number(userData?.stripe_setup) === 0) {
            setShowConfirm(true);
            return;
          } else {
            props.navigation.navigate("ManageAvailability");
          }
        }}
      >
        <View style={styles.iconWrapper}>
          <Image source={imagePath.availability_icon} style={styles.cardIcon} />
        </View>
        <Text style={styles.cardText}>
          {translateText("manage_availability")}
        </Text>
      </TouchableOpacity>
      <CustomAlert
        visible={showConfirm}
        message={translateText("setup_stripe")}
        confirmText={translateText("Proceed")}
        cancelText={translateText("Cancel")}
        onConfirm={() => {
          setShowConfirm(false);
          connectStripe();
        }}
        onCancel={() => {
          setShowConfirm(false);
        }}
      />

      {stripeModalShow && (
        <StripeConnect
          stripe_url={stripeConnectURL}
          visible={stripeModalShow}
          onCompletion={(success: boolean) => {
            setStripeModalShow(false);
            setStripeConnectURL("");

            if (success) {
              showToastMessage(
                "Your merchant account setup was successful.",
                "success",
              );

              // const updatedUserData = {
              //   ...userData,
              //   stripe_setup: 1,
              // };

              // dispatch(userPayload(updatedUserData));
              dispatch(profileAction());
            } else {
              showToastMessage(
                "There was a problem. Please try again.",
                "danger",
              );
            }
          }}
          onCancel={() => {
            setStripeModalShow(false);
            setStripeConnectURL("");
          }}
        />
      )}
    </View>
  );
};

export default Home;
