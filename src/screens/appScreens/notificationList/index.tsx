import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { CustomAlert, Header, ImageLoadView } from "../../../components";
import {
  deleteNotificationListAction,
  notificationListAction,
} from "../../../redux/actions/appSessionAction";
import { loading as Loader } from "../../../redux/reducer/loadingReducer";
import { ImagePath } from "../../../theme";
import { translateText } from "../../../utils/language";
import styles from "./styles";
import { CommonActions } from "@react-navigation/native";
import imagePath from "../../../theme/imagePath";
import { setInitialTab } from "../../../redux/reducer/tabReducer";
import { profileAction } from "../../../redux/actions/userSessionAction";
import moment from "moment";

const NotificationItem = ({ item, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item)}>
      <ImageLoadView
        source={
          item.sender?.profile_picture
            ? { uri: item.sender.profile_picture }
            : ImagePath.user_icon
        }
        style={styles.avatar}
      />

      <View style={styles.content}>
        <Text style={styles.message}>
          {/* <Text style={styles.name}>{item.sender?.name} </Text> */}
          {item.message}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.time}>{item.time}</Text>
          {!item.is_read && <View style={styles.dot} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NotificationsScreen = (props: any) => {
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    fetchNotifications(1);
    return () => {
      dispatch(profileAction());
    };
  }, []);

  const fetchNotifications = async (pageNo: number, refresh = false) => {
    if (loading || (!hasMore && !refresh)) return;

    try {
      if (pageNo === 1 && !refresh && initialLoading) {
        dispatch(Loader(true));
      }

      setLoading(true);

      const response: any = await dispatch(
        notificationListAction({ page: pageNo }),
      );

      const pagination = response?.data;
      const apiData = pagination?.data ?? [];

      const mappedData = apiData.map((item: any) => ({
        ...item,
        time: formatTimeAgo(item.created_at),
      }));

      setNotifications((prev) =>
        pageNo === 1 ? mappedData : [...prev, ...mappedData],
      );

      setHasMore(!!pagination?.next_page_url);
      setPage(pagination?.current_page);
    } catch (e) {
      console.log("Notification error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setInitialLoading(false);
      dispatch(Loader(false));
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    fetchNotifications(1, true);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const handleNotificationPress = async (item: any) => {
    let initialTab: string | null = null;
    switch (item.type) {
      case "Appointment":
        props.navigation.dispatch(CommonActions.goBack());
        initialTab = "Appointment";
        setTimeout(() => {
          dispatch(setInitialTab(initialTab));
          props.navigation.navigate("BottomTab", {
            screen: "Appointments",
          });
        }, 100);

        break;
      case "MedicationShared":
        props.navigation.navigate("UserMedicationListScreen", {
          user_id: item.notify_id,
        });
        break;

      case "APPOINTMENT_REMINDER":
        props.navigation.navigate("ConsultationDetails", {
          appointmentId: item.notify_id,
        });
        break;
      case "ReviewAdded":
        props.navigation.navigate("ReviewDetails", {
          reviewId: item.notify_id,
        });
        break;
      case "Chat":
        props.navigation.navigate("ChatScreen", {
          userId: item.other_user_id,
        });
        break;

      case "PaymentReceived":
        props.navigation.navigate("TransactionList");
        break;

      default:
        break;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    // const timeStr = date.toLocaleTimeString(undefined, options);
    const timeStr = moment
      .utc(dateString, "YYYY-MM-DD HH:mm:ss")
      .local()
      .format("hh:mm A");

    // Normalize both dates to midnight for comparison
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const todayOnly = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const diffTime = todayOnly.getTime() - dateOnly.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
      return `Today at ${timeStr}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${timeStr}`;
    } else {
      const datePart = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      return `${datePart} at ${timeStr}`;
    }
  };

  const deleteALL = async () => {
    try {
      await dispatch(deleteNotificationListAction({})).then((res: any) => {
        setNotifications([]);
        dispatch(profileAction());
        setHasMore(false);
        setPage(1);
      });
    } catch (e) {
      console.log("Notification error:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={translateText("Notifications")}
        leftIcon={ImagePath.goBackImgpng}
        onPressLeft={() => props.navigation.goBack()}
        rightIcon={
          notifications.length !== 0 ? imagePath.trash_icon : undefined
        }
        onPressRight={() => setShowDeleteAlert(true)}
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handleNotificationPress} />
        )}
        contentContainerStyle={[
          styles.list,
          notifications.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.7}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          loading && !refreshing && !initialLoading ? (
            <ActivityIndicator style={{ marginVertical: 20 }} />
          ) : null
        }
        ListEmptyComponent={() =>
          !loading && (
            <View style={styles.view_empty}>
              <Text style={styles.emptyText}>
                {translateText("no_notifications_found")}
              </Text>
            </View>
          )
        }
      />
      <CustomAlert
        visible={showDeleteAlert}
        message={translateText("are_you_sure_you_want_to_notification")}
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={() => setShowDeleteAlert(false)}
        onConfirm={() => {
          setShowDeleteAlert(false);
          deleteALL();
        }}
      />
    </View>
  );
};

export default NotificationsScreen;
