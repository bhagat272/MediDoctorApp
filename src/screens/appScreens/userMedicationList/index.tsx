import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useDispatch } from "react-redux";
import { FullScreenImage, Header, ImageLoadView } from "../../../components";
import imagePath from "../../../theme/imagePath";
import { loading as Loader } from "../../../redux/reducer/loadingReducer";
import { fetchUserMedicationDetailAction } from "../../../redux/actions/appSessionAction";
import styles from "./styles";
import { Colors } from "../../../theme";
import { translateText } from "../../../utils/language";

const WEEK_DAYS = [
  { key: "Sun", label: "S" },
  { key: "Mon", label: "M" },
  { key: "Tue", label: "T" },
  { key: "Wed", label: "W" },
  { key: "Thu", label: "T" },
  { key: "Fri", label: "F" },
  { key: "Sat", label: "S" },
];

const UserMedicationListScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const userId = route?.params?.user_id;
  const [showImage, setShowImage] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  useEffect(() => {
    dispatch(Loader(true));
    loadMedications(1).finally(() => dispatch(Loader(false)));
  }, []);

  console.log("user id in medication list====>", userId);

  const loadMedications = async (pageNo: number) => {
    if (loading || pageNo > lastPage) return;

    setLoading(true);

    try {
      const res: any = await dispatch(
        fetchUserMedicationDetailAction({
          user_id: userId,
          page: pageNo,
        }),
      );

      const responseData = res?.data?.data ?? [];

      setList((prev) =>
        pageNo === 1 ? responseData : [...prev, ...responseData],
      );

      setPage(res?.data?.current_page ?? pageNo);
      setLastPage(res?.data?.last_page ?? 1);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setPage(1);
    loadMedications(1);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  const formatTime = (time: string) =>
    new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const Field = ({ label, value }: any) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );

  const renderItem = ({ item }: any) => {
    const activeDays = item?.days
      ? item.days.split(",").map((d: string) => d.trim())
      : [];

    return (
      <View style={styles.card}>
        <Field label="Medication For" value={item?.get_user_details?.name} />
        <Field label="Medicine Name" value={item?.name} />
        <Field label="Salt Name" value={item?.salt_name} />
        <Field label="Start Date" value={formatDate(item?.start_date)} />
        <Field label="End Date" value={formatDate(item?.end_date)} />
        <Field label="Time" value={formatTime(item?.time)} />
        <Field label="Tags" value={item?.tags} />
        {item?.image && (
          <TouchableOpacity
            onPress={() => {
              setShowImage(true);
              setSelectedImage(item?.image);
            }}
          >
            <View style={styles.row}>
              <ImageLoadView
                source={
                  item?.image
                    ? {
                        uri: item?.image,
                      }
                    : imagePath.user_icon
                }
                resizeMode="cover"
                style={styles.report_image}
              />
            </View>
            <View style={styles.divider} />
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Week Days</Text>
        <View style={styles.weekRow}>
          {WEEK_DAYS.map((day) => {
            const isActive = activeDays.includes(day.key);
            return (
              <View
                key={day.key}
                style={[styles.dayCircle, isActive && styles.activeDay]}
              >
                <Text
                  style={[styles.dayText, isActive && styles.activeDayText]}
                >
                  {day.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Medications"
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => navigation.goBack()}
      />

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onEndReached={() => loadMedications(page + 1)}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[Colors.primary.APP_THEME]}
            tintColor={Colors.primary.APP_THEME}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>No medication found</Text>
          ) : null
        }
        ListFooterComponent={
          loading && list.length > 0 ? (
            <Text style={styles.empty}>Loading...</Text>
          ) : null
        }
      />
      <Modal
        visible={showImage}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImage(false)}
      >
        <TouchableOpacity
          style={styles.image_viewer}
          onPress={() => setShowImage(false)}
        >
          <Image source={imagePath.cancel} style={styles.cross_icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fullscreenContainer}
          activeOpacity={1}
          onPress={() => setShowImage(false)}
        >
          <FullScreenImage
            uri={selectedImage}
            imageStyle={styles.fullscreenImage}
            loaderSize="large"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default UserMedicationListScreen;
