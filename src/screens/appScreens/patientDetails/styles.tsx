import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import { hasNotch } from "react-native-device-info";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 65 : 50,
  },

  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.secondary.INPUT_BORDER,
    backgroundColor: Colors.secondary.OFF,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    // borderBottomWidth: 3,
    // borderBottomColor: Colors.primary.APP_THEME,
  },
  tabText: {
    fontSize: 15,
    color: Colors.primary.BOTTOM_INACTIVE,
    fontFamily: Fonts.Poppins_Regular,
    fontWeight: "400",
  },
  activeTabText: {
    color: Colors.secondary.LABEL,
    fontFamily: Fonts.Poppins_Regular,
    fontWeight: "400",
  },
  value: {
    fontSize: 15,
    color: Colors.primary.BOTTOM_INACTIVE,
    fontFamily: Fonts.Poppins_Regular,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: Colors.secondary.LABEL,
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    fontWeight: "400",
  },

  content: {
    marginHorizontal: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.secondary.INPUT_BORDER,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: 12,
  },

  item: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    color: Colors.secondary.LABEL,
    fontWeight: "400",
    marginBottom: 4,
    fontFamily: Fonts.Poppins_Regular,
  },
});

export default styles;
