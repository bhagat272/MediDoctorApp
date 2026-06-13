import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";
import { hasNotch } from "react-native-device-info";

const { width, height } = Dimensions.get("window");
const topMargin =
  Platform.OS === "android" ? StatusBar.currentHeight || 40 : 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
  },
  form_container: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.secondary.INPUT_BORDER,
    borderRadius: 16,
    marginHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 20,
  },
  form_container2: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.secondary.INPUT_BORDER,
    borderRadius: 16,
    marginHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 20,
  },
  user_image: {
    height: 114,
    width: 114,
    borderRadius: 114 / 2,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 40,
  },
  education_btn: {
    marginBottom: 22,
  },
  view_input: {
    height: 70,
    width: "90%",
    alignSelf: "center",
    backgroundColor: Colors.secondary.OFF_WHITE,
    borderRadius: 16,
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
    // justifyContent: 'space-between',
    flexDirection: "row",
    marginTop: 5,
  },
  text_input: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_15,
    color: Colors.secondary.DUNE,
    // paddingHorizontal: 0,
    marginLeft: 10,
  },
  error_message_text: {
    color: "red",
    marginHorizontal: 25,
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_12,
    marginTop: -15,
    marginBottom: 20,
  },
  image_container_view: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  profile_image_style: {
    height: 114,
    width: 114,
    borderRadius: 114 / 2,
    overflow: "hidden",
  },
  edit_icon: {
    height: 12,
    width: 12,
    marginRight: 10,
  },
  add_photo_view: {
    width: 112,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.secondary.IRON,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 15,
  },
  add_photo_text: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_14,
    color: Colors.secondary.DUNE,
  },
  delete_icon_view: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  green_add: {
    height: 32,
    width: 32,
  },
  upload_text: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_13,
    color: Colors.secondary.DUNE,
    marginTop: 5,
  },
  label_one: {
    fontFamily: Fonts.Poppins_Medium,
    fontSize: Fonts.SIZE_18,
    color: Colors.secondary.LABEL,
    paddingHorizontal: 17,
    fontWeight: "500",
    paddingBottom: 12,
  },
  upload_view: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    borderWidth: 1.5,
    minHeight: 98,
    borderColor: Colors.primary.APP_THEME,
    width: "90%",
    alignSelf: "center",
    borderStyle: "dashed",
    borderCurve: "continuous",
    borderRadius: 12,
    backgroundColor: Colors.secondary.OFF_GREEN,
    marginBottom: 22,
  },
  certificateList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 20,
    marginTop: 10,
  },

  certificateImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.secondary.OFF_WHITE,
  },
  certificateWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },

  certificateRemove: {
    position: "absolute",
    top: -6,
    right: -6,
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.BLACK,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  certificateRemoveText: {
    color: Colors.primary.WHITE,
    fontSize: 12,
    fontFamily: Fonts.Poppins_Medium,
    lineHeight: 14,
  },
  fullscreenContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary.BLACK,
  },
  fullscreenImage: {
    width,
    height,
    resizeMode: "contain",
  },
  cross_icon: {
    height: 30,
    width: 30,
    tintColor: Colors.primary.WHITE,
  },
  image_viewer: {
    position: "absolute",
    top: Platform.OS === "ios" ? topMargin + 42 : topMargin - 37,
    right: 5,
    zIndex: 1,
    borderRadius: 20,
    padding: 10,
  },
});

export default styles;
