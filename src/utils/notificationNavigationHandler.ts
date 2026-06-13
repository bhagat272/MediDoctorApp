import { handlePush } from "../navigation/navigationService";
import { setInitialTab } from "../redux/reducer/tabReducer";
import store from "../redux/store";

type ParsedNotification = {
  type: string | null;
  data: Record<string, any> | null;
};

export const parseNotificationPayload = (
  remoteMessage: any,
): ParsedNotification => {
  try {
    const type = remoteMessage?.data?.type ?? null;
    const rawData = remoteMessage?.data?.payload || remoteMessage?.data?.data;
    console.log("rawData>>>>>>>>>>", rawData);
    const parsedData =
      typeof rawData === "string" ? JSON.parse(rawData) : rawData;
    console.log("parsedData", parsedData);
    return {
      type,
      data: parsedData ?? null,
    };
  } catch (error) {
    console.log("❌ Notification parse error", error);
    return { type: null, data: null };
  }
};

export function handleNotificationNavigationFromPayload(payloadString: any) {
  try {
    console.log(
      "🔔 Notification tapped | raw message =>",
      JSON.stringify(payloadString, null, 2),
    );
    console.log("****************** Handle CLick and get adta", payloadString);
    const { type, data } = parseNotificationPayload(payloadString);
    console.log("data of pushnotification=====>", type, data);
    const tryNavigate = async () => {
      if (type === "AccountStatus") {
        return;
      }

      if (type == "PaymentReceived") {
        handlePush({
          name: "TransactionList",
        });
      } else if (type == "MedicationShared") {
        handlePush({
          name: "UserMedicationListScreen",
          params: {
            user_id: data?.other_user_id,
          },
        });
      } else if (type == "APPOINTMENT_REMINDER") {
        handlePush({
          name: "ConsultationDetails",
          params: {
            appointmentId: data?.appointment_id,
          },
        });
      } else if (type == "admin_broadcast") {
        handlePush({
          name: "NotificationList",
          params: {},
        });
      } else if (type == "CHAT_MESSAGE") {
        handlePush({
          name: "ChatList",
          params: {},
        });
      } else if (type == "ReviewAdded") {
        handlePush({
          name: "ReviewDetails",
          params: {
            reviewId: data?.feedback_id,
          },
        });
      } else if (type == "Appointment") {
        store.dispatch(setInitialTab("Appointment"));
        handlePush({
          name: "BottomTab",
          params: {
            screen: "Appointments",
          },
        });
      } else {
        handlePush({
          name: "NotificationList",
          params: {},
        });
      }
    };

    setTimeout(tryNavigate, 300);
  } catch (error) {}
}
