import { StyleSheet, Platform } from "react-native";
import Colors from "../../../theme/colors";
import fonts from "../../../theme/fonts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
  },

  chat_back: {
    height: 32,
    width: 32,
  },
  profile_pic: {
    height: 44,
    width: 44,
    borderRadius: 44,
  },
  person_name: {
    fontSize: fonts.SIZE_18,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.secondary.LABEL,
    marginLeft: 20,
    maxWidth: "60%",
  },
  more_pic: {
    height: 32,
    width: 32,
  },
  header_view: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: Platform.OS == "ios" ? 100 : 85,
    paddingTop: 40,
    marginBottom: 30,
  },
  tool_pic: {
    height: 25,
    width: 25,
  },
  view_flex: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 20,
  },
  footer_view: {
    backgroundColor: Colors.secondary.OFF_WHITE,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 25,
    paddingTop: 20,
  },
  camera_pic: {
    height: 18,
    width: 20,
  },
  textInput_view: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    paddingHorizontal: 5,
    borderColor: Colors.secondary.DUNE,
    paddingVertical: Platform.OS == "ios" ? 8 : 2,
    maxHeight: 130,
  },
  textInput_style: {
    flex: 1,
    marginHorizontal: 10,
  },
  send_icon: {
    height: 30,
    width: 30,
  },
  toolTip_icon: {
    width: 15,
    height: 15,
  },
  toolTipContent_View: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  // view_render:{
  //   marginTop:20
  // }

  block_user_view: {
    height: 60,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  block_user_text: {
    fontFamily: fonts.Poppins_SemiBold,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.RED,
  },
  attachment_icon: {
    height: 30,
    width: 30,
  },
  media_icon: {
    height: 25,
    width: 25,
    tintColor: Colors.primary.WHITE,
    marginBottom: 3,
  },
  media_view: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.primary.APP_THEME,
  },
  media_text: {
    fontFamily: fonts.Poppins_SemiBold,
    fontSize: fonts.SIZE_14,
    color: Colors.primary.WHITE,
  },
  media_sub_view: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
  },
  view_cancel_icon: {
    position: "absolute",
    right: 5,
    top: 5,
  },
  cancel_icon: {
    height: 20,
    width: 20,
  },
});

export default styles;
