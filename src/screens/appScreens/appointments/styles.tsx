import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import { hasNotch } from "react-native-device-info";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 65 : 50,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header_title_text: {
    fontSize: Fonts.SIZE_22,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.BLACK,
    textAlign: "center",
  },
  calenndar_icon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary.APP_THEME,
  },
  tabText: {
    fontSize: 16,
    color: Colors.secondary.MONSOON,
    fontFamily: Fonts.Poppins_Regular,
  },
  activeTabText: {
    color: Colors.primary.APP_THEME,
    fontFamily: Fonts.Poppins_SemiBold,
  },

  card: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
    backgroundColor: Colors.secondary.OFF,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.secondary.INPUT_BORDER,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  cardContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.secondary.DUNE,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  icon: {
    width: 13,
    height: 13,
    marginRight: 6,
    resizeMode: "contain",
  },
  subText: {
    fontSize: 14,
    color: Colors.secondary.MONSOON,
    fontFamily: Fonts.Poppins_Regular,
  },
  amountText: {
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary.APP_THEME,
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: Fonts.SIZE_13,
    fontFamily: Fonts.Poppins_Regular,
    color: "#757575",
    marginTop: 4,
    lineHeight: 18,
  },

  emptyContainer: {
    backgroundColor: "#82b97319",
    alignItems: "center",
    padding: 40,
    margin: 17,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary.APP_THEME,
  },
  emptyImage: {
    height: 120,
    width: 120,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: Fonts.SIZE_18,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.APP_THEME,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.BLACK,
    textAlign: "center",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    display: "none",
  },
  loadingText: {
    marginTop: 12,
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.BLACK,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  badge: {
    backgroundColor: Colors.primary.RED,
    minHeight: 20,
    minWidth: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: Fonts.SIZE_11,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary.WHITE,
  },
});

export default styles;
