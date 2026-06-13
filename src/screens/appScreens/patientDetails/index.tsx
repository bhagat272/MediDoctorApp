import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { Header } from "../../../components";
import { Colors, ImagePath } from "../../../theme";
import styles from "./styles";
import { translateText } from "../../../utils/language";

const PatientDetails = (props: any) => {
  const [tab, setTab] = useState<"Timeline Layout" | "Immunizations">(
    "Timeline Layout",
  );
  const timeLineData = props?.route?.params?.timelineData;

  useEffect(() => {
    console.log("------TIMELINEDATA------------>", timeLineData);
  }, []);

  // const toFeetInches = (value: string | number) => {
  //   const feet = Math.floor(Number(value));
  //   const inches = Math.round((Number(value) - feet) * 12);
  //   return `${feet}'${inches}`;
  // };

  const STATUS_OPTIONS = [
    { id: 1, title: "Healthy" },
    { id: 2, title: "Unhealthy" },
    { id: 3, title: "Moderate" },
  ];
  const getHealthStatusTitle = (statusId: string | number) =>
    STATUS_OPTIONS.find((item) => item.id === statusId)?.title;

  return (
    <View style={styles.container}>
      <Header
        title={translateText("patient_details")}
        leftIcon={ImagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />

      <ScrollView>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, tab === "Timeline Layout" && styles.activeTab]}
            onPress={() => setTab("Timeline Layout")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "Timeline Layout" && styles.activeTabText,
              ]}
            >
              Timeline Layout
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
          style={[styles.tab, tab === "Immunizations" && styles.activeTab]}
          onPress={() => setTab("Immunizations")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "Immunizations" && styles.activeTabText,
            ]}
          >
            Immunizations
          </Text>
        </TouchableOpacity> */}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {tab === "Timeline Layout" && (
            <>
              <View style={styles.item}>
                <Text style={styles.label}>
                  {translateText("blood_pressure")}
                </Text>
                <Text style={styles.value}>
                  {timeLineData?.low_blood_presure
                    ? `${timeLineData.low_blood_presure} / ${timeLineData?.high_blood_presure ?? "Not Available"}`
                    : "Not Available"}
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Health</Text>
                <Text style={styles.value}>
                  {getHealthStatusTitle(timeLineData?.health_status) ||
                    "Not Available"}
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>{translateText("medication")}</Text>
                <Text style={styles.value}>
                  {timeLineData?.medication || "Not Available"}
                </Text>
              </View>

              {/* <View style={styles.item}>
                <Text style={styles.label}>Immunizations</Text>
                <Text style={styles.value}>
                  {timeLineData?.immuzations || "Not Available"}
                </Text>
              </View> */}

              <View style={styles.item}>
                <Text style={styles.label}>{translateText("height")}</Text>
                <Text style={styles.value}>
                  {timeLineData?.height
                    ? timeLineData?.height + " ft"
                    : "Not Available"}
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>{translateText("weight")}</Text>
                <Text style={styles.value}>
                  {timeLineData?.weight
                    ? timeLineData?.weight + " lbs"
                    : "Not Available"}
                </Text>
              </View>
            </>
          )}

          {tab === "Immunizations" && (
            <Text style={styles.emptyText}>
              {translateText("no_immunization_data_available")}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PatientDetails;
