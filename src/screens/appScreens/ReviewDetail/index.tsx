import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";

import imagePath from "../../../theme/imagePath";
import { ImageLoadView, Header } from "../../../components";
import { Colors } from "../../../theme";
import styles from "./styles";
import {
  fetchReviewByIdAction,
  replyReviewAction,
} from "../../../redux/actions/appSessionAction";
import { translateText } from "../../../utils/language";

const ReviewDetailScreen = (props: any) => {
  const reviewId = props.route.params?.reviewId;
  const dispatch = useDispatch();
  const [review, setReview] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(reviewId);
    if (!reviewId) return;

    dispatch(
      fetchReviewByIdAction({
        feedback_id: reviewId,
      }),
    ).then((response: any) => {
      const data = response?.data;
      if (data) {
        setReview(data);
        setReplyText(data.reply || "");
      }
    });
  }, [reviewId]);

  const onSubmitReply = async () => {
    if (!replyText.trim()) return;

    try {
      setLoading(true);

      await dispatch(
        replyReviewAction({
          feedback_id: reviewId,
          reply: replyText,
        }),
      ).then((response: any) => {
        const data = response?.data;
        if (data) {
          setReview((prevReview: any) => ({
            ...prevReview,
            reply: replyText,
          }));
        }
      });
    } catch (e) {
      console.log("Reply Error", e);
    } finally {
      setLoading(false);
    }
  };

  if (!review) {
    return (
      <View style={styles.container}>
        <Header
          title="Review Details"
          leftIcon={imagePath.goBackImgpng}
          onPressLeft={() => props.navigation.goBack()}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  const user = review.getuser;
  const rating = Number(review.rating || 0);

  return (
    <View style={styles.container}>
      <Header
        title="Review Details"
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props.navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* USER INFO */}
        <View style={styles.userCard}>
          <ImageLoadView
            source={
              user?.profile_picture
                ? { uri: user.profile_picture }
                : imagePath.user_icon
            }
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.name || "Anonymous"}</Text>
            <Text style={styles.date}>{review.date}</Text>
          </View>

          <View style={styles.ratingRow}>
            <Image source={imagePath.star_filled} style={styles.star} />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* REVIEW */}
        <View style={styles.reviewCard}>
          <Text style={styles.sectionTitle}>
            {translateText("patient_review")}
          </Text>
          <Text style={styles.reviewText}>{review.review}</Text>
        </View>

        {/* REPLY */}
        {review.reply ? (
          <View style={styles.replyCard}>
            <Text style={styles.sectionTitle}>
              {translateText("your_reply")}
            </Text>
            <Text style={styles.replyText}>{review.reply}</Text>
          </View>
        ) : (
          <></>
          // <View style={styles.replyInputCard}>
          //   <Text style={styles.sectionTitle}>
          //     {translateText("reply_to_review")}
          //   </Text>

          //   <TextInput
          //     value={replyText}
          //     onChangeText={setReplyText}
          //     placeholder={translateText("write_your_reply_here...")}
          //     placeholderTextColor={Colors.secondary.MONSOON}
          //     multiline
          //     style={styles.textArea}
          //   />

          //   <TouchableOpacity
          //     activeOpacity={0.8}
          //     onPress={onSubmitReply}
          //     disabled={!replyText.trim() || loading}
          //     style={[
          //       styles.submitBtn,
          //       (!replyText.trim() || loading) && { opacity: 0.6 },
          //     ]}
          //   >
          //     <Text style={styles.submitText}>
          //       {loading ? "Submitting..." : "Submit Reply"}
          //     </Text>
          //   </TouchableOpacity>
          // </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ReviewDetailScreen;
