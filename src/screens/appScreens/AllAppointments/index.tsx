import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import styles from "./styles";
import { Colors, Fonts } from "../../../theme";
import imagePath from "../../../theme/imagePath";
import { Header, ImageLoadView } from "../../../components";
import { translateText } from "../../../utils/language";
import { useDispatch } from "react-redux";
import { allAppointmentsByDateAction } from "../../../redux/actions/appSessionAction";
import { loading as Loader } from "../../../redux/reducer/loadingReducer";
const AllAppointments = (props: any) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [dateLoading, setDateLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD"),
  );
  const [appointments, setAppointments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments(1, selectedDate, true);
    dispatch(Loader(true));
  }, []);

  const fetchAppointments = (
    pageNumber: number,
    date: string,
    reset = false,
    fromDateChange = false,
  ) => {
    if (fromDateChange) {
      setDateLoading(true);
    } else if (!reset) {
      setLoading(true);
    }

    dispatch(allAppointmentsByDateAction({ date, page: pageNumber }))
      .then((res: any) => {
        dispatch(Loader(false));
        setPage(res.current_page);
        setLastPage(res.last_page);

        setAppointments((prev) => (reset ? res.data : [...prev, ...res.data]));
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
        setDateLoading(false);
      });
  };

  const onDateSelect = (day: any) => {
    if (day.dateString === selectedDate) return;

    setSelectedDate(day.dateString);
    fetchAppointments(1, day.dateString, true, true);
  };

  const loadMore = () => {
    if (page < lastPage && !loading && !refreshing) {
      fetchAppointments(page + 1, selectedDate);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments(1, selectedDate, true);
  };

  const renderItem = ({ item }: any) => {
    const user = item.getuser;

    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => {
          console.log(item);
          props.navigation.navigate("ConsultationDetails", {
            appointmentId: item?.id,
            appointmentData: user,
            // history: tab || "history",
          });
        }}
      >
        <ImageLoadView
          source={
            user?.profile_picture
              ? {
                  uri: user?.profile_picture,
                }
              : imagePath.user_icon
          }
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {user?.name} {user?.last_name}
          </Text>

          <View style={styles.row}>
            <Image source={imagePath.gps_icon} style={styles.icon} />
            <Text style={styles.sub} numberOfLines={1}>
              {user?.street_address}
            </Text>
          </View>

          <View style={styles.row}>
            <Image source={imagePath.calendar_small_icon} style={styles.icon} />
            <Text style={styles.sub}>
              {moment(item.appointment_time).format(
                "MMM DD, YYYY [at] hh:mm A",
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safe}>
      <Header
        title={translateText("all_appointments")}
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />

      <View style={styles.card}>
        <Calendar
          current={selectedDate}
          onDayPress={onDateSelect}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: Colors.primary.APP_THEME,
            },
          }}
          renderArrow={(direction) => (
            <Text style={styles.arrow}>{direction === "left" ? "‹" : "›"}</Text>
          )}
          theme={{
            textMonthFontFamily: Fonts.Poppins_SemiBold,
            textDayFontFamily: Fonts.Poppins_Regular,
            textDayHeaderFontFamily: Fonts.Poppins_Medium,
            todayTextColor: Colors.primary.APP_THEME,
            arrowColor: Colors.primary.BLACK,
          }}
        />
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        // refreshing={refreshing}
        // onRefresh={onRefresh}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary.APP_THEME]}
            tintColor={Colors.primary.APP_THEME}
          />
        }
        ListFooterComponent={
          (loading || dateLoading) && !refreshing ? (
            <ActivityIndicator
              style={{ marginVertical: 20 }}
              color={Colors.primary.APP_THEME}
            />
          ) : null
        }
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={styles.empty_view}>
              <Text style={styles.empty_text}>
                {translateText("no_appointments_found")}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default AllAppointments;
