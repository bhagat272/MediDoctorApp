import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ImageLoadView } from "../../../components";
import {
  pastAppointmentAction,
  profileAction,
  upcomingAppointmentAction,
} from "../../../redux/actions/userSessionAction";
import { Colors } from "../../../theme";
import imagePath from "../../../theme/imagePath";
import styles from "./styles";
import { loading as Loader } from "../../../redux/reducer/loadingReducer";
import { setInitialTab } from "../../../redux/reducer/tabReducer";
import { translateText } from "../../../utils/language";
const Appointments = (props: any) => {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const dispatch = useDispatch();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [pastAppointments, setPastAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(true);
  const [hasMorePast, setHasMorePast] = useState(true);
  const initialTab = useSelector((state: any) => state.tabReducer.initialTab);

  useFocusEffect(
    useCallback(() => {
      dispatch(profileAction());
    }, []),
  );

  useEffect(() => {
    if (initialTab === "Appointment") {
      setTab("upcoming");
      setUpcomingPage(1);
      setHasMoreUpcoming(true);
      // Refetch upcoming appointments
      loadUpcomingAppointments(1, true).finally(() => {
        dispatch(setInitialTab(null));
      });
    }
  }, [initialTab]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);

    dispatch(Loader(true));
    await Promise.all([
      loadUpcomingAppointments(1, true),
      loadPastAppointments(1, true),
    ]);
    setLoading(false);
    dispatch(Loader(false));
  };

  const loadUpcomingAppointments = async (
    page: number,
    reset: boolean = false,
  ) => {
    try {
      const response = await dispatch(upcomingAppointmentAction({ page }));
      if (response?.status && response?.data?.data) {
        const newData = response.data.data;
        setUpcomingAppointments((prev) =>
          reset ? newData : [...prev, ...newData],
        );
        setHasMoreUpcoming(
          response.data.current_page < response.data.last_page,
        );
        setUpcomingPage(page);
      }
    } catch (error) {
      console.error("Error loading upcoming appointments:", error);
    }
  };

  const loadPastAppointments = async (page: number, reset: boolean = false) => {
    try {
      const response = await dispatch(pastAppointmentAction({ page }));
      if (response?.status && response?.data?.data) {
        const newData = response.data.data;
        setPastAppointments((prev) =>
          reset ? newData : [...prev, ...newData],
        );
        setHasMorePast(response.data.current_page < response.data.last_page);
        setPastPage(page);
      }
    } catch (error) {
      console.error("Error loading past appointments:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (tab === "upcoming") {
      await loadUpcomingAppointments(1, true);
    } else {
      await loadPastAppointments(1, true);
    }
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (loading || refreshing) return;

    if (tab === "upcoming" && hasMoreUpcoming) {
      loadUpcomingAppointments(upcomingPage + 1);
    } else if (tab === "past" && hasMorePast) {
      loadPastAppointments(pastPage + 1);
    }
  };

  const renderItem = ({ item }: any) => {
    const user = item.getuser;
    const userName = `${user?.name || ""} ${user?.last_name || ""}`.trim();
    const userImage = user?.profile_picture || user?.thumb_image;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          props.navigation.navigate("ConsultationDetails", {
            appointmentId: item.id,
            appointmentData: item,
            history: tab,
          });
        }}
      >
        <ImageLoadView
          source={
            userImage && userImage.includes("http")
              ? { uri: userImage }
              : imagePath.user_icon
          }
          style={styles.avatar}
          resizeMode="cover"
        />

        <View style={styles.cardContent}>
          <Text style={styles.name} numberOfLines={1}>
            {userName || "Unknown User"}
          </Text>

          {user?.street_address ? (
            <View style={styles.row}>
              <Image source={imagePath.gps_icon} style={styles.icon} />
              <Text style={styles.subText} numberOfLines={1}>
                {user.street_address}
              </Text>
            </View>
          ) : null}

          <View style={styles.row}>
            <Image source={imagePath.calendar_small_icon} style={styles.icon} />
            <Text style={styles.subText}>
              {item?.appointment_time || "N/A"}
            </Text>
          </View>
          {/*  furhter implement if  needed
          {item.amount && (
            <View style={styles.row}>
              <Image source={imagePath.dollar_sign} style={styles.icon} />
              <Text style={styles.amountText}>
                ${parseFloat(item.amount).toFixed(2)}{" "}
                {item.currency?.toUpperCase()}
              </Text>
            </View>
          )}

          {item.description && (
            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.description}
            </Text>
          )} */}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {/* <Image
        source={imagePath.cross_icon}
        style={styles.emptyImage}
        resizeMode="contain"
      /> */}
      <Text style={styles.emptyTitle}>No {tab} appointments</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.secondary.OFF_GREEN} />
      </View>
    );
  };

  const currentData =
    tab === "upcoming" ? upcomingAppointments : pastAppointments;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header_title_text}>
          {translateText("appointments")}
        </Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate("AllAppointments")}
        >
          <Image
            source={imagePath.calendar_header_icon}
            style={styles.calenndar_icon}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === "upcoming" && styles.activeTab]}
          onPress={() => setTab("upcoming")}
        >
          <Text
            style={[styles.tabText, tab === "upcoming" && styles.activeTabText]}
          >
            Upcoming
          </Text>
          {/* {upcomingAppointments.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {upcomingAppointments.length}
              </Text>
            </View>
          )} */}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === "past" && styles.activeTab]}
          onPress={() => setTab("past")}
        >
          <Text
            style={[styles.tabText, tab === "past" && styles.activeTabText]}
          >
            Past
          </Text>
          {/* {pastAppointments.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pastAppointments.length}</Text>
            </View>
          )} */}
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading && currentData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.secondary.OFF_GREEN} />
          <Text style={styles.loadingText}>
            {translateText("loading_appointments")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Appointments;
