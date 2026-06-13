import moment, { Moment } from "moment";
import { FC, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "../theme";
import fonts from "../theme/fonts";

export interface CalenderCompProps {
  initialDate?: string;
  endDate?: string;
  onDateChange?: (dates: string[] | string) => void;
  markedDates?: {
    [date: string]: { marked?: boolean };
  };
  multiSelect?: boolean;
  containerStyle?: ViewStyle;
}

const TODAY = moment().format("YYYY-MM-DD");
const CalenderComp: FC<CalenderCompProps> = ({
  initialDate = TODAY,
  endDate = "",
  onDateChange,
  markedDates = {},
  multiSelect = false,
  containerStyle,
}) => {
  const [currentWeekDate, setCurrentWeekDate] = useState(initialDate);

  const [selectedDates, setSelectedDates] = useState<string[]>(
    initialDate ? [initialDate] : []
  );

  const mergedMarkedDates = useMemo(
    () => ({
      // [TODAY]: { marked: true },
      ...markedDates,
    }),
    [markedDates]
  );

  const weekStart = useMemo(
    () => moment(currentWeekDate).startOf("week").add(1, "day"),
    [currentWeekDate]
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => moment(weekStart).add(i, "days")),
    [weekStart]
  );

  const onSelectDate = (date: string) => {
    if (moment(date).isBefore(TODAY, "day")) return;

    setSelectedDates((prev) => {
      let updated: string[];

      if (multiSelect) {
        updated = prev.includes(date)
          ? prev.filter((d) => d !== date)
          : [...prev, date];
      } else {
        updated = [date];
      }

      onDateChange?.(multiSelect ? updated : updated[0]);
      return updated;
    });
  };

  const changeWeek = (direction: "prev" | "next") => {
    setCurrentWeekDate((prev) => {
      const newDate = moment(prev).add(direction === "next" ? 7 : -7, "days");

      // ❌ Block navigating to weeks before today
      if (direction === "prev" && newDate.isBefore(TODAY, "week")) {
        return prev;
      }

      return newDate.format("YYYY-MM-DD");
    });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeWeek("prev")}>
          <Text style={styles.arrow}>{"‹"}</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.headerText}>
            {/* {moment(currentWeekDate).format('DD MMM, YYYY')} */}
            {moment(currentWeekDate).format("MMMM")}
          </Text>
        </View>

        <TouchableOpacity onPress={() => changeWeek("next")}>
          <Text style={styles.arrow}>{"›"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {weekDays.map((day: Moment) => {
          const dateString = day.format("YYYY-MM-DD");
          const isMarked = mergedMarkedDates[dateString]?.marked;
          const isPast = day.isBefore(moment(), "day"); // ✅ day exists here

          return (
            <TouchableOpacity
              key={dateString}
              disabled={isPast}
              onPress={() => onSelectDate(dateString)}
              style={[
                styles.dayContainer,
                isMarked && styles.selectedDay,
                isPast && styles.disabledDay,
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  isMarked && styles.selectedText,
                  isPast && styles.disabledText,
                ]}
              >
                {day.format("DD")}
              </Text>

              <Text
                style={[
                  styles.dayLabel,
                  isMarked && styles.selectedText,
                  isPast && styles.disabledText,
                ]}
              >
                {day.format("ddd")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
export default CalenderComp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  headerText: {
    fontSize: fonts.SIZE_18,
    fontFamily: fonts.Poppins_Medium,
    fontWeight: "500",
  },
  arrow: {
    fontSize: fonts.SIZE_23,
    color: Colors.secondary.TEXT_MUTED,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  dayContainer: {
    // width: 48,
    // height: 80,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary.OFF,
  },
  selectedDay: {
    backgroundColor: Colors.primary.APP_THEME,
  },
  dayNumber: {
    fontSize: fonts.SIZE_16,
    fontWeight: "500",
    color: Colors.primary.BLACK,
    fontFamily: fonts.Poppins_Medium,
  },
  dayLabel: {
    fontSize: fonts.SIZE_12,
    color: "#777",
    marginTop: 4,
    fontFamily: fonts.Poppins_Medium,
  },
  selectedText: {
    color: Colors.primary.WHITE,
  },
  disabledDay: {
    backgroundColor: "#EEE",
  },
  disabledText: {
    color: "#AAA",
  },
});
