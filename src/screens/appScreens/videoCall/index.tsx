import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  BackHandler,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  RtcConnection,
  RtcSurfaceView,
} from "react-native-agora";
import { useEffect, useRef, useState } from "react";
import {
  socketConnectionCheck,
  socketEmit,
  socketEvent,
  socketIsConnected,
  socketReconnect,
} from "../../../utils/socket";
import {
  formateSeconds,
  methodSecurityDecoded,
  ringPlay,
  ringStop,
} from "../../../utils/helper";
import imagePath from "../../../theme/imagePath";
import styles from "./styles";
import Colors from "../../../theme/colors";
import ImageLoadView from "../../../components/imageLoadView";
import { Flow } from "react-native-animated-spinkit";
import { AGORA_KEY, IMAGE_URL } from "../../../redux/apis/commonValue";
import moment from "moment";

import BackgroundTimer from "react-native-background-timer";
import { isNetworkAvailable } from "../../../redux/apis/network";
import { showToastMessage } from "../../../utils/toast";
import { loading } from "../../../redux/reducer/loadingReducer";
import { useDispatch, useSelector } from "react-redux";
import { translateText } from "../../../utils/language";
import {
  cameraPermissions,
  checkMicroPhonePermission,
} from "../../../permissions/appPermissions";

// import {
//   usersListOnCall,
// } from '../../../redux/actions/appSessionAction';
import { useIsFocused, useNavigation } from "@react-navigation/native";

import SmallRtcView from "./SmallRtcView";
import RNCallKeep from "react-native-callkeep";

let agoraEngine: any = null;
let repeatCalling: any = {
  timer: null,
  timerValue: 50, // should be 60 at least
};

