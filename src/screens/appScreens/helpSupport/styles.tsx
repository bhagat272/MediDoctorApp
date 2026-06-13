import { StyleSheet } from "react-native";
import Colors from "../../../theme/colors";
import fonts from "../../../theme/fonts";
import { hasNotch } from "react-native-device-info";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
  },

  card: {
    backgroundColor: Colors.secondary.OFF,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  question: {
    flex: 1,
    fontSize: fonts.SIZE_16,
    fontFamily: fonts.Poppins_Medium,
    color: Colors.primary.BLACK,
  },

  arrow: {
    width: 13,
    height: 7,
    marginLeft: 8,
    resizeMode: "contain",
  },

  answer: {
    marginTop: 12,
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.secondary.LABEL,
    lineHeight: 20,
    fontWeight: "400",
  },

  helpText: {
    textAlign: "center",
    fontSize: fonts.SIZE_20,
    fontFamily: fonts.Poppins_Bold,
    color: Colors.secondary.LABEL,
    marginVertical: 24,
    fontWeight: "400",
  },

  emailBtn: {
    flexDirection: "row",
    backgroundColor: Colors.primary.APP_THEME,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 12,
    marginHorizontal:16
  },

  emailText: {
    fontSize: fonts.SIZE_16,
    fontFamily: fonts.Poppins_Medium,
    color: Colors.primary.WHITE,
  },
  email: {
    width: 20,
    height: 18.33,
  },
});

export default styles;
