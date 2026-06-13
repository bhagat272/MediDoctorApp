import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";
import Colors from "../../../theme/colors";
import fonts from "../../../theme/fonts";
import { hasNotch } from "react-native-device-info";

const { width, height } = Dimensions.get("window");

const topMargin =
  Platform.OS === "android" ? StatusBar.currentHeight || 40 : 10;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
    paddingHorizontal: 16,
  },

  content: {
    padding: 16,
  },
  cross_icon: {
    height: 30,
    width: 30,
    tintColor: Colors.primary.WHITE,
  },
  card: {
    backgroundColor: Colors.primary.WHITE,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.primary.BLACK,
    marginBottom: 6,
    fontWeight: "400",
  },

  value: {
    fontSize: fonts.SIZE_15,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.secondary.MONSOON,
    fontWeight: "400",
  },

  medicineName: {
    fontSize: 16,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.BLACK,
  },

  saltName: {
    fontSize: 13,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.secondary.MONSOON,
    marginTop: 4,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.secondary.MONSOON,
  },

  weekLabel: {
    marginTop: 20,
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.BLACK,
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  dayCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary.APP_THEME,
    alignItems: "center",
    justifyContent: "center",
  },

  activeDay: {
    backgroundColor: Colors.primary.APP_THEME,
  },

  dayText: {
    fontSize: 14,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.APP_THEME,
  },

  activeDayText: {
    color: Colors.primary.WHITE,
  },

  report_image: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    backgroundColor: Colors.secondary.WATER,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  divider: {
    height: 1,
    backgroundColor: Colors.secondary.BORDER_LIGHT,
    marginVertical: 12,
  },
  card_second: {
    borderWidth: 1,
    borderColor: Colors.secondary.BORDER_LIGHT,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: Colors.primary.WHITE,
  },

  image_viewer: {
    position: "absolute",
    top: Platform.OS === "ios" ? topMargin + 42 : topMargin - 37,
    right: 5,
    zIndex: 1,
    borderRadius: 20,
    padding: 10,
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
});
