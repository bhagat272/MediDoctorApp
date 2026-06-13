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
  inputView: {
    height: 55,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
    borderColor: Colors.secondary.INPUT_BORDER,
  },
  textInput: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.BLACK,
    flex: 1,
  },
  search_img: {
    height: 16,
    width: 16,
    marginRight: 9,
  },
  renderView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.secondary.INPUT_BORDER,
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.secondary.OFF,
  },
  listImg: {
    height: 45,
    width: 45,
    borderRadius: 56,
    overflow: "hidden",
  },
  nameview: {
    marginLeft: 12,
    flex: 1,
    alignSelf: "center",
  },
  nameText: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.BLACK,
  },
  chatText: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.BLACK,
    marginTop: 4,
  },

  lineView: {
    marginLeft: 54,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.WATER,
  },
  view_empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_15
  },

  cancelIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.secondary.MONSOON,
  },
  search_icon: {
    height: 22,
    width: 22,
    marginRight: 5,
  },
});
export default styles;
