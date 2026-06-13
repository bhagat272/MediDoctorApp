import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import styles from "./styles";
import { FullScreenImage, Header, ImageLoadView } from "../../../components";
import { translateText } from "../../../utils/language";
import { ImagePath } from "../../../theme";
import { useDispatch } from "react-redux";
import {
  appointMentDetailsAction,
  confirmAppointmentAction,
} from "../../../redux/actions/appSessionAction";
import { loading } from "../../../redux/reducer/loadingReducer";
import imagePath from "../../../theme/imagePath";
import moment from "moment";

interface otherDataType {
  health_details: object;
}

const ConsultationDetails = (props: any) => {
  const dispatch = useDispatch();
  const appointmentId = props?.route?.params?.appointmentId;
  const history = props?.route?.params?.history;
  const [details, setDetails] = useState<any>(null);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<number>(0);
  const [otherData, setOtherData] = useState<otherDataType | null>(null);
  const [patientReportImage, setPateintReportImage] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [endTime, setEndTime] = useState("");
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    dispatch(
      appointMentDetailsAction({
        appointment_id: appointmentId,
      }),
    ).then((res: any) => {
      setOtherData(res);

      setPateintReportImage(res?.data?.patientreport[0]?.user_report);
      setStatus(Number(res?.data?.status));
      setAppointmentDate(res?.data?.appointment_time);
      setDescription(res?.data?.description);
      setDetails(res?.data?.getuser);
      setEndTime(res?.data?.slots?.end_time);
    });
  };
  const confirmAppointMent = () => {
    dispatch(
      confirmAppointmentAction({
        appointment_id: appointmentId,
        status: 1,
      }),
    ).then((res: any) => {
      console.log(res);
      fetchData();
    });
  };
  const cancelAppointMent = () => {
    dispatch(
      confirmAppointmentAction({
        appointment_id: appointmentId,
        status: 3,
      }),
    ).then((res: any) => {
      console.log(res);
      fetchData();
    });
  };

  if (!details) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header
          title={translateText("consultation_details")}
          leftIcon={ImagePath.goBackImgpng}
          onPressLeft={() => props?.navigation.goBack()}
        />
        {/* <Text style={styles.loading}>{translateText("loading")}...</Text> */}
      </SafeAreaView>
    );
  }

  const calculateAge = (
    dobStr: {
      split: (arg0: string) => {
        (): any;
        new (): any;
        map: { (arg0: NumberConstructor): [any, any, any]; new (): any };
      };
    },
    asOf = new Date(),
  ) => {
    if (!dobStr) return null;

    // Parse YYYY-MM-DD safely (avoid timezone surprises)
    const [year, month, day] = dobStr.split("-").map(Number);
    const dob = new Date(year, month - 1, day);

    // If invalid date
    if (Number.isNaN(dob.getTime())) return null;

    // If DOB is in the future, clamp to 0 (or return negative if you prefer)
    if (dob > asOf) return 0;

    let age = asOf.getFullYear() - dob.getFullYear();

    // Has birthday happened yet this year?
    const hasHadBirthdayThisYear =
      asOf.getMonth() > dob.getMonth() ||
      (asOf.getMonth() === dob.getMonth() && asOf.getDate() >= dob.getDate());

    if (!hasHadBirthdayThisYear) age--;

    return age;
  };

  const formatTime = (time?: string | null) =>
    time ? moment(time, "HH:mm:ss").format("hh:mm A") : "";

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title={translateText("consultation_details")}
        leftIcon={ImagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {translateText("patient_information")}
          </Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <ImageLoadView
              source={
                details?.profile_picture
                  ? {
                      uri: details?.profile_picture,
                    }
                  : ImagePath.user_icon
              }
              resizeMode="cover"
              style={styles.avatar}
            />

            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={styles.name}>
                {details?.name} {details?.last_name}
              </Text>

              <Text style={styles.sub}>
                {details?.gender}, {calculateAge(details?.dob)}
              </Text>

              <Text numberOfLines={4} ellipsizeMode="tail" style={styles.sub}>
                {details?.street_address}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {translateText("appointment_date_&_time")}
          </Text>
          <View style={styles.divider} />

          <Text style={styles.value}>
            {appointmentDate
              ? appointmentDate + " to " + formatTime(endTime)
              : "N/A"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{translateText("patient_note")}</Text>
          <View style={styles.divider} />

          <Text style={styles.note}>
            {description || translateText("no_notes_provided")}
          </Text>
        </View>
        {patientReportImage && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {translateText("patient_report")}
            </Text>
            <View style={styles.divider} />

            <TouchableOpacity
              onPress={() => setShowImage(true)}
              style={styles.row}
            >
              <ImageLoadView
                source={
                  patientReportImage
                    ? {
                        uri: patientReportImage,
                      }
                    : imagePath.user_icon
                }
                resizeMode="cover"
                style={styles.report_image}
              />
            </TouchableOpacity>
          </View>
        )}

        {status === 1 ? (
          <TouchableOpacity
            style={styles.report}
            onPress={() => {
              props?.navigation.navigate("PatientDetails", {
                timelineData: otherData?.health_details,
              });
            }}
          >
            <Text style={styles.report_text}>
              {translateText("view_patient_details")}
            </Text>
            <Image source={imagePath.arrow_down} style={styles.arrow} />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </ScrollView>
      {/* {history === "upcoming" && status === 0 ? ( */}
      {status === 0 ? (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={cancelAppointMent}
          >
            <Text style={styles.cancelText}>{translateText("cancel")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={confirmAppointMent}
          >
            <Text style={styles.confirmText}>{translateText("confirm")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
      <Modal
        visible={showImage}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImage(false)}
      >
        <TouchableOpacity
          style={styles.image_viewer}
          onPress={() => setShowImage(false)}
        >
          <Image source={imagePath.cancel} style={styles.cross_icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fullscreenContainer}
          activeOpacity={1}
          onPress={() => setShowImage(false)}
        >
          <FullScreenImage
            uri={patientReportImage}
            imageStyle={styles.fullscreenImage}
            loaderSize="large"
          />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default ConsultationDetails;
