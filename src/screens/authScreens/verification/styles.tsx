import { Dimensions, StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import { hasNotch } from "react-native-device-info";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
  },
  logo_image: {
    height: 60,
    width: 60,
    alignSelf: "center",
    marginBottom: 25,
  },
  welcome_text: {
    fontFamily: Fonts.Poppins_SemiBold,
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
    opacity: 0.7,
    marginBottom: 50,
  },

  otp_text_box: {
    width: Dimensions.get("window").width,
    padding: 0,
  },
  otp_text_input: {
    height: 64,
    width: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.secondary.WATER,
    backgroundColor: Colors.secondary.OFF_WHITE,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.BLACK,
    alignItems: "center",
    justifyContent: "center",
    fontSize: Fonts.SIZE_24,
    textAlign: "center",
    marginHorizontal: 4,
  },

  resend_text: {
    textAlign: "center",
    alignSelf: "center",
    marginTop: 50,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.BLACK,
    opacity: 0.7,
  },
  resend_button_text: {
    textAlign: "center",
    alignSelf: "center",
    marginTop: 50,
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_16,
    color: Colors.primary.APP_THEME,
    opacity: 0.7,
  },
});

export default styles;
