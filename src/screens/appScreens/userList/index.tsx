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
import { getUserListAction } from "../../../redux/actions/appSessionAction";
import { loading as Loader } from "../../../redux/reducer/loadingReducer";
let searchTimer: any = null;
const UserList = (props: any) => {
  const appState = useRef(AppState.currentState);

  const dispatch = useDispatch();
  const [userList, setUserList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    dispatch(Loader(true));
    getUserList(1, "").finally(() => dispatch(Loader(false)));
  }, []);

  const getUserList = async (
    pageNumber = 1,
    keyword = "",
    isRefresh = false,
  ) => {
    if (loading || pageNumber > lastPage) return;

    setLoading(true);

    try {
      const res = await dispatch(
        getUserListAction({
          page: pageNumber,
          keyword,
        }),
      );

      if (res?.data?.data) {
        const apiData = res.data;

        setUserList((prev) =>
          pageNumber === 1 || isRefresh
            ? apiData.data
            : [...prev, ...apiData.data],
        );

        setPage(apiData.current_page);
        setLastPage(apiData.last_page);
      }
    } catch (e) {
      console.log("User list error", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const renderChat = ({ item }: { item: Record<string, any> }): JSX.Element => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log("UserMedicationListScreen id ", item?.id);
          props?.navigation?.navigate("UserMedicationListScreen", {
            user_id: item?.id,
          });
        }}
        activeOpacity={0.8}
        style={styles.renderView}
      >
        <ImageLoadView
          source={
            item?.profile_picture
              ? { uri: item?.profile_picture }
              : imagePath.user_icon
          }
          resizeMode="cover"
          style={styles.listImg}
        />

        <View style={styles.nameview}>
          <Text style={styles.nameText}>{item?.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const methodSearch = (text: string): void => {
    if (searchText === "" && text === " ") {
      return;
    }

    setSearchText(text);

    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    if (text.length >= 3 || !text) {
      searchTimer = setTimeout(() => {
        getUserList(1, text, true);
      }, 800);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    getUserList(1, searchText, true);
  };

  const loadMore = () => {
    if (!loading && page < lastPage) {
      getUserList(page + 1, searchText);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={translateText("all_users")}
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props.navigation.goBack()}
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
            getUserList(1, "", true);
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
        data={userList}
        renderItem={renderChat}
        keyExtractor={(item, index) => index.toString()}
        style={{ flex: 1, marginHorizontal: 20 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary.APP_THEME]} // Android spinner color
            tintColor={Colors.primary.APP_THEME} // iOS spinner color
          />
        }
        ListEmptyComponent={() =>
          !loading && (
            <View style={styles.view_empty}>
              <Text style={styles.emptyText}>No Users found</Text>
            </View>
          )
        }
        ListFooterComponent={
          loading && page > 1 ? (
            <Text style={{ textAlign: "center", marginVertical: 10 }}>
              Loading...
            </Text>
          ) : null
        }
      />
       
    </View>
  );
};

export default UserList;
