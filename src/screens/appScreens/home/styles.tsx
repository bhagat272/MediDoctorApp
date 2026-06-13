import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import fonts from "../../../theme/fonts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 25,
    marginRight: 12,
  },

  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.primary.BLACK,
    paddingEnd: 32,
  },

  card: {
    backgroundColor: Colors.secondary.MINT_CREAM,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 30,
    alignItems: "center",
  },

  iconWrapper: {
    marginBottom: 12,
  },

  cardIcon: {
    height: 58,
    width: 58,
  },

  cardText: {
    fontSize: fonts.SIZE_16,
    color: Colors.primary.BLACK,
    fontFamily: fonts.Poppins_Regular,
  },
});

export default styles;
