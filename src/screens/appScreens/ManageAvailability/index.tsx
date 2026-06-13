import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { Header, CalenderComp, StripeConnect } from "../../../components";
import imagePath from "../../../theme/imagePath";
import { translateText } from "../../../utils/language";
import styles from "./styles";
import moment from "moment";
import { from24To12Hour, to24Hour, toMinutes } from "../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAvailabilityAction,
  deleteUnavailabilityAction,
  manageAvailabilityAction,
  manageUnAvailabilityAction,
  showAvailabilityAction,
  showUnavailabilityAction,
  stripeConnectAction,
} from "../../../redux/actions/appSessionAction";
import { showToastMessage } from "../../../utils/toast";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { profileAction } from "../../../redux/actions/userSessionAction";

type TabType = "Availability" | "Unavailability";
type PeriodType = "AM" | "PM";

interface AvailabilityEntry {
  id: number;
  date: string;
  fromTime: string;
  toTime: string;
  fromPeriod: PeriodType;
  toPeriod: PeriodType;
  isWholeDay: boolean;
  isFromApi?: boolean;
}

interface TimeFormState {
  isWholeDay: boolean;
  fromTime: string;
  toTime: string;
  fromPeriod: PeriodType;
  toPeriod: PeriodType;
  fromDate: Date;
  toDate: Date;
}

const normalizeRange = (start: number, end: number) => {
  // Overnight slot → add 24h to end
  if (end <= start) {
    return [start, end + 1440];
  }
  return [start, end];
};

const isOverlappingSlot = (
  entries: AvailabilityEntry[],
  newEntry: AvailabilityEntry,
) => {
  let newStartRaw = toMinutes(newEntry.fromTime, newEntry.fromPeriod);
  let newEndRaw = toMinutes(newEntry.toTime, newEntry.toPeriod);

  const [newStart, newEnd] = normalizeRange(newStartRaw, newEndRaw);

  return entries.some((e) => {
    if (e.date !== newEntry.date) return false;
    if (e.isWholeDay) return true;

    let existingStartRaw = toMinutes(e.fromTime, e.fromPeriod);
    let existingEndRaw = toMinutes(e.toTime, e.toPeriod);

    const [existingStart, existingEnd] = normalizeRange(
      existingStartRaw,
      existingEndRaw,
    );

    // 🔥 Core overlap rule
    return newStart < existingEnd && existingStart < newEnd;
  });
};

