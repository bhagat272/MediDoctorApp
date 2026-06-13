import { StyleSheet } from "react-native";
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
    marginTop: 40,
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
    fontFamily: Fonts.Poppins_Medium,
    fontSize: Fonts.SIZE_18,
    color: Colors.secondary.MONSOON,
    marginBottom: 50,
  },

  password_icon_style: {
    width: 25,
    height: 25,
  },
});

export default styles;
