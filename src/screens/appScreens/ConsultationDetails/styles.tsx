import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import { hasNotch } from "react-native-device-info";

const { width, height } = Dimensions.get("window");

const topMargin =
  Platform.OS === "android" ? StatusBar.currentHeight || 40 : 10;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
  },

  container: {
    padding: 16,
    paddingBottom: 120,
    backgroundColor: Colors.primary.WHITE,
  },

  card: {
    borderWidth: 1,
    borderColor: Colors.secondary.BORDER_LIGHT,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: Colors.primary.WHITE,
  },
  cardTitle: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.secondary.LABEL,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.secondary.BORDER_LIGHT,
    marginVertical: 12,
  },

  /* Patient Row */
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 60,
    backgroundColor: Colors.secondary.WATER,
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

  report_image: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    backgroundColor: Colors.secondary.WATER,
  },
  image_viewer: {
    position: "absolute",
    top: Platform.OS === "ios" ? topMargin + 42 : topMargin - 37,
    right: 5,
    zIndex: 1,
    borderRadius: 20,
    padding: 10,
  },

  name: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary.BLACK,
  },
  loading: {
    alignSelf: "center",
    marginTop: 30,
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary.BLACK,
  },
  sub: {
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.BOTTOM_INACTIVE,
    marginTop: 2,
  },

  value: {
    fontSize: Fonts.SIZE_15,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.BOTTOM_INACTIVE,
  },

  note: {
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.BOTTOM_INACTIVE,
    lineHeight: 20,
  },

  /* Footer */
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.primary.WHITE,
  },

  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary.APP_THEME,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginRight: 12,
    backgroundColor: Colors.primary.WHITE,
  },
  cancelText: {
    color: Colors.primary.BOTTOM_INACTIVE,
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Medium,
  },

  confirmBtn: {
    flex: 1,
    backgroundColor: Colors.primary.APP_THEME,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmText: {
    color: Colors.primary.WHITE,
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_SemiBold,
  },
  arrow: {
    width: 14,
    height: 7,
    transform: [{ rotate: "-90deg" }],
    alignSelf: "center",
  },
  report: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.secondary.BORDER_LIGHT,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: Colors.secondary.OFF,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 22,
  },
  report_text: {
    color: Colors.primary.BLACK,
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Regular,
  },
});

export default styles;
