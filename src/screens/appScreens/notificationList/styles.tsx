import { StyleSheet } from "react-native";
import fonts from "../../../theme/fonts";
import { Colors } from "../../../theme";
import { hasNotch } from "react-native-device-info";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
  },

  list: {
    paddingHorizontal: 20,

    paddingBottom: 80,
  },

  item: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  view_empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  emptyText: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_15,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  name: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.secondary.LABEL,
  },

  message: {
    fontSize: fonts.SIZE_14,
    lineHeight: 20,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.secondary.LABEL,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  time: {
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Poppins_Medium,
    color: Colors.secondary.LABEL,
    marginRight: 8,
    fontWeight: "500",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.APP_THEME,
  },
});

export default styles;
