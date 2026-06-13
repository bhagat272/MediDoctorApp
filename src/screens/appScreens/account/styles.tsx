import { StyleSheet } from "react-native";
import { Colors } from "../../../theme";
import { STATUSBAR_HEIGHT } from "../../../theme/mixins";
import fonts from "../../../theme/fonts";
import { hasNotch } from "react-native-device-info";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
  },

  header: {
    height: 160 + STATUSBAR_HEIGHT,
    backgroundColor: Colors.primary.APP_THEME,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 16,
    paddingTop: STATUSBAR_HEIGHT + 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
  bell_Icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary.WARNING,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: Colors.primary.WHITE,
    fontSize: 10,
    fontWeight: "600",
  },

  profileWrapper: {
    marginTop: -60,
    alignSelf: "center",

    // iOS shadow
    shadowColor: Colors.primary.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    // Android shadow
    elevation: 8,

    backgroundColor: Colors.primary.WHITE,
    borderRadius: 999,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.secondary.OFF,
    resizeMode: "cover",
    backgroundColor: Colors.secondary.GAINSBORO,
  },

  editIcon: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 44,
    backgroundColor: Colors.primary.APP_THEME,
    justifyContent: "center",
    alignItems: "center",
  },
  edit_Icon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  name: {
    marginTop: 12,
    fontSize: fonts.SIZE_18,
    fontWeight: "500",
    color: Colors.secondary.LABEL,
    textAlign: "center",
    fontFamily: fonts.Poppins_Medium,
  },

  subText: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.secondary.MONSOON,
    textAlign: "center",
  },

  tabs: {
    flexDirection: "row",
    marginTop: 24,
    borderBottomWidth: 1,
    borderColor: Colors.secondary.BORDER_LIGHT,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },

  activeTab: {
    borderBottomWidth: 2,
    borderColor: Colors.primary.APP_THEME,
  },

  activeText: {
    color: Colors.secondary.LABEL,
    fontWeight: "400",
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_15,
  },

  inactiveText: {
    color: Colors.secondary.TEXT_MUTED,
    fontWeight: "400",
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_15,
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: Colors.secondary.BORDER_LIGHT,
    marginHorizontal: 16,
  },
  iconText: {
    fontSize: 16,
    color: Colors.primary.WHITE,
  },

  label: {
    color: Colors.secondary.LABEL,
    fontWeight: "400",
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_15,
  },

  value: {
    fontWeight: "400",
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_15,
    color: Colors.secondary.MONSOON,
  },

  reviewTitle: {
    fontSize: fonts.SIZE_18,
    fontWeight: "500",
    color: Colors.secondary.LABEL,
    fontFamily: fonts.Poppins_Medium,
  },

  reviewText: {
    color: Colors.secondary.MONSOON,
    marginLeft: 1,
    fontSize: fonts.SIZE_16,
    fontWeight: "400",
    fontFamily: fonts.Poppins_Regular,
  },
  reviewText_first: {
    color: Colors.primary.BLACK,
    marginLeft: 6,
    fontSize: fonts.SIZE_16,
    fontWeight: "400",
    fontFamily: fonts.Poppins_Regular,
  },

  sub: {
    fontSize: fonts.SIZE_14,
    color: Colors.secondary.MONSOON,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "400",
    fontFamily: fonts.Poppins_Regular,
  },
  sub_second: {
    fontSize: fonts.SIZE_14,
    color: Colors.secondary.LABEL,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "400",
    fontFamily: fonts.Poppins_Regular,
  },
  reviewBox: {
    padding: 16,
  },
  star: {
    width: 16,
    height: 16,
    marginRight: -1,
    alignSelf: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.secondary.MONSOON,
  },

  loadingText: {
    textAlign: "center",
    marginVertical: 16,
    color: Colors.secondary.MONSOON,
  },
});

export default styles;
