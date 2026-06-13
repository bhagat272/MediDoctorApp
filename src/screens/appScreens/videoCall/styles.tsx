import { Dimensions, Platform, StyleSheet } from "react-native";
import fonts from "../../../theme/fonts";
import { Colors } from "../../../theme";
import { WINDOW_WIDTH } from "../../../theme/mixins";

const styles = StyleSheet.create({
  callAction: { height: 70, width: 70, resizeMode: "contain" },
  time_text: {
    color: "white",
    fontSize: fonts.SIZE_16,
    marginTop: 5,
    textAlign: "center",
    fontFamily: fonts.Poppins_SemiBold,
  },
  img_user: {
    borderRadius: 100,
    height: 100,
    width: 100,
    alignSelf: "center",
  },
  img_background: { flex: 1, paddingTop: 120 },
  text_name: {
    color: Colors.primary.BLACK,
    fontFamily: fonts.Poppins_SemiBold,
    fontSize: fonts.SIZE_20,
    alignSelf: "center",
    marginTop: 10,
  },
  view_row_btn: {
    flexDirection: "row",
    marginBottom: 80,
    justifyContent: "space-around",
  },
  text_calling: {
    color: Colors.primary.BLACK,
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_16,
    alignSelf: "center",
    marginTop: 30,
  },
  view_flow: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 35,
    marginLeft: 3,
  },
  view_contain: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.primary.GREY,
  },
  view_kit: {
    backgroundColor: "white",
    height: Dimensions.get("window").height,
  },
  text_call_user_name: {
    color: "white",
    fontSize: fonts.SIZE_20,
    marginBottom: 11,
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.Poppins_Medium,
  },
  view_calling: {
    position: "absolute",
    bottom: 200,
    width: "100%",
  },
  view_counter: {
    flexDirection: "row",
    flex: 1,
    alignSelf: "center",
  },
  view_main_counter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  view_calling_text: { flexDirection: "row", justifyContent: "center" },
  mainViewContainAgora: {
    marginTop: 40,
    borderRadius: 8,
  },
  viewMainAgora: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginLeft: Dimensions.get("screen").width - 110,
  },
  img_speaker: { height: 30, width: 30 },
  view_speaker: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.APP_THEME,
  },
  profile_pic: {
    height: 34,
    width: 34,
    borderRadius: 34 / 2,
  },
  text_container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: WINDOW_WIDTH * 0.8,
    alignSelf: "center",
  },

  // video call styles end

  videoRoot: {
    // flex: 1,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  fullScreenVideo: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.primary.BLACK,
  },

  cameraoffStyle: {
    backgroundColor: Colors.primary.BLACK,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  icon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    tintColor: Colors.primary.WHITE,
  },
  videoFill: {
    flex: 1,
    width: "100%",
    height: "100%",
    // backgroundColor: Colors.black,
  },
  localPreviewSmallContainer: {
    position: "absolute",
    top: Platform.OS == "ios" ? 80 : 40,
    right: 5,
    width: 120,
    height: 150,
    //borderRadius: 8,
    overflow: "hidden",
    zIndex: 1,
    // left: Dimensions.get('window').width - 120,
    //backgroundColor:'red'
  },
  localPreviewSmall: {
    position: "absolute",
    //top: 20,
    //right: 10,
    width: 120,
    height: 150,
    //borderRadius: 8,
    overflow: "hidden",
    zIndex: 2,
  },
  tapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  // cameraoffStyle: {
  //   position: "absolute",
  //   top: 40,
  //   // right: 10,
  //   width: 100,
  //   height: 150,
  //   borderRadius: 8,
  //   overflow: "hidden",
  //   zIndex: 2,
  //   backgroundColor: Colors.primary.RED,
  //   left: Dimensions.get("window").width - 130,
  //   justifyContent: "center",
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  // icon: {
  //   height: 30,
  //   width: 30,
  //   resizeMode: "contain",
  //   tintColor: Colors.primary.WHITE,
  // },
  remotePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary.BLACK,
  },
  overlayTop: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  controlPanel: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor:'red'
  },
  controlButton: {
    backgroundColor: Colors.primary.APP_THEME,
    height: 50,
    width: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  endCallButton: {
    height: 60,
    width: 60,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
