import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import { hasNotch } from "react-native-device-info";
export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,

    paddingHorizontal: 16,
  },

  headerTitle: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_18,
    color: Colors.secondary.LABEL,
    textAlign: "center",
    marginBottom: 16,
  },

  card: {
    borderWidth: 1,
    borderColor: Colors.secondary.BORDER_LIGHT,
    borderRadius: 16,
    padding: 12,
    backgroundColor: Colors.primary.WHITE,
  },

  arrow: {
    fontSize: Fonts.SIZE_24,
    color: Colors.secondary.COTTON_SEED,
  },

  appointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.secondary.INPUT_BORDER,
    backgroundColor: Colors.secondary.OFF,
  },

  avatar: {
    height: 52,
    width: 52,
    borderRadius: 26,
    marginRight: 12,
  },

  name: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_16,
    color: Colors.secondary.LABEL,
    marginBottom: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 2,
  },

  icon: {
    height: 14,
    width: 14,
    resizeMode: "contain",
    marginRight: 6,
  },

  sub: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_13,
    color: Colors.secondary.TEXT_MUTED,
    flexShrink: 1,
  },
  empty_view: {
    flex: 1,
    backgroundColor: Colors.secondary.OFF,
    padding: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    borderRadius: 13,
  },
  empty_text: {
    textAlign: "center",

    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_16,
    color: Colors.secondary.TEXT_MUTED,
  },
});