let call_token: string = "";
let joinedMembers: any = [];
let groupCallMembersIds: any = null;
let callClearEngineTimeout: any = false;
const VideoCalling = (props: any) => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  let { members, groupId, groupDetails, withOutVoip } =
    props?.route?.params ?? {};

  groupCallMembersIds = members?.map((user: any) => user?.id);

  const { initCall, call_type } = props?.route?.params || {};
  let paramsObject = props?.route?.params?.userObject || {};
  const agoraEngineRef = useRef<any>(null);
  const uid = Math.floor(Math.random() * 100000);

  const [videoCall, setVideoCall] = useState<boolean>(false);
  const [isCallAccepted, setIsCallAccepted] = useState<boolean>(
    initCall ? false : true,
  );
  const { buttonLoader } = useSelector((state: any) => state.loading);
  const [usersOnCall, setUsersOnCall] = useState<object[]>([]);
  const [loadingUsersList, setLoadingUsersList] = useState<boolean>(false);
  const [connectionData, setConnectionData] = useState<any>();
  const appId: any = AGORA_KEY;
  // methodSecurityDecoded(AGORA_KEY);
  const [counter, setCounter] = useState<number>(-1);
  const navigation = useNavigation();
  // for audio calls -----
  const [openMicrophone, setOpenMicrophone] = useState<boolean>(true);
  const [enableSpeakerphone, setEnableSpeakerphone] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showUsersList, setShowUsersList] = useState<boolean>(false);

  const [cameraOn, setCameraOn] = useState(call_type === "video");
  const [isLocalMain, setIsLocalMain] = useState(false);

  const [localCameraOn, setLocalCameraOn] = useState(call_type === "video");
  const [remoteCameraOn, setRemoteCameraOn] = useState(true);

  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isConnecting, setIsConnecting] = useState(!withOutVoip && !initCall);

  useEffect(() => {
    if (videoCall) setCounter(0);
  }, [videoCall]);

  useEffect(() => {
    if (counter == -1) return;

    let interval: any = BackgroundTimer.setInterval(() => {
      setCounter(counter + 1);
    }, 1000);
    return () => {
      BackgroundTimer.clearInterval(interval);
      BackgroundTimer.stop();
    };
  }, [counter]);

  useEffect(() => {
    if (initCall) {
      ringPlay(initCall);
      getToken();
    }
  }, [initCall, groupId]);

  useEffect(() => {
    console.log("initecall--" + initCall);
    console.log("groupId--" + groupId);
    console.log("connectionData--" + JSON.stringify(connectionData));

    if (connectionData && initCall) {
      methodSetBackgroundTimer();
    }
  }, [connectionData, initCall, groupId]);

  useEffect(() => {
    const handleBackButtonClick = () => {
      if (buttonLoader) {
        ringStop();
        disconnectCall();
      }
      return true;
    };

    let backEvent = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonClick,
    );

    return () => {
      backEvent.remove();
    };
  }, [buttonLoader]);

  //Emit listnears ------
  useEffect(() => {
    dispatch(loading(false));
    let userLeftFromCall = DeviceEventEmitter.addListener(
      "user_left_from_call",
      async (response) => {
        console.log("user_left_from_call 1111", { user: global?.userData?.id });
        console.log("response get--" + JSON.stringify(response));
        // getUserListOnCall(response?.data?.call_token);
      },
    );

    let callDisconnected = DeviceEventEmitter.addListener(
      "call_disconnected",
      async (response) => {
        console.log("call_disconnected 1111", { user: global.userData.id });
        console.log("response get--" + JSON.stringify(response));
        console.log("rrinitCall--" + JSON.stringify(initCall));
        callClearEngineTimeout = true;
        setVideoCall(false);
        if (Platform.OS === "ios") {
          RNCallKeep.endAllCalls();
        }
        props.navigation.goBack();
        if (callClearEngineTimeout) {
          return;
        }
        // if (navigation?.canGoBack?.()) {
        //   callClearEngineTimeout = true;
        //   setVideoCall(false);
        //   props.navigation.goBack();
        // }
      },
    );

    let callRejected = DeviceEventEmitter.addListener(
      socketEvent.call_rejected,
      async (response) => {
        console.log(
          "call_rejected ------     ",
          JSON.stringify(response, null, 2),
        );

        if (callClearEngineTimeout) {
          return;
        }
        if (navigation?.canGoBack?.()) {
          callClearEngineTimeout = true;
          setVideoCall(false);
          props.navigation.goBack();
        }
      },
    );
    let callAccepted = DeviceEventEmitter.addListener(
      socketEvent.call_accepted,
      async (response) => {
        console.log("call accepted--" + JSON.stringify(response));
        ringStop();
        if (repeatCalling?.timer) {
          BackgroundTimer.clearTimeout(repeatCalling?.timer);
          repeatCalling.timerValue = 50;
        }
        if (response?.data?.selfData && initCall) {
          getUserListOnCall(response?.data?.call_token);
          if (joinedMembers?.length > 0) {
            let existingIds = joinedMembers?.map((mem: any) => mem?.id);
            let userAlreadyExisted = joinedMembers?.some((mem: any) => {
              mem?.id == response?.data?.selfData?.id;
            });
            if (!userAlreadyExisted) {
              joinedMembers = [...joinedMembers, response?.data?.selfData];
            }
          } else {
            joinedMembers = [response?.data?.selfData];
          }
        }

        if (call_type === "video") {
          if (initCall) {
            ringStop();
            joinChannel(
              response?.data?.call_token,
              response?.data?.call_channel,
            );
            setIsCallAccepted(true);
            setVideoCall(true);
          }
        } else {
          if (initCall) {
            ringStop();
            joinChannel(
              response?.data?.call_token,
              response?.data?.call_channel,
            );
            setIsCallAccepted(true);
            setVideoCall(true);
          } else if (response?.data?.selfData?.id == global.userData.id) {
            ringStop();
            joinChannel(
              response?.data?.call_token,
              response?.data?.call_channel,
            );
            setIsCallAccepted(true);
            setVideoCall(true);
          }
        }
      },
    );
    let voipCallDisconnected = DeviceEventEmitter.addListener(
      "voip_call_cut",
      async (response) => {
        console.log("voip_call_cut---------");
        setVideoCall(false);
        clearAgoraEngine();
        if (Platform.OS === "ios") {
          RNCallKeep.endAllCalls();
        }
      },
    );
    return () => {
      callDisconnected?.remove();
      userLeftFromCall.remove();
      callRejected?.remove();
      callAccepted?.remove();
      voipCallDisconnected?.remove();
      setLocalCameraOn(false);
      setRemoteCameraOn(false);
      setRemoteUsers([]);
      callClearEngineTimeout = false;
      agoraEngineRef.current?.unregisterEventHandler();
      agoraEngineRef.current?.release();
      agoraEngine = null;
      agoraEngineRef?.current?.leaveChannel();
      ringStop();
      if (repeatCalling?.timer) {
        BackgroundTimer.clearTimeout(repeatCalling?.timer);
        repeatCalling.timerValue = 50;
      }
    };
  }, []);

  useEffect(() => {
    setupAgora();
  }, [withOutVoip, initCall]);

  const setupAgora = async () => {
    console.log("KKKKKKKKKKK start the agora>>>>>>>>>>>");
    callClearEngineTimeout = false;
    // await checkMicroPhonePermission();

    // call_type === "video" ? await cameraPermissions() : true;
    console.log("Call connect");
    try {
      agoraEngineRef.current = createAgoraRtcEngine();
      agoraEngine = agoraEngineRef.current;
      console.log("agora engine start", appId);
      await agoraEngine.initialize({
        appId: appId,
      });
      await agoraEngine.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );
      await agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

      await agoraEngine.registerEventHandler({
        onJoinChannelSuccess: (uid: any) => {
          console.log("Joined channel----------", uid);
        },
        // onUserJoined: (_connection: any, Uid: any) => {
        //   console.log("Remote user joined:", Uid);
        //   setJoinedUserIds((prev: any) =>
        //     prev.includes(Uid) ? prev : [...prev, Uid],
        //   );
        //   setRemoteCameraOn(true);
        // },
        // onUserOffline: (_connection: any, Uid: any) => {
        //   console.log("Remote user left:", Uid);
        //   setJoinedUserIds((prev) => prev.filter((id: any) => id !== Uid));
        //   setRemoteCameraOn(false);
        //   disconnectCall();
        //   clearAgoraEngine();
        //   if (Platform.OS === "ios") {
        //     RNCallKeep.endAllCalls();
        //   }
        // },
        onUserJoined: (_connection: any, Uid: any) => {
          setRemoteUsers((prev: any) =>
            prev.includes(Uid) ? prev : [...prev, Uid],
          );
          setRemoteCameraOn(true);
        },
        onUserOffline: (_connection: any, Uid: any) => {
          setRemoteUsers((prev) => prev.filter((id: any) => id !== Uid));
          setRemoteCameraOn(false);
          disconnectCall();
          clearAgoraEngine();
          if (Platform.OS === "ios") {
            RNCallKeep.endAllCalls();
          }
        },
        onUserMuteVideo: (
          connection: RtcConnection,
          uid: number,
          muted: boolean,
        ) => {
          setRemoteCameraOn(!muted);
        },
        onLocalVideoStateChanged: (state: any, error: any) => {
          console.log("Local video state:", state, "error:", error);
        },

        onError: (err: any) => {
          console.log("Agora error:", err);
        },
      });
      socketConnectionCheck();
      if (!withOutVoip && !initCall) {
        callAccept();
      }
      // Manage audio/video
      if (call_type === "video") {
        await agoraEngine.enableVideo();
        await agoraEngine.startPreview();
      } else {
        await agoraEngine.enableAudio();
        agoraEngine.enableLocalAudio(true);
        agoraEngine.muteLocalAudioStream(false);
        agoraEngine.setDefaultAudioRouteToSpeakerphone(false);
      }
    } catch (error) {
      console.log("Setup error:", error);
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      socketConnectionCheck();
    }
  }, [isFocused]);

  useEffect(() => {
    handlePermissions().then((granted) => {
      setPermissionGranted(granted);
    });
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        // App is going to background or locked
        console.log("App is backgrounded — disabling camera");
        agoraEngineRef.current?.disableVideo();
      } else if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App comes to foreground
        console.log("App is foregrounded — enabling camera");
        agoraEngineRef.current?.enableVideo();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handlePermissions = (): Promise<boolean> => {
    return new Promise(async (resolve) => {
      if (call_type === "video") {
        const granted: any = await cameraPermissions();
        if (granted) {
          resolve(true);
        } else {
          showToastMessage(translateText("camera_microphone_permissions"));
          resolve(false);
        }
      } else {
        resolve(true); // fallback if not video
      }
    });
  };

  const clearAgoraEngine = async () => {
    if (callClearEngineTimeout) {
      return;
    }
    call_token = "";
    await agoraEngineRef?.current?.leaveChannel();
    if (navigation?.canGoBack?.()) {
      callClearEngineTimeout = true;
      props?.navigation?.goBack();
    }
  };

  const onTimerOut = () => {
    ringStop();
    console.log("ringStop -- disconnectCall" + JSON.stringify(connectionData));
    socketEmit(
      socketEvent.call_disconnect,
      {
        call_token: connectionData?.token,
        group_id: connectionData?.group,
      },
      (res) => {
        console.log(
          "not_answer_users_remove_from_call res-" + JSON.stringify(res),
        );

        if (repeatCalling?.timer) {
          BackgroundTimer.clearTimeout(repeatCalling?.timer);
          repeatCalling.timerValue = 50;
        }
        if (res?.call_disconnect) {
          disconnectCall();
        }
      },
    );
  };

  const methodSetBackgroundTimer = () => {
    if (repeatCalling.timerValue <= 0) {
      if (connectionData) {
        onTimerOut();
      }
      return;
    }
    repeatCalling.timer = BackgroundTimer.setTimeout(() => {
      repeatCalling.timerValue = repeatCalling.timerValue - 5;
      console.log(
        "repeatCalling.timerValue-------1111",
        repeatCalling.timerValue,
      );

      methodSetBackgroundTimer();
    }, 5000);
  };

  const disconnectCall = async () => {
    console.log("socketIsConnected()------", socketIsConnected());

    if (!socketIsConnected()) {
      // showToastMessage("socket disconnected. Please wait and retry.", "info");
      socketReconnect();
    }
    console.log(
      "Disconnect Call>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      {
        other_user_id:
          initCall == false
            ? paramsObject?.sender
            : groupCallMembersIds?.length > 1
              ? groupCallMembersIds?.join(", ")
              : groupCallMembersIds?.[0],
        group_id: groupId,
        user_id: global?.userData?.id,
        call_token: connectionData?.token,
        call_channel: connectionData?.channel,
      },
    );
    socketEmit(
      socketEvent.call_disconnect,
      {
        other_user_id:
          initCall == false
            ? paramsObject?.sender
            : groupCallMembersIds?.length > 1
              ? groupCallMembersIds?.join(", ")
              : groupCallMembersIds?.[0],
        group_id: groupId,
        user_id: global?.userData?.id,
        call_token: connectionData?.token,
        call_channel: connectionData?.channel,
      },
      (res) => {
        console.log("disconnect call pressed ----", JSON.stringify(res));
        if (res?.code == 404) {
          showToastMessage(res?.message);
        }
        if (res?.status && res?.data) {
          joinedMembers = [];
          setVideoCall(false);
          clearAgoraEngine();
          props.navigation.goBack();
          if (Platform.OS === "ios") {
            RNCallKeep.endAllCalls();
          }
          // let isSender: boolean =
          //   paramsObject?.sender == res?.data?.selfData?.id;
          // let userLeftCall = global?.userData?.id == res?.data?.selfData?.id;
          // let isLastUser = res?.data?.isLastUser;

          // if (isSender || isLastUser || userLeftCall) {
          //   joinedMembers = [];
          //   setVideoCall(false);
          //   clearAgoraEngine();
          //   props.navigation.goBack();
          // }
        } else {
          if (Platform.OS === "ios") {
            RNCallKeep.endAllCalls();
          }
          setVideoCall(false);
          clearAgoraEngine();
          props.navigation.goBack();
        }
      },
    );
  };

  const callAccept = async () => {
    let connection = await isNetworkAvailable();
    console.log("callAccept -----", { connection });
    if (connection) {
      const par = {
        other_user_id:
          initCall == false
            ? paramsObject?.sender
            : groupCallMembersIds?.length > 1
              ? groupCallMembersIds?.join(", ")
              : groupCallMembersIds?.[0],
        group_id: groupId,
        // is_verification_done: true,
        call_type: call_type,
      };

      console.log("accept call req", par);

      // try {
      socketEmit(socketEvent.accept_call, par, (res) => {
        setIsConnecting(false);
        // getUserListOnCall(res?.data?.call_token);
        console.log("res>>>>>>>>>> Accept Call", res);
        if (res?.code == 404) {
          showToastMessage(res?.message);
        }
        if (res?.status) {
          joinChannel(res?.data?.call_token, res?.data?.call_channel);
          setVideoCall(true);
        } else {
          showToastMessage(res?.message);
          setVideoCall(false);
          clearAgoraEngine();
        }
      });
    } else {
      setIsConnecting(false);
    }
  };

  const getToken = async () => {
    let connection = await isNetworkAvailable();

    if (connection) {
      const obj = {
        user_id: global?.userData?.id,
        other_user_id:
          initCall == false
            ? paramsObject?.sender
            : groupCallMembersIds?.length > 1
              ? groupCallMembersIds?.join(", ")
              : groupCallMembersIds?.[0],
        group_id: groupId,
        current_date: moment()?.local()?.format("YYYY-MM-DD"),
        call_type: call_type,
      };

      socketEmit(socketEvent.call_connection, obj, (res) => {
        console.log("res------call_connection---------", res);

        const stringUID = String(global?.userData?.id);
        if (res?.data) {
          setConnectionData({
            appId: appId,
            channel: res?.data?.call_channel,
            token: res?.data?.call_token,
            group: res?.data?.group,
            uid: stringUID,
          });
        }
        console.log("res after start call 2--" + JSON.stringify(res?.data));
        console.log(
          "set call data--" +
          JSON.stringify({
            appId: appId,
            channel: res?.data?.call_channel,
            token: res?.data?.call_token,
            uid: stringUID,
          }),
        );

        console.log(
          "res after start call 2--" +
          JSON.stringify(res?.data?.usersBusyStatus),
        );
        if (res?.data?.usersBusyStatus?.length > 0) {
          console.log("in if 1");
          let message = "";
          if (res?.data?.usersBusyStatus?.length == 1) {
            console.log("in if 2");
            message +=
              res?.data?.usersBusyStatus[0] + " is busy on another call.";
          } else {
            console.log("in if 3");
            message +=
              res?.data?.usersBusyStatus?.join(",") +
              " are busy on another call.";
          }
          //translateText('the_user_is_on_another_call'),
          showToastMessage(message, "warning");

          if (callClearEngineTimeout) {
            return;
          }
          if (
            res?.data?.call_need_to_wait?.length == 0 &&
            navigation?.canGoBack?.()
          ) {
            callClearEngineTimeout = true;
            props.navigation.goBack();
            return;
          }
        }
        if (res?.code === 404) {
          showToastMessage(res?.message);
        }
      });
    }
  };

  const joinChannel = async (token: any, channelName: any) => {
    console.log("Token", token);
    console.log("channelName", channelName);
    // Validate required values
    ringStop();
    if (!token || !channelName || uid === undefined) {
      showToastMessage("Missing token or channel name");
      return;
    }

    const stringUID = String(uid);
    setConnectionData({
      appId: appId,
      channel: channelName,
      token: token,
      uid: stringUID,
    });
    console.log("join-----------------------", token, channelName, uid);

    // call_token = token;
    try {
      const result = await agoraEngine.joinChannel(token, channelName, uid, {
        clientRoleType: 1,
      });

      if (call_type === "video") {
        await agoraEngine.enableVideo();
        await agoraEngine.startPreview();
      } else {
        await agoraEngine.enableAudio();
        agoraEngine.enableLocalAudio(true);
        agoraEngine.muteLocalAudioStream(false);
        agoraEngine.setDefaultAudioRouteToSpeakerphone(false);
      }
      console.log("joinChannel result", result);
    } catch (err) {
      console.log("joinChannel error:", err);
    }
  };

  // Switch the audio playback device.
  const methodSpeakerphone = () => {
    try {
      if (call_type === "video") {
        agoraEngine?.setEnableSpeakerphone(enableSpeakerphone);
      } else {
        agoraEngine?.setEnableSpeakerphone(!enableSpeakerphone);
      }
      setEnableSpeakerphone(!enableSpeakerphone);
    } catch (err) { }
  };

  const MethodSwitchMicroPhone = () => {
    try {
      const newState = !openMicrophone;
      agoraEngine.enableLocalAudio(newState);
      agoraEngine.muteLocalAudioStream(!newState);
      setOpenMicrophone(newState);
    } catch (err) {
      console.log("Microphone toggle error:", err);
    }
  };

  // calling timer render -----------
  const methodCallingTimeRender = (type: string) => {
    return (
      <View style={[styles.view_main_counter, { marginTop: 10 }]}>
        {counter >= 3600 && (
          <Text
            style={[
              styles.time_text,
              {
                color:
                  type == "video" ? Colors.primary.WHITE : Colors.primary.BLACK,
              },
            ]}
          >
            {formateSeconds(counter).split(":")[0]}:
          </Text>
        )}
        {counter >= 0 && (
          <Text
            style={[
              styles.time_text,
              ,
              {
                color:
                  type == "video" ? Colors.primary.WHITE : Colors.primary.BLACK,
              },
            ]}
          >
            {formateSeconds(counter).split(":")[1]}:
          </Text>
        )}
        {counter >= 0 && (
          <Text
            style={[
              styles.time_text,
              {
                color:
                  type == "video" ? Colors.primary.WHITE : Colors.primary.BLACK,
              },
            ]}
          >
            {formateSeconds(counter).split(":")[2]}
          </Text>
        )}
      </View>
    );
  };

  const getUserListOnCall = (callToken?: string) => {
    console.log("getUserListOnCall before api call");

    if (!(callToken || connectionData?.token)) {
      console.log("before api call return");
      return;
    }
    try {
      setLoadingUsersList(true);
      console.log("users_request", { callToken, call_token, connectionData });

      // dispatch(
      //   usersListOnCall({ token: callToken ?? connectionData?.token }),
      // ).then((res: any) => {
      //   console.log('getUserListOnCall-----', JSON.stringify(res, null, 2));
      //   if (res?.status && res?.data) {
      //     setUsersOnCall(res?.data);
      //   }
      //   setLoadingUsersList(false);
      // });
    } catch (error) {
      setLoadingUsersList(false);

      console.error({ error });
    }
  };

  // Audio call render -----------
  const methodAudioRender = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.primary.WHITE,
          justifyContent: "center",
          paddingTop: 120,
        }}
      >
        <FlatList
          data={[1]}
          //numColumns={joinedMembers?.length < 3 ? 1 : 2}
          keyExtractor={(item, index) => item + index?.toString()}
          renderItem={({ item, index }: any) => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <ImageLoadView
                  source={
                    groupDetails?.[0]?.group_image
                      ? {
                        uri: IMAGE_URL + groupDetails?.[0]?.group_image,
                      }
                      : groupDetails?.group_image
                        ? {
                          uri: IMAGE_URL + groupDetails?.group_image,
                        }
                        : imagePath.user_icon
                  }
                  style={styles.img_user}
                />
                <View style={styles.text_container}>
                  <Text style={styles.text_name}>
                    {groupDetails?.[0]?.group_name ?? groupDetails?.group_name}
                  </Text>

                  <Pressable
                    hitSlop={30}
                    onPress={() => {
                      if (showUsersList) {
                        console.log({ showUsersList });
                        getUserListOnCall();
                      }
                      setShowUsersList((prev) => !prev);
                    }}
                  >
                    <Image
                      source={imagePath.arrow_down}
                      style={{
                        width: 14,
                        height: 14,
                        marginLeft: 20,
                        marginVertical: 6,
                        alignSelf: "center",
                        transform: [
                          { rotate: showUsersList ? "180deg" : "0deg" },
                        ],
                      }}
                      resizeMode="contain"
                    />
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            <View style={{ width: "100%" }}>
              {methodCallingTimeRender("audio")}
              {showUsersList ? (
                loadingUsersList ? (
                  <ActivityIndicator
                    size={"small"}
                    color={Colors.primary.APP_THEME}
                  />
                ) : (
                  <View style={{ width: "100%" }}>
                    {usersOnCall?.map((user: any) => {
                      if (global.userData.id == user?.user_id) {
                        return null;
                      }

                      return (
                        <View
                          key={user?.user_id}
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "flex-start",
                          }}
                        >
                          <ImageLoadView
                            style={styles.profile_pic}
                            source={
                              user?.userData?.profile_picture
                                ? {
                                  uri:
                                    IMAGE_URL +
                                    user?.userData?.profile_picture,
                                }
                                : imagePath.user_icon
                            }
                            resizeMode={"cover"}
                          />
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.text_name,
                              {
                                marginHorizontal: 6,
                                marginTop: 0,
                                textAlign: "center",
                                textAlignVertical: "center",
                              },
                            ]}
                          >
                            {user?.user_data?.name?.length > 16
                              ? user?.user_data?.name?.slice(0, 16) + "..."
                              : user?.user_data?.name}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )
              ) : null}
            </View>
          }
        />

        <View style={styles.view_row_btn}>
          <Pressable
            style={styles.view_speaker}
            onPress={() => MethodSwitchMicroPhone()}
          >
            <Image
              style={styles.img_speaker}
              resizeMode="contain"
              source={openMicrophone ? imagePath.mute_off : imagePath.mute_on}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              ringStop();
              console.log("disconnectCall button pressed");
              disconnectCall();
            }}
          >
            <Image
              style={[styles.callAction]}
              source={imagePath.agoraendcall}
            />
          </Pressable>
          <Pressable
            style={styles.view_speaker}
            onPress={() => methodSpeakerphone()}
          >
            <Image
              style={styles.img_speaker}
              resizeMode="contain"
              source={
                enableSpeakerphone ? imagePath.speaker : imagePath.speaker_close
              }
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const toggleCamera = async () => {
    try {
      const newState = !cameraOn;

      // 1. CONTROL STREAM TRANSMISSION: Stops/starts sending your video stream.
      // This is what prevents the remote user's video from being affected.
      await agoraEngine.enableLocalVideo(newState);

      // 2. CONTROL LOCAL VIEW: Ensures the local view is correctly managed.
      if (newState) {
        // Camera ON: Restart preview
        await agoraEngine.startPreview();
      } else {
        // Camera OFF: Stop rendering the local video preview
        await agoraEngine.stopPreview();
      }

      setCameraOn(newState);
      setLocalCameraOn(newState);
    } catch (err) {
      console.log("toggleCamera err:", err);
    }
  };

  // video call ------
  const switchCamera = () => {
    try {
      agoraEngine?.switchCamera();
    } catch (err) {
      console.log("switchCamera err:", err);
    }
  };

  return (
    <View style={styles.view_contain}>
      {videoCall && connectionData && call_type == "video" ? (
        <View style={{ flex: 1 }}>
          <>
            <TouchableOpacity
              onPress={() => setIsLocalMain(!isLocalMain)}
              activeOpacity={1}
              style={styles.fullScreenVideo}
            >
              {(!remoteCameraOn && !isLocalMain) ||
                (!localCameraOn && isLocalMain) ? (
                <View style={styles.cameraoffStyle}>
                  <Image
                    source={imagePath.videooff}
                    tintColor="white"
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <RtcSurfaceView
                  style={styles.videoFill}
                  canvas={{ uid: isLocalMain ? 0 : remoteUsers[0] }}
                  connection={{ channelId: connectionData.channel }}
                  zOrderMediaOverlay={false}
                />
              )}
            </TouchableOpacity>

            <SmallRtcView
              isLocalMain={isLocalMain}
              remoteUid={remoteUsers[0]}
              channelId={connectionData.channel}
              localCameraOn={localCameraOn}
              remoteCameraOn={remoteCameraOn}
              onToggle={() => setIsLocalMain(!isLocalMain)}
            />
          </>

          <View style={styles.overlayTop}>
            <Text style={styles.text_call_user_name}>
              {paramsObject.sender_name ??
                groupDetails?.[0]?.group_name ??
                groupDetails?.group_name}
            </Text>
            {methodCallingTimeRender("video")}
          </View>

          <View style={styles.controlPanel}>
            <Pressable
              onPress={MethodSwitchMicroPhone}
              style={styles.controlButton}
            >
              <Image
                source={openMicrophone ? imagePath.mute_off : imagePath.mute_on}
                style={styles.icon}
                resizeMode="contain"
              />
            </Pressable>
            <Pressable
              onPress={methodSpeakerphone}
              style={styles.controlButton}
            >
              <Image
                source={
                  !enableSpeakerphone
                    ? imagePath.speaker
                    : imagePath.speaker_close
                }
                style={{ height: 30, width: 30, resizeMode: "contain" }}
                resizeMode="contain"
              />
            </Pressable>

            <TouchableOpacity
              onPress={() => {
                disconnectCall();
              }}
              style={styles.endCallButton}
            >
              <Image
                source={imagePath.agoraendcall}
                style={{ height: 60, width: 60, resizeMode: "contain" }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {call_type === "video" && (
              <>
                <Pressable onPress={toggleCamera} style={styles.controlButton}>
                  {cameraOn ? (
                    <Image
                      source={imagePath.video_icon}
                      tintColor="white"
                      style={styles.icon}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      source={imagePath.videooff}
                      tintColor="white"
                      style={styles.icon}
                      resizeMode="contain"
                    />
                  )}
                </Pressable>

                <Pressable onPress={switchCamera} style={styles.controlButton}>
                  {/* <Text style={{ color: Colors.white }}>Switch</Text> */}

                  <Image
                    source={imagePath.reverse_camera}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </Pressable>
              </>
            )}
          </View>
        </View>
      ) : videoCall && connectionData && call_type == "audio" ? (
        <View style={{ flex: 1 }}>{methodAudioRender()}</View>
      ) : (
        // <Text>{'Audio'}</Text>
        <></>
      )}

      {!videoCall && initCall != true && (
        <View
          // style_gradient
          style={styles.img_background}
        >
          <View style={{ flex: 1 }}>
            <ImageLoadView
              source={
                groupDetails?.[0]?.group_image
                  ? {
                    uri: IMAGE_URL + groupDetails?.[0]?.group_image,
                  }
                  : groupDetails?.group_image
                    ? {
                      uri: IMAGE_URL + groupDetails?.group_image,
                    }
                    : imagePath.user_icon
              }
              style={styles.img_user}
            />
            <Text
              numberOfLines={2}
              style={[styles.text_name, { minWidth: 100 }]}
            >
              {groupDetails?.[0]?.group_name ?? groupDetails?.group_name}
            </Text>
          </View>
          <View
            style={[
              styles.view_row_btn,
              { display: "flex" }, // Always show buttons so user isn't stuck
            ]}
          >
            {/* Show connecting state or Answer button */}
            {isConnecting ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator
                  size="large"
                  color={Colors.primary.WHITE}
                  style={{ marginBottom: 5 }}
                />
                <Text
                  style={{
                    color: Colors.primary.WHITE,
                    fontSize: 12,
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Connecting...
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={async () => {
                  let microPermission = await checkMicroPhonePermission();
                  if (!permissionGranted) {
                    let granted = await handlePermissions();
                    setPermissionGranted(granted);
                    if (!granted) {
                      showToastMessage(
                        translateText("camera_microphone_permissions"),
                      );
                      return;
                    }
                  }
                  if (microPermission) {
                    setIsConnecting(true); // Set connecting true on manual attempt
                    ringStop();
                    callAccept();
                  }
                }}
              >
                <Image
                  style={[styles.callAction]}
                  source={imagePath.callattend}
                />
              </Pressable>
            )}

            {!isConnecting && (
              <Pressable
                onPress={() => {
                  ringStop();
                  disconnectCall();
                }}
              >
                <Image
                  style={[styles.callAction]}
                  source={imagePath.agoraendcall}
                />
              </Pressable>
            )}
          </View>
        </View>
      )}

      {!isCallAccepted && (
        <View style={styles.img_background}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={members && members.length > 0 ? members : [1]}
            numColumns={members?.length < 3 ? 1 : 2}
            renderItem={({ item, index }: any) => {
              const profilePic = item?.profile_picture
                ? { uri: IMAGE_URL + item?.profile_picture }
                : item?.group_image
                  ? { uri: IMAGE_URL + item?.group_image }
                  : groupDetails?.group_image
                    ? { uri: IMAGE_URL + groupDetails?.group_image }
                    : imagePath.user_icon;

              const displayName =
                item?.name ||
                item?.group_name ||
                groupDetails?.group_name ||
                "Unknown";

              return (
                <View style={{ flex: 1 }}>
                  <ImageLoadView
                    source={profilePic}
                    style={styles.img_user}
                  />
                  <Text style={styles.text_name}>{displayName}</Text>
                  <View style={styles.view_calling_text}>
                    <Text style={styles.text_calling}>
                      {translateText("calling")}
                    </Text>
                    <Flow
                      style={styles.view_flow}
                      color={Colors.primary.BLACK}
                      size={30}
                    />
                  </View>
                </View>
              );
            }}
            keyExtractor={(item, index) => item + index.toString()}
          />

          <View style={styles.view_row_btn}>
            <Pressable
              onPress={() => {
                ringStop();
                disconnectCall();
              }}
            >
              <Image
                style={[styles.callAction]}
                source={imagePath.agoraendcall}
              />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default VideoCalling;
