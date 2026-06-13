import { StyleSheet } from "react-native";
import Colors from "../../../theme/colors";
import fonts from "../../../theme/fonts";
import { hasNotch } from "react-native-device-info";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.WHITE,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: Colors.primary.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.secondary.OFF,
  },

  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  userName: {
    fontSize: fonts.SIZE_15,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.BLACK,
  },

  date: {
    fontSize: fonts.SIZE_11,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.secondary.MONSOON,
    marginTop: 2,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    height: 16,
    width: 16,
    marginRight: 4,
    resizeMode: "contain",
  },

  rating: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.BLACK,
  },

  reviewCard: {
    backgroundColor: Colors.primary.WHITE,
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Poppins_Medium,
    color: Colors.primary.BLACK,
    marginBottom: 8,
  },

  reviewText: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Poppins_Regular,
    lineHeight: 20,
    color: Colors.secondary.DUNE,
  },

  replyCard: {
    backgroundColor: Colors.secondary.MINT_CREAM,
    padding: 16,
    borderRadius: 14,
  },

  replyText: {
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Poppins_Regular,
    lineHeight: 18,
    color: Colors.secondary.STORM_DUST,
  },

  replyInputCard: {
    backgroundColor: Colors.primary.WHITE,
    padding: 16,
    borderRadius: 14,
  },

  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.secondary.INPUT_BORDER,
    borderRadius: 12,
    padding: 12,
    textAlignVertical: "top",
    fontSize: fonts.SIZE_13,
    fontFamily: fonts.Poppins_Regular,
    color: Colors.primary.BLACK,
    marginBottom: 14,
  },

  submitBtn: {
    backgroundColor: Colors.primary.APP_THEME,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  submitText: {
    fontSize: fonts.SIZE_14,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.WHITE,
  },
});

export default styles;
