import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";
import { hasNotch } from "react-native-device-info";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
  },

  /* Tabs */
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary.APP_THEME,
  },
  tabText: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.BOTTOM_INACTIVE,
  },
  activeTabText: {
    color: Colors.primary.BLACK,
    fontFamily: Fonts.Poppins_Medium,
  },

  /* Content */
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },

  dateItem: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    minWidth: 40,
    backgroundColor: Colors.secondary.OFF,
  },
  calendar: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  dateNumber: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.BLACK,
    marginBottom: 4,
  },

  dayText: {
    fontSize: Fonts.SIZE_12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.secondary.MONSOON,
  },

  entryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.secondary.MINT_CREAM,
    borderRadius: 8,
    marginBottom: 12,
  },
  entryText: {
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.APP_THEME,
    flex: 1,
  },

  /* Whole Day */
  wholeDayContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.secondary.MINT_CREAM,
    borderRadius: 8,
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,

    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: Colors.primary.APP_THEME,
    borderColor: Colors.primary.APP_THEME,
  },
  wholeDayText: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.BLACK,
    fontWeight: "400",
  },

  /* Time */
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeSection: {
    flex: 1,

    marginHorizontal: 8,
  },
  timeLabel: {
    fontSize: Fonts.SIZE_15,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.secondary.LABEL,
    marginBottom: 8,
  },
  timeInputContainer: {
    flexDirection: "row",
    backgroundColor: Colors.secondary.OFF,
    borderRadius: 8,
    overflow: "hidden",
  },
  timeInput: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.BLACK,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.secondary.OFF,
    minHeight: 56,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.secondary.INPUT_BORDER,
  },
  timeText: {
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.secondary.MONSOON,
  },
  timeSelected: {
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.secondary.LABEL,
  },

  periodButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: Colors.secondary.HARP,
  },
  periodText: {
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.secondary.MONSOON,
    marginRight: 4,
  },

  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 20,
  },
  addMoreText: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.secondary.LABEL,
    marginLeft: 8,
  },

  doneButton: {
    backgroundColor: Colors.primary.APP_THEME,
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.WHITE,
  },
  days: {
    backgroundColor: "red",
  },
  down_arrow: {
    width: 18,
    height: 18,
  },
  cross: {
    width: 24,
    height: 24,
  },
  addIcon: {
    width: 20,
    height: 20,
  },
});
