import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import { hasNotch } from "react-native-device-info";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
  },
  logo_image: {
    height: 60,
    width: 60,
    alignSelf: "center",
    marginBottom: 25,
    marginTop: hasNotch() ? 100 : 50,
  },
  welcome_text: {
    fontFamily: Fonts.Poppins_Medium,
    fontSize: Fonts.SIZE_24,
    color: Colors.primary.BLACK,
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  enter_details_text: {
    textAlign: "center",
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.BLACK,
    marginBottom: 50,
    opacity: 0.7,
  },
  password_icon_style: {
    width: 25,
    height: 25,
  },
  remember_view_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 50,
  },
  remember_me_view: {
    flexDirection: "row",
    alignItems: "center",
  },
  check_image: { height: 22, width: 22, marginRight: 5 },
  remember_me_text: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_15,
    color: Colors.primary.BLACK,
    textAlign:'center'
  },
  forgot_password_text: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_15,
    color: Colors.primary.APP_THEME,
    textDecorationLine: "underline",
  },
  dont_have_acc_text: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.BLACK,
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  sign_up_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.BLACK,
    textDecorationLine: "underline",
  },
});

export default styles;