const ManageAvailability: React.FC<any> = (props) => {
  const [activeTab, setActiveTab] = useState<TabType>("Availability");
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format("YYYY-MM-DD"),
  );
  const [isWholeDay, setIsWholeDay] = useState<boolean>(false);

  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [openPicker, setOpenPicker] = useState<null | "FROM" | "TO">(null);
  const [fromSelected, setFromSelected] = useState(false);
  const [toSelected, setToSelected] = useState(false);
  const [availabilityApiData, setAvailabilityApiData] = useState<any>({});
  const [unavailabilityApiData, setUnavailabilityApiData] = useState<any>({});
  const [unavailableWholeDayId, setUnavailableWholeDayId] = useState<
    number | null
  >(null);

  const [entries, setEntries] = useState<AvailabilityEntry[]>([]);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const [markedDates, setMarkedDates] = useState<any>(null);
  const [availabilityForm, setAvailabilityForm] = useState<TimeFormState>({
    isWholeDay: false,
    fromTime: "00:00",
    toTime: "00:00",
    fromPeriod: "AM",
    toPeriod: "AM",
    fromDate: new Date(),
    toDate: new Date(),
  });
  const [deletedSlotIds, setDeletedSlotIds] = useState<number[]>([]);

  const [unavailabilityForm, setUnavailabilityForm] = useState<TimeFormState>({
    isWholeDay: true,
    fromTime: "00:00",
    toTime: "00:00",
    fromPeriod: "AM",
    toPeriod: "AM",
    fromDate: new Date(),
    toDate: new Date(),
  });
  const isAvailability = activeTab === "Availability";

  const form = isAvailability ? availabilityForm : unavailabilityForm;
  console.log("form>>>>>>>", form)
  const setForm = isAvailability ? setAvailabilityForm : setUnavailabilityForm;
  const [availabilityEntries, setAvailabilityEntries] = useState<
    AvailabilityEntry[]
  >([]);
  const [unavailabilityEntries, setUnavailabilityEntries] = useState<
    AvailabilityEntry[]
  >([]);

  const { userData } = useSelector((state: any) => state.session);
  const isStripeConnected = Number(userData?.stripe_setup) === 1;
  const [stripeConnectURL, setStripeConnectURL] = useState("");
  const [stripeModalShow, setStripeModalShow] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(profileAction());
      console.log("---------Profile refreshed on focus------------");

      return () => { };
    }, [dispatch]),
  );

  useEffect(() => {
    if (activeTab === "Availability") {
      fetchAvailabilityForDate(selectedDate);
    } else {
      fetchUnavailabilityForDate(selectedDate);
    }
  }, [selectedDate, activeTab]);

  useEffect(() => {
    setDeletedSlotIds([]);
  }, [selectedDate]);

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");
    setMarkedDates({ [today]: { marked: true } });
  }, []);
  useEffect(() => {
    setFromSelected(false);
    setToSelected(false);
  }, [activeTab, selectedDate]);

  const connectStripe = async () => {
    try {
      const response: any = await dispatch(stripeConnectAction({}));

      const { status, url } = response;

      if (status === "true" && url) {
        setStripeConnectURL(url);
        setStripeModalShow(true);
      } else {
        showToastMessage("Unable to initiate merchant account.", "danger");
      }
    } catch (error: any) {
      console.error("Merchant account connection failed:", error);
      showToastMessage("Merchant account connection failed.", "danger");
    }
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period: PeriodType = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return {
      time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0",
      )}`,
      period,
    };
  };

  useEffect(() => {
    setOpenPicker(null);
  }, [activeTab]);

  const formatEntryText = (entry: AvailabilityEntry) => {
    const formattedDate = moment(entry.date).format("MMM DD");

    if (entry.isWholeDay) {
      return `${formattedDate} | ${activeTab === "Unavailability"
        ? "Unavailable for whole day"
        : "Available for whole day"
        }`;
    }

    return `${formattedDate} | ${entry.fromTime} ${entry.fromPeriod} - ${entry.toTime} ${entry.toPeriod}`;
  };
  const isDuplicateSlot = (
    entries: AvailabilityEntry[],
    newEntry: AvailabilityEntry,
  ) => {
    return entries.some(
      (e) =>
        e.date === newEntry.date &&
        e.isWholeDay === newEntry.isWholeDay &&
        e.fromTime === newEntry.fromTime &&
        e.fromPeriod === newEntry.fromPeriod &&
        e.toTime === newEntry.toTime &&
        e.toPeriod === newEntry.toPeriod,
    );
  };

  const resetTimeForm = () => {
    const now = new Date();
    const { time, period } = formatTime(now);

    setForm((prev) => ({
      ...prev,
      isWholeDay: false,
      fromTime: time,
      toTime: time,
      fromPeriod: period,
      toPeriod: period,
      fromDate: now,
      toDate: now,
    }));

    setFromSelected(false);
    setToSelected(false);
  };

  const addAvailabilityEntry = () => {
    if (!isStripeConnected) {
      showToastMessage(
        translateText("please_setup_merchant_account"),
        "warning",
      );
      return;
    }
    const entry: AvailabilityEntry = {
      id: Date.now(),
      date: selectedDate,
      fromTime: form.fromTime,
      toTime: form.toTime,
      fromPeriod: form.fromPeriod,
      toPeriod: form.toPeriod,
      isWholeDay: form.isWholeDay,
    };

    const currentEntries = isAvailability
      ? availabilityEntries
      : unavailabilityEntries;

    const primaryApiData = isAvailability
      ? availabilityApiData
      : unavailabilityApiData;

    const crossApiData = isAvailability
      ? unavailabilityApiData
      : availabilityApiData;

    const dayApiData = primaryApiData?.[selectedDate];

    //  Whole-day blocked from API
    if (isAvailability && dayApiData?.unavailable_whole_day === "1") {
      showToastMessage(
        translateText("this_date_is_unavailable_for"),
        "warning",
      );
      return;
    }

    //  Invalid / overnight range
    if (!entry.isWholeDay) {
      const startMinutes = toMinutes(entry.fromTime, entry.fromPeriod);
      const endMinutes = toMinutes(entry.toTime, entry.toPeriod);

      if (endMinutes <= startMinutes) {
        showToastMessage(
          translateText("end_time_must_be_after_start"),
          "warning",
        );
        return;
      }
    }

    //  Exact duplicate
    const isExactDuplicate = currentEntries.some(
      (e) =>
        e.date === entry.date &&
        e.fromTime === entry.fromTime &&
        e.fromPeriod === entry.fromPeriod &&
        e.toTime === entry.toTime &&
        e.toPeriod === entry.toPeriod,
    );

    if (isExactDuplicate) {
      showToastMessage(
        translateText("this_exact_time_slot_already"),
        "warning",
      );
      return;
    }
    console.log("dayApiData>>>>>>>>>", dayApiData);
    //  Overlap with LOCAL entries
    if (!entry.isWholeDay && isOverlappingSlot(currentEntries, entry)) {
      showToastMessage(
        translateText("this_time_slot_overlaps_with"),
        "warning",
      );
      return;
    }

    //  Overlap with BCKND (same tab)
    const start24 = to24Hour(entry.fromTime, entry.fromPeriod);
    const end24 = to24Hour(entry.toTime, entry.toPeriod);

    if (
      !entry.isWholeDay &&
      dayApiData &&
      !validateSlotAgainstApi(
        start24,
        end24,
        primaryApiData,
        selectedDate,
        "AVAILABILITY",
      )
    ) {
      showToastMessage(
        translateText("this_time_slot_conflicts_with"),
        "warning",
      );
      return;
    }

    //  Overlap with BACKEND (cross tab)
    if (
      !entry.isWholeDay &&
      crossApiData?.[selectedDate] &&
      !validateSlotAgainstApi(
        start24,
        end24,
        crossApiData,
        selectedDate,
        "AVAILABILITY",
      )
    ) {
      showToastMessage(
        translateText("this_time_slot_conflicts_with"),
        "warning",
      );
      return;
    }

    // ✅ Add entry
    if (isAvailability) {
      setAvailabilityEntries((prev) => [...prev, entry]);
    } else {
      setUnavailabilityEntries((prev) => [...prev, entry]);
    }
    resetTimeForm();
  };

  const entriesToShow = isAvailability
    ? availabilityEntries
    : unavailabilityEntries;
  const newSlots = availabilityEntries.filter((e) => !e.isFromApi);
  console.log('entriesToShow', entriesToShow)
  const submitAvailability = async () => {
    try {
      if (newSlots.length === 0 && deletedSlotIds.length === 0) {
        showToastMessage(translateText("please_add_the_time_slots"), "warning");
        return;
      }

      const groupedByDate: Record<string, any[]> = {};

      newSlots.forEach((entry) => {
        if (!entry.isWholeDay) {
          if (!groupedByDate[entry.date]) {
            groupedByDate[entry.date] = [];
          }

          groupedByDate[entry.date].push({
            start_time: to24Hour(entry.fromTime, entry.fromPeriod),
            end_time: to24Hour(entry.toTime, entry.toPeriod),
          });
        }
      });

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formData = new FormData();

      formData.append("date", selectedDate);
      formData.append("timezone", timezone);

      // 🆕 New slots
      if (groupedByDate[selectedDate]?.length) {
        formData.append("slot", JSON.stringify(groupedByDate[selectedDate]));
        formData.append(
          "forMultiple",
          String(groupedByDate[selectedDate].length > 1),
        );
      }
      for (const entry of newSlots) {
        const start24 = to24Hour(entry.fromTime, entry.fromPeriod);
        const end24 = to24Hour(entry.toTime, entry.toPeriod);

        if (
          !validateSlotAgainstApi(
            start24,
            end24,
            availabilityApiData,
            entry.date,
            "AVAILABILITY",
          )
        ) {
          showToastMessage(
            translateText("one_or_more_slots_overlap_with"),
            "warning",
          );
          return;
        }
      }

      await dispatch(manageAvailabilityAction(formData)).then((res: any) => {
        if (res?.status === true) {
          showToastMessage(translateText("availability_updated"), "success");
        }
      });

      // 🔄 Refresh from server
      setDeletedSlotIds([]);
      fetchAvailabilityForDate(selectedDate);
    } catch (error) {
      console.error("Submit availability error:", error);
      showToastMessage("Something went wrong", "danger");
    }
  };
  const newUnavailableSlots = unavailabilityEntries.filter((e) => !e.isFromApi);

  const submitUnavailability = async () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formData = new FormData();

      formData.append("date", selectedDate);
      formData.append("timezone", timezone);

      //  Whole day unavailable
      if (unavailabilityForm.isWholeDay) {
        formData.append("unavailable_whole_day", "1");
        formData.append("forMultiple", "false");
      } else {
        if (newUnavailableSlots.length === 0) {
          showToastMessage(
            translateText("please_add_the_time_slots"),
            "warning",
          );
          return;
        }

        // ✅ VALIDATION (missing before)
        for (const entry of newUnavailableSlots) {
          const start24 = to24Hour(entry.fromTime, entry.fromPeriod);
          const end24 = to24Hour(entry.toTime, entry.toPeriod);

          // ❌ Conflict with AVAILABILITY
          if (
            !validateSlotAgainstApi(
              start24,
              end24,
              availabilityApiData,
              selectedDate,
              "AVAILABILITY",
            )
          ) {
            showToastMessage(
              translateText("this_unavailability_overlaps"),
              "warning",
            );
            return;
          }

          // ❌ Conflict with UNAVAILABILITY
          if (
            !validateSlotAgainstApi(
              start24,
              end24,
              unavailabilityApiData,
              selectedDate,
              "UNAVAILABILITY",
            )
          ) {
            showToastMessage(
              translateText("this_unavailability_overlaps"),
              "warning",
            );
            return;
          }
        }

        const slots = newUnavailableSlots.map((entry) => ({
          start_time: to24Hour(entry.fromTime, entry.fromPeriod),
          end_time: to24Hour(entry.toTime, entry.toPeriod),
        }));

        formData.append("slot", JSON.stringify(slots));
        formData.append("unavailable_whole_day", "0");
        formData.append(
          "forMultiple",
          newUnavailableSlots.length > 1 ? "true" : "false",
        );
      }

      await dispatch(manageUnAvailabilityAction(formData));
      showToastMessage("Unavailability updated successfully", "success");
      fetchUnavailabilityForDate(selectedDate);
    } catch (error) {
      console.error("Submit unavailability error:", error);
      showToastMessage("Something went wrong", "danger");
    }
  };

  const fetchAvailabilityForDate = async (date: string) => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const formData = new FormData();
      formData.append("date", date);
      formData.append("timezone", timezone);

      const response: any = await dispatch(showAvailabilityAction(formData));

      const apiData = response?.data || {};
      setAvailabilityApiData(apiData);

      const dayData = apiData[date];

      if (!dayData) {
        setAvailabilityEntries([]);
        return;
      }

      const slots = dayData.slots || [];

      const parsedEntries: AvailabilityEntry[] = slots
        .map((slot: any) => {
          const from = from24To12Hour(slot.start_time);
          const to = from24To12Hour(slot.end_time);

          const startMinutes = toMinutes(from.time, from.period);
          const endMinutes = toMinutes(to.time, to.period);

          // 🚫 Ignore overnight / invalid slots
          if (endMinutes <= startMinutes) {
            console.warn("Ignored invalid slot:", slot);
            return null;
          }

          return {
            id: slot.id,
            date,
            fromTime: from.time,
            fromPeriod: from.period,
            toTime: to.time,
            toPeriod: to.period,
            isWholeDay: false,
            isFromApi: true,
          };
        })
        .filter(Boolean); // remove nulls

      setAvailabilityEntries(parsedEntries);
    } catch (error) {
      console.error("Fetch availability error:", error);
      setAvailabilityEntries([]);
    }
  };

  const fetchUnavailabilityForDate = async (date: string) => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formData = new FormData();

      formData.append("date", date);
      formData.append("timezone", timezone);

      const response: any = await dispatch(showAvailabilityAction(formData));
      const apiData = response?.data || {};

      console.log("Unavailability API data:", apiData);
      setUnavailabilityApiData(apiData);

      const dayData = apiData[date];
      const unavailableWholeDayId =
        dayData?.["unavailable-slot"]?.[0]?.id ?? null;

      console.log("Unavailability whole day id:", unavailableWholeDayId);

      setUnavailableWholeDayId(unavailableWholeDayId);
      // 🟢 No data for date
      if (!dayData) {
        setUnavailabilityEntries([]);
        setUnavailabilityForm((prev) => ({ ...prev, isWholeDay: false }));
        return;
      }

      const unavailableSlots = dayData["unavailable-slot"] || [];

      // 🟢 Whole-day unavailable
      if (dayData.unavailable_whole_day === "1") {
        setUnavailabilityEntries([]);
        setUnavailabilityForm((prev) => ({ ...prev, isWholeDay: true }));
        return;
      }

      // 🟢 Filter valid time-based unavailability slots
      const validSlots = unavailableSlots.filter(
        (slot: any) => slot.start_time && slot.end_time,
      );

      // 🟢 No valid slots → not whole day
      if (validSlots.length === 0) {
        setUnavailabilityEntries([]);
        setUnavailabilityForm((prev) => ({ ...prev, isWholeDay: false }));
        return;
      }

      const parsedEntries: AvailabilityEntry[] = validSlots.map((slot: any) => {
        const from = from24To12Hour(slot.start_time);
        const to = from24To12Hour(slot.end_time);

        return {
          id: slot.id,
          date,
          fromTime: from.time,
          fromPeriod: from.period,
          toTime: to.time,
          toPeriod: to.period,
          isWholeDay: false,
          isFromApi: true,
        };
      });

      setUnavailabilityEntries(parsedEntries);
      setUnavailabilityForm((prev) => ({ ...prev, isWholeDay: false }));
    } catch (e) {
      console.error("Fetch unavailability error", e);
      setUnavailabilityEntries([]);
    }
  };

  const deleteSlot = async (entry: AvailabilityEntry) => {
    console.log("Deleting slot:", entry.id, entry.isFromApi);

    // 🟢 Case 1: Slot exists on backend
    if (entry.isFromApi) {
      try {
        const formData = new FormData();
        formData.append("slot_id", String(entry.id));

        const action = isAvailability
          ? deleteAvailabilityAction
          : deleteUnavailabilityAction;

        const response: any = await dispatch(action(formData));

        if (response?.status === true) {
          fetchUnavailabilityForDate(selectedDate);
          if (isAvailability) {
            setAvailabilityEntries((prev) =>
              prev.filter((e) => e.id !== entry.id),
            );
          } else {
            setUnavailabilityEntries((prev) =>
              prev.filter((e) => e.id !== entry.id),
            );
          }

          showToastMessage(
            translateText("slot_deleted_successfully"),
            "success",
          );
        } else {
          showToastMessage(
            translateText("this_slot_is_already_booked"),
            "danger",
          );
        }
      } catch (error) {
        console.error("Delete slot error:", error);
        showToastMessage("Something went wrong", "danger");
      }

      return;
    }

    // 🟢 Case 2: Slot exists only in frontend
    if (isAvailability) {
      setAvailabilityEntries((prev) => prev.filter((e) => e.id !== entry.id));
    } else {
      setUnavailabilityEntries((prev) => prev.filter((e) => e.id !== entry.id));
    }
  };

  const setUnavailableWholeDate = async () => {
    if (!isStripeConnected) {
      showToastMessage(
        "Please setup merchant account first to manage slots.",
        "warning",
      );
      return;
    }
    const nextValue = !unavailabilityForm.isWholeDay;

    setUnavailabilityForm((prev) => ({
      ...prev,
      isWholeDay: nextValue,
    }));

    if (nextValue) {
      setUnavailabilityEntries([]);
    }

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formData = new FormData();

      formData.append("date", selectedDate);
      formData.append("timezone", timezone);
      formData.append("forMultiple", "false");
      formData.append("unavailable_whole_day", nextValue ? "1" : "0");

      await dispatch(manageUnAvailabilityAction(formData));

      fetchUnavailabilityForDate(selectedDate);
    } catch (err) {
      console.error(err);

      // rollback
      setUnavailabilityForm((prev) => ({
        ...prev,
        isWholeDay: !nextValue,
      }));
    }
  };

  const deleteUnavailableWholeDay = async () => {
    if (!isStripeConnected) {
      showToastMessage(
        "Please setup merchant account first to manage slots.",
        "warning",
      );
      return;
    }

    try {
      const formData = new FormData();

      formData.append("slot_id", String(unavailableWholeDayId));

      await dispatch(deleteUnavailabilityAction(formData)).then((res: any) => {
        fetchUnavailabilityForDate(selectedDate);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const extractBlockedRanges = (
    apiData: { [x: string]: any },
    selectedDate: string | number,
    mode: "AVAILABILITY" | "UNAVAILABILITY",
  ) => {
    const dateData = apiData?.[selectedDate];
    if (!dateData) return [];

    // When adding availability → block UNAVAILABLE slots only
    if (mode === "AVAILABILITY") {
      return (dateData["unavailable-slot"] || []).map((slot: any) => ({
        start: slot.start_time,
        end: slot.end_time,
        id: slot.id,
      }));
    }

    // When adding unavailability → block AVAILABLE slots only
    return (dateData.slots || []).map((slot: any) => ({
      start: slot.start_time,
      end: slot.end_time,
      id: slot.id,
    }));
  };

  const isTimeOverlapping = (
    newStart: string,
    newEnd: string,
    existingStart: string,
    existingEnd: string,
  ) => {
    return newStart < existingEnd && newEnd > existingStart;
  };

  const validateSlotAgainstApi = (
    newStart: string,
    newEnd: string,
    apiData: { [x: string]: any },
    selectedDate: string | number,
    mode: "AVAILABILITY" | "UNAVAILABILITY",
  ) => {
    const blockedRanges = extractBlockedRanges(apiData, selectedDate, mode);

    for (const range of blockedRanges) {
      if (isTimeOverlapping(newStart, newEnd, range.start, range.end)) {
        return false;
      }
    }
    return true;
  };

  const hasAvailabilityChanges =
    availabilityEntries.some((e) => !e.isFromApi) || deletedSlotIds.length > 0;

  const hasUnavailabilityChanges = unavailabilityEntries.some(
    (e) => !e.isFromApi,
  );

  const hasChanges = isAvailability
    ? hasAvailabilityChanges
    : hasUnavailabilityChanges;

  return (
    <View style={styles.container}>
      <Header
        title={translateText("manage_availability")}
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props.navigation.goBack()}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(["Availability", "Unavailability"] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Calendar */}
      <View style={styles.calendar}>
        <CalenderComp
          initialDate={startDate}
          markedDates={markedDates}
          multiSelect={false}
          onDateChange={(date: string | string[]) => {
            if (!date) return;

            const selected = Array.isArray(date) ? date[0] : date;

            setSelectedDate(selected); // ✅ THIS IS THE KEY
            setMarkedDates({ [selected]: { marked: true } });
            setStartDate(new Date(selected).toISOString());
          }}
        />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Entries */}
        {entriesToShow.map((entry) => (
          <View key={entry.id} style={styles.entryContainer}>
            <Text style={styles.entryText}>{formatEntryText(entry)}</Text>

            <TouchableOpacity onPress={() => deleteSlot(entry)}>
              <Image source={imagePath.circle_cross} style={styles.cross} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Whole day */}
        {activeTab === "Unavailability" && (
          <TouchableOpacity
            style={styles.wholeDayContainer}
            onPress={() => {
              console.log("form.isWholeDay ", form.isWholeDay);

              if (form.isWholeDay) {
                deleteUnavailableWholeDay();
              } else {
                setUnavailableWholeDate();
              }
            }}
          >
            <Image
              source={
                form.isWholeDay ? imagePath.tick_green : imagePath.tick_blank
              }
              style={styles.checkbox}
            />

            <Text style={styles.wholeDayText}>Unavailable for whole day</Text>
          </TouchableOpacity>
        )}

        {/* Time Picker UI */}
        {!form.isWholeDay && (
          <View style={styles.timeContainer}>
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>From</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => setOpenPicker("FROM")}
              >
                <Text
                  style={[styles.timeText, fromSelected && styles.timeSelected]}
                >
                  {form.fromTime}
                </Text>
                <Text
                  style={[styles.timeText, fromSelected && styles.timeSelected]}
                >
                  {"       |"}
                </Text>
                <Text
                  style={[styles.timeText, fromSelected && styles.timeSelected]}
                >
                  {form.fromPeriod}
                </Text>
                <Image
                  source={imagePath.down_arrrow}
                  style={styles.down_arrow}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>To</Text>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => setOpenPicker("TO")}
              >
                <Text
                  style={[styles.timeText, toSelected && styles.timeSelected]}
                >
                  {form.toTime}
                </Text>
                <Text
                  style={[styles.timeText, toSelected && styles.timeSelected]}
                >
                  {"       |"}
                </Text>
                <Text
                  style={[styles.timeText, toSelected && styles.timeSelected]}
                >
                  {form.toPeriod}
                </Text>
                <Image
                  source={imagePath.down_arrrow}
                  style={styles.down_arrow}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Add More */}
        {!form.isWholeDay && (
          <TouchableOpacity
            style={[styles.addMoreButton]}
            // disabled={!isStripeConnected}
            onPress={addAvailabilityEntry}
          >
            <Image source={imagePath.green_add_icon} style={styles.addIcon} />
            <Text style={styles.addMoreText}>Add</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Done */}
      {/* <TouchableOpacity
        style={styles.doneButton}
        onPress={() => {
          if (!isStripeConnected) {
            connectStripe();
            return;
          }

          if (activeTab === "Availability") {
            submitAvailability();
          } else {
            submitUnavailability();
          }
        }}
      >
        <Text style={styles.doneButtonText}>
          {!isStripeConnected ? "Connect Stripe" : "Done"}
        </Text>
      </TouchableOpacity> */}
      {(!isStripeConnected || hasChanges) && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            if (!isStripeConnected) {
              connectStripe();
              return;
            }

            if (activeTab === "Availability") {
              submitAvailability();
            } else {
              submitUnavailability();
            }
          }}
        >
          <Text style={styles.doneButtonText}>
            {!isStripeConnected ? "Setup Merchant Account" : "Done"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Native Time Picker */}
      <DatePicker
        modal
        mode="time"
        open={openPicker !== null}
        date={openPicker === "FROM" ? fromDate : toDate}
        onConfirm={(date) => {
          const { time, period } = formatTime(date);

          // console.log(
          //   "Time ",
          //   moment()?.isAfter(date?.getTime()),
          //   "current time ",date?.getDate()," selected date ",moment(selectedDate)?.
          // )

          setForm((prev) => ({
            ...prev,
            ...(openPicker === "FROM"
              ? {
                fromDate: date,
                fromTime: time,
                fromPeriod: period,
              }
              : {
                toDate: date,
                toTime: time,
                toPeriod: period,
              }),
          }));

          if (openPicker === "FROM") {
            setFromSelected(true);
          } else {
            setToSelected(true);
          }

          setOpenPicker(null);
        }}
        onCancel={() => setOpenPicker(null)}
      />
      {stripeModalShow && (
        <StripeConnect
          stripe_url={stripeConnectURL}
          visible={stripeModalShow}
          onCompletion={(success: boolean) => {
            setStripeModalShow(false);
            setStripeConnectURL("");

            if (success) {
              showToastMessage("Your account setup was successful.", "success");
              dispatch(profileAction());
            } else {
              showToastMessage(
                "There was a problem. Please try again.",
                "danger",
              );
            }
          }}
          onCancel={() => {
            setStripeModalShow(false);
            setStripeConnectURL("");
          }}
        />
      )}
    </View>
  );
};

export default ManageAvailability;
