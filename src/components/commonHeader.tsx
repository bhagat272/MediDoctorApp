import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Fonts } from "../theme";
import ImageLoadView from "./imageLoadView";
import imagePath from "../theme/imagePath";
import { IMAGE_URL } from "../redux/apis/commonValue";

const AppHeader = (props: any) => {
  return props.navigation.setOptions({
    headerLeft: () => (
      <View style={styles.header_left_container}>
        {props.userImage_show ? (
          <TouchableOpacity
            onPress={props.onPressUserImage}
            activeOpacity={0.8}
          >
            <ImageLoadView
              source={
                props.userImage
                  ? { uri: IMAGE_URL + props?.userImage }
                  : imagePath.user_icon
              }
              resizeMode="cover"
              style={[
                styles.left_image_style,
                props?.userImageColor && { tintColor: props?.userImageColor },
              ]}
            />
          </TouchableOpacity>
        ) : props.leftImage ? (
          <TouchableOpacity onPress={props?.onPressLeft} activeOpacity={0.8}>
            <Image
              source={props.leftImage}
              resizeMode="cover"
              style={[
                styles.left_image_style,
                props?.leftImageColor && { tintColor: props?.leftImageColor },
              ]}
            />
          </TouchableOpacity>
        ) : null}
        {props?.headerLeftTitle ? (
          <Text style={[styles.header_left_title, props?.leftTitleStyle]}>
            {props?.headerLeftTitle}
          </Text>
        ) : null}
      </View>
    ),

    headerTitle: () =>
      props?.headerTitle ? (
        <Text
          style={[
            styles.header_title_text,
            props?.titleStyle2,
            { display: props.headerTitle ? "flex" : "none" },
          ]}
        >
          {props?.headerTitle}
        </Text>
      ) : null,
    leftTitle: () =>
      props?.leftTitle ? (
        <Text
          style={[
            styles.header_left_title_text,
            props?.leftTitleStyle,
            { display: props.leftTitle ? "flex" : "none" },
          ]}
        >
          {props?.leftTitle}
        </Text>
      ) : null,

    headerRight: () => (
      <View style={styles.header_right_style}>
        {props?.rightImageOne && (
          <TouchableOpacity
            onPress={props?.onPressRightOne}
            activeOpacity={0.8}
          >
            <Image
              source={props?.rightImageOne}
              resizeMode="contain"
              style={[styles.right_image_one_style, props.rightImageOneStyle]}
            />
            {props?.unreadCount > 0 ? (
              <View style={styles.dot_view}>
                <Text style={styles.text_count}>
                  {props?.unreadCount <= 9 ? props?.unreadCount : "+9"}
                </Text>
              </View>
            ) : (
              <></>
            )}
          </TouchableOpacity>
        )}
        {props?.rightImageTwo && (
          <TouchableOpacity
            onPress={props?.onPressRightTwo}
            activeOpacity={0.8}
          >
            <Image
              source={props?.rightImageTwo}
              resizeMode="contain"
              style={[styles.right_image_two_style, props.rightImageTwoStyle]}
            />
          </TouchableOpacity>
        )}
      </View>
    ),

    headerStyle: {
      height: 100,
      // backgroundColor: props.headerBackgroundColor
      //   ? props.headerBackgroundColor
      //   : 'transparent',
      width: "100%",
    },
  });
};

const styles = StyleSheet.create({
  header_left_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  left_image_style: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  header_left_title: {
    marginLeft: 10,
    fontSize: Fonts.SIZE_22,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.BLACK,
  },
  header_title_text: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.BLACK,
    textAlign: "center",
  },
  header_left_title_text: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.BLACK,
    textAlign: "center",
  },
  right_image_one_style: {
    height: 34,
    width: 34,
    marginRight: 10,
  },
  right_image_two_style: {
    height: 34,
    width: 34,
  },
  header_right_style: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot_view: {
    backgroundColor: Colors.primary.RED,
    height: 20,
    width: 20,
    borderRadius: 35,
    position: "absolute",
    right: 6,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  text_count: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_11,
    color: Colors.primary.WHITE,
  },
});

export default AppHeader;
