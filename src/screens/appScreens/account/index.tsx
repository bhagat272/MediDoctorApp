import React, { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ImageLoadView, ReviewCard } from "../../../components";
import { reviewListAction } from "../../../redux/actions/appSessionAction";
import { Colors } from "../../../theme";
import imagePath from "../../../theme/imagePath";
import { translateText } from "../../../utils/language";
import styles from "./styles";
import { handlePush } from "../../../navigation/navigationService";
import { profileAction } from "../../../redux/actions/userSessionAction";

const Account = (props: any) => {
  const [tab, setTab] = useState<"about" | "reviews">("about");
  const { userData } = useSelector((state: any) => state?.session);
  const [reviews, setReviews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReview, setTotalReview] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const aboutData = [
    ["Name", userData?.name || "—"],
    ["Email", userData?.email || "—"],
    ["Fee", userData?.fee ? `$${userData.fee}` : "—"],
    ["Clinic Name", userData?.clinic_name || "—"],
    ["Address", userData?.clinic_address || "—"],
    [
      "Speciality",
      userData?.speciality?.[0]?.title || userData?.speciality || "—",
    ],
  ];

  useEffect(() => {
    getReviews(1);
  }, []);
  useEffect(() => {
    console.log("🟢 userData changed", userData?.unreadNotification);
  }, [userData]);
  const getReviews = async (pageNumber = 1) => {
    if (loading || pageNumber > lastPage) return;

    setLoading(true);

    try {
      const result = await dispatch(reviewListAction({ page: pageNumber }));

      if (result?.data?.data) {
        setReviews((prev) =>
          pageNumber === 1 ? result.data.data : [...prev, ...result.data.data],
        );

        setAvgRating(result.rating);
        setTotalReview(result.totalReview);
        setPage(result.data.current_page);
        setLastPage(result.data.last_page);
      }
    } catch (error) {
      console.log("Review API Error", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreReviews = () => {
    if (page < lastPage && !loading) {
      getReviews(page + 1);
    }
  };

  const onRefresh = async () => {
    if (loading) return;

    setRefreshing(true);
    setLastPage(1);
    setPage(1);

    try {
      await getReviews(1);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "notification_received",
      () => {
        dispatch(profileAction());
      },
    );

    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => {
            handlePush({
              name: "NotificationList",
            });
          }}
        >
          <Image source={imagePath.notify_icon} style={styles.bell_Icon} />
          {Number(userData?.unreadNotification) > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {userData.unreadNotification}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("ProfileScreen");
          }}
          style={styles.iconCircle}
        >
          <Image source={imagePath.settings_icon} style={styles.bell_Icon} />
        </TouchableOpacity>
      </View>

      {/* PROFILE IMAGE */}
      <View style={styles.profileWrapper}>
        <ImageLoadView
          source={
            userData?.profile_picture
              ? { uri: userData.profile_picture }
              : imagePath.user_icon
          }
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => {
            props.navigation.navigate("EditProfile");
          }}
        >
          <Image source={imagePath.edit_icon} style={styles.edit_Icon} />
        </TouchableOpacity>
      </View>

      {/* INFO */}
      <Text style={styles.name}>
        {userData?.name ? `Dr. ${userData.name}` : "—"}
      </Text>

      <Text style={styles.sub}>
        {userData?.speciality?.[0]?.title || userData?.speciality || "—"}
      </Text>
      <Text style={styles.sub_second}>{userData?.clinic_name || "—"}</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === "about" && styles.activeTab]}
          onPress={() => setTab("about")}
        >
          <Text
            style={tab === "about" ? styles.activeText : styles.inactiveText}
          >
            About
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === "reviews" && styles.activeTab]}
          onPress={() => setTab("reviews")}
        >
          <Text
            style={tab === "reviews" ? styles.activeText : styles.inactiveText}
          >
            Reviews
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tab === "reviews" ? reviews : aboutData}
        keyExtractor={(item, index) =>
          tab === "reviews" ? item.id.toString() : index.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={tab === "reviews" ? loadMoreReviews : undefined}
        onEndReachedThreshold={0.4}
        refreshControl={
          tab === "reviews" ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary.APP_THEME]}
              tintColor={Colors.primary.APP_THEME}
            />
          ) : undefined
        }
        renderItem={({ item }) => {
          // ABOUT TAB
          if (tab === "about") {
            const [label, value] = item;

            return (
              <View key={label} style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text
                  style={styles.value}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {value.length > 25 ? value?.substring(0, 14) + "..." : value}
                </Text>
              </View>
            );
          }

          // REVIEWS TAB
          return (
            <ReviewCard
              onPress={() => {
                props?.navigation.navigate("ReviewDetails", {
                  reviewId: item?.id,
                });
                console.log("Review item pressed:", item?.id);
              }}
              item={item}
            />
          );
        }}
        ListHeaderComponent={
          tab === "reviews" ? (
            <View style={styles.reviewBox}>
              <Text style={styles.reviewTitle}>
                {translateText("patient_review")}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Image source={imagePath.star_filled} style={styles.star} />
                <Text style={styles.reviewText_first}>
                  {avgRating.toFixed(1)}
                </Text>
                <Text style={styles.reviewText}>({totalReview} Reviews)</Text>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          tab === "reviews" && !loading ? (
            <Text style={styles.emptyText}>
              {translateText("no_reviews_found")}
            </Text>
          ) : null
        }
        ListFooterComponent={
          tab === "reviews" && loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : null
        }
      />
    </View>
  );
};

export default Account;
