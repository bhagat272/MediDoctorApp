import React, { JSX, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter,
  AppState,
  Image,
  RefreshControl,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import moment from "moment";

import styles from "./styles";
import imagePath from "../../../theme/imagePath";
import Colors from "../../../theme/colors";
import {
  socketConnectionCheck,
  socketEmit,
  socketEvent,
} from "../../../utils/socket";
import { IMAGE_URL } from "../../../redux/apis/commonValue";
import ImageLoadView from "../../../components/imageLoadView";
import { AppHeader, Header } from "../../../components";
import { translateText } from "../../../utils/language";
import { useDispatch } from "react-redux";
import { loading } from "../../../redux/reducer/loadingReducer";

let searchTimer: any = null;
const ChatList = (props: any) => {
  const isFocused = useIsFocused();
  const [chatList, setChatList] = useState([]);
  const appState = useRef(AppState.currentState);
  const [searchText, setSearchText] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loading(true));
  }, []);

  useEffect(() => {
    const appStateManage = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active" &&
          isFocused &&
          global?.userData
        ) {
          socketConnectionCheck();
          methodGetConversationList();
        }
        appState.current = nextAppState;
      },
    );
    return () => {
      appStateManage.remove();
    };
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && global?.userData) {
      methodGetConversationList();
      const receiveMsgListener = DeviceEventEmitter.addListener(
        "receive_message",
        (res: any) => {
          if (res) {
            methodGetConversationList();
          }
        },
      );
      return () => {
        receiveMsgListener.remove();
      };
    }
  }, [isFocused]);

  const methodGetConversationList = (search?: string): void => {
    const dic: { user_id: string | number; search?: string } = {
      user_id: global?.userData?.id,
    };
    if (search) {
      dic.search = search;
    }
    socketEmit(socketEvent.getConversationList, dic, (res: any) => {
      console.log("getConversationList---->", res);
      dispatch(loading(false));
      if (res?.data && Array.isArray(res.data)) {
        setChatList(res.data);
      }
    });
  };

  const renderChat = ({ item }: { item: Record<string, any> }): JSX.Element => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            const dic = { ...item };
            if (item?.type == "SINGLE") {
              dic.conversation_id = item.id;
              delete dic.id;
              props.navigation.navigate("ChatScreen", {
                other_user_id: item.other_user_id,
                userData: dic,
              });
            } else {
              dic.conversation_id = item.id;
              delete dic.id;
              props.navigation.navigate("GroupChatScreen", {
                other_user_id: item.other_user_id,
                userData: dic,
              });
            }
          }}
          activeOpacity={0.8}
          style={styles.renderView}
        >
          <View style={styles.imageWrapper}>
            <ImageLoadView
              source={
                item.other_user_image
                  ? { uri: item?.other_user_image }
                  : imagePath.user_icon
              }
              resizeMode="cover"
              style={styles.listImg}
            />

            {item?.is_online === 1 && <View style={styles.onlineBadge} />}
          </View>

          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.nameText}>{item.other_user_name}</Text>
            <Text
              numberOfLines={2}
              style={{
                ...styles.chatText,
                color:
                  item?.message_type === "TEXT"
                    ? Colors.primary.BLACK
                    : Colors.primary.APP_THEME,
              }}
            >
              {item?.message_type === "TEXT"
                ? item.message
                : item?.message_type}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.timeText}>
              {moment.utc(item.updated_at).local().fromNow()}
            </Text>
            {item.message_unread_count !== 0 && (
              <View style={styles.chatCountView}>
                <Text style={styles.chatCountText}>
                  +{item.message_unread_count}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const methodSearch = (text: string): void => {
    setSearchText(text);
    if (text === "" && searchText === " ") {
      return;
    }
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    searchTimer = setTimeout(() => {
      methodGetConversationList(text);
    }, 1000);
  };

  const onRefresh = () => {
    if (!global?.userData) return;

    setRefreshing(true);
    methodGetConversationList();
    setTimeout(() => {
      setRefreshing(false);
    }, 800); // small delay for UX
  };

  return (
    <View style={styles.container}>
      <Header
        title={translateText("patient_list")}
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />
      <View style={styles.inputView}>
        <TouchableOpacity>
          <Image
            source={imagePath.search_icon}
            resizeMode="contain"
            style={styles.search_icon}
          />
        </TouchableOpacity>
        <TextInput
          value={searchText}
          placeholder={"Search"}
          placeholderTextColor={Colors.secondary.MONSOON}
          style={styles.textInput}
          returnKeyType="search"
          onChangeText={methodSearch}
        />
        <TouchableOpacity
          style={{ display: searchText ? "flex" : "none" }}
          onPress={() => {
            setSearchText("");
            methodGetConversationList();
          }}
        >
          <Image
            source={imagePath.cancel}
            resizeMode="contain"
            style={styles.cancelIcon}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={chatList}
        renderItem={renderChat}
        keyExtractor={(item, index) => index.toString()}
        style={{
          flex: 1,
          marginHorizontal: 20,
        }}
        ListEmptyComponent={
          <View style={styles.view_empty}>
            <Text style={styles.emptyText}>
              {translateText("no_chats_found")}
            </Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary.APP_THEME} // iOS
            colors={[Colors.primary.APP_THEME]} // Android
          />
        }
      />
    </View>
  );
};

export default ChatList;
