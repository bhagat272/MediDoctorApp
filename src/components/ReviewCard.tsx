import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import imagePath from "../theme/imagePath";
import { ImageLoadView } from "../components";
import { Colors } from "../theme";
import fonts from "../theme/fonts";

interface Props {
  item: any;
  onPress?: (item: any) => void;
}

const ReviewCard = ({ item, onPress }: Props) => {
  const rating = Number(item?.rating || 0);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress?.(item)}
      style={styles.card}
    >
      {/* USER INFO */}
      <View style={styles.row}>
        <ImageLoadView
          source={
            item?.getuser?.profile_picture
              ? { uri: item.getuser.profile_picture }
              : imagePath.user_icon
          }
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>
            {item?.getuser?.name || "Anonymous"}
          </Text>
          <Text style={styles.date}>{item?.date}</Text>
        </View>

        {/* RATING FROM REVIEW OBJECT */}
        <View style={styles.ratingRow}>
          <Image source={imagePath.star_filled} style={styles.star} />
          <Text style={styles.rating}>{rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* REVIEW TEXT */}
      <Text style={styles.review}>{item?.review}</Text>

      {/* DOCTOR REPLY */}
      {/* {item?.reply ? (
        <View style={styles.replyBox}>
          <Text style={styles.replyLabel}>Your Reply</Text>
          <Text style={styles.reply}>{item.reply}</Text>
        </View>
      ) : null} */}
    </TouchableOpacity>
  );
};
export default ReviewCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary.WHITE,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    marginHorizontal: 14,
    shadowColor: Colors.primary.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: Colors.secondary.OFF,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    height: 42,
    width: 42,
    borderRadius: 21,
    marginRight: 10,
  },

  userName: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.BLACK,
  },

  date: {
    fontSize: fonts.SIZE_11,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.secondary.MONSOON,
    marginTop: 2,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    height: 14,
    width: 14,
    resizeMode: "contain",
    marginRight: 4,
  },

  rating: {
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.BLACK,
  },

  review: {
    marginTop: 10,
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Poppins_Regular,
    lineHeight: 18,
    color: Colors.secondary.DUNE,
  },

  replyBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.secondary.MINT_CREAM,
    borderRadius: 8,
  },

  replyLabel: {
    fontSize: fonts.SIZE_12,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.BLACK,
  },

  reply: {
    marginTop: 4,
    fontSize: fonts.SIZE_12,
    fontFamily: fonts.Poppins_Regular,
    lineHeight: 16,
    color: Colors.secondary.STORM_DUST,
  },
});
