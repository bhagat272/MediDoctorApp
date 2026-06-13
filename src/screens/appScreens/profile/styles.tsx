import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import { hasNotch } from "react-native-device-info";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
    paddingBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  settingItemLast: {
    borderBottomWidth: 0,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.secondary.GAINSBORO,
    marginHorizontal: 20,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  settingIcon: {
    width: 40,
    height: 40,
  },

  settingText: {
    flex: 1,
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_16,
    color: Colors.secondary.MIRAGE,
  },

  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.secondary.LABEL,
  },

  // Toggle Switch Styles
  toggleContainer: {
    padding: 4,
  },

  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    padding: 2,
  },

  toggleTrackActive: {
    backgroundColor: Colors.primary.APP_THEME,
  },

  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 14,
    backgroundColor: Colors.primary.WHITE,
    shadowColor: Colors.primary.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
  },

  toggleThumbActive: {
    alignSelf: "flex-end",
  },
  image_container_view: {
    height: 70,
    width: 70,
    borderRadius: 12,
    backgroundColor: Colors.secondary.IRON,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  user_image_style: {
    height: 60,
    width: 60,
    borderRadius: 12,
  },

  profile_info_view: {
    backgroundColor: Colors.secondary.GLASS,
    minHeight: 110,
    width: "100%",
    marginTop: hasNotch() ? 50 : 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  profile_name_email_view: {
    flex: 1,
    marginHorizontal: 20,
  },

  user_name_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_18,
    color: Colors.secondary.MIRAGE,
  },

  user_email_text: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.secondary.STORM_DUST,
  },

  edit_icon_view: {
    height: 38,
    width: 38,
    backgroundColor: Colors.primary.WHITE,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  edit_icon_style: {
    height: 13,
    width: 13,
  },
});

export default styles;
