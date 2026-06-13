import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "../../../theme/colors";
import fonts from "../../../theme/fonts";
import moment from "moment";
import ImageLoadView from "../../../components/imageLoadView";
import { IMAGE_URL } from "../../../redux/apis/commonValue";
import imagePath from "../../../theme/imagePath";

const SendComponent = ({ item, cb }: Record<string, any>) => {
  if (item.deleted_for == global?.userData?.id) {
    return null;
  }
  return (
    <View style={styles.user_container}>
      <View style={styles.view_user}>
        <View style={styles.view_send_msg}>
          {/* Text section added  here */}
          <Text
            style={{
              ...styles.text_msg,
              display: item?.message_type == "TEXT" ? "flex" : "none",
            }}
          >
            {item?.message}
          </Text>
          {/* Image section added  here */}
          <TouchableOpacity
            onPress={() => {
              cb("image");
            }}
            style={{ display: item?.message_type == "IMAGE" ? "flex" : "none" }}
          >
            <ImageLoadView
              source={{ uri: IMAGE_URL + item?.message }}
              style={styles.img_style}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Video section added  here */}
          <View
            style={{ display: item?.message_type == "VIDEO" ? "flex" : "none" }}
          >
            <ImageLoadView
              source={{ uri: IMAGE_URL + item?.thumb }}
              style={styles.img_style}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => {
                cb("video");
              }}
              style={styles.view_play}
            >
              <Image
                source={imagePath.playbutton}
                style={styles.img_play}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          {/* Audio section added  here */}
          <View
            style={{ display: item?.message_type == "AUDIO" ? "flex" : "none" }}
          >
            <Image
              source={imagePath.sound_waves}
              style={styles.music_img_style}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => {
                cb("audio");
              }}
              style={styles.view_audio_play}
            >
              <Image
                source={imagePath.playbutton}
                style={styles.img_audio_play}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {item?.profile_picture || item.image ? (
          <ImageLoadView
            resizeMode="cover"
            style={styles.user_image}
            source={
              item?.profile_picture
                ? { uri: IMAGE_URL + item?.profile_picture }
                : { uri: IMAGE_URL + item?.image }
            }
          />
        ) : (
          <View style={styles.view_name}>
            <Text style={styles.text_user_name}>
              {item.name?.substring(0, 1)}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.time_text}>
        {moment.utc(item?.created_at).local().fromNow()}
      </Text>
    </View>
  );
};

export default SendComponent;

const styles = StyleSheet.create({
  user_container: {
    alignSelf: "flex-end",
    marginHorizontal: 20,
    marginVertical: 15,
    alignItems: "flex-end",
  },
  view_user: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  view_send_msg: {
    alignSelf: "flex-end",
    backgroundColor: Colors.secondary.GAINSBORO,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    maxWidth: Dimensions.get("screen").width / 1.7,
    alignItems: "center",
  },
  time_text: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_12,
    color: Colors.primary.BLACK,
    alignSelf: "flex-end",
    marginRight: 40,
    marginTop: 6,
  },
  text_msg: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.BLACK,
  },
  user_image: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginLeft: 8,
  },
  view_name: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary.APP_THEME,
    height: 40,
    width: 40,
    borderRadius: 40,
    marginLeft: 8,
  },
  text_user_name: {
    fontFamily: fonts.Poppins_SemiBold,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.BLACK,
    textTransform: "capitalize",
  },
  img_style: {
    height: 150,
    width: 150,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  img_play: {
    height: 30,
    width: 30,
    tintColor: Colors.primary.WHITE,
  },
  img_audio_play: {
    height: 20,
    width: 20,
    tintColor: Colors.primary.WHITE,
  },
  view_play: {
    position: "absolute",
    alignSelf: "center",
    top: 60,
  },
  view_audio_play: {
    position: "absolute",
    alignSelf: "center",
    top: 15,
  },
  music_img_style: {
    height: 50,
    width: 50,
    tintColor: Colors.primary.APP_THEME,
    marginHorizontal: 20,
  },
});
