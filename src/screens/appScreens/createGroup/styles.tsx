import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: Colors.primary.WHITE,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: Colors.primary.WHITE,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    flex: 1,
  },
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
    color: Colors.primary.BLACK,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
    color: Colors.primary.GREY,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  view_sub: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  img_group: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  view_group_icon: {
    alignSelf: "center",
    marginVertical: 20,
  },
  text_edit_icon: {
    fontSize: 16,
    color: Colors.primary.APP_THEME,
    fontFamily: fonts.Poppins_Bold,
    textAlign: "center",
    marginTop: 10,
  },
  img_check: {
    marginLeft: 10,
    height: 20,
    width: 20,
  },
});
export default styles;
