import { showErrorMessage } from "../../utils/helper";
import { showToastMessage } from "../../utils/toast";
import { get, post } from "../apis/apiHelper";
import { JSON_HEADER, MULTI_PART_HEADER } from "../apis/commonValue";
import { APP_SESSION_API } from "../apis/endpoints";
import { loading } from "../reducer/loadingReducer";

export function chatMediaUploadAction(request: any): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.upload_chat_media,
        data: request,
        header: MULTI_PART_HEADER,
      });
      if (response && response?.status) {
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      console.log("error----", error);

      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function userListForChatAction(): any {
  return async (dispatch: any) => {
    try {
      const response = await get({
        url: APP_SESSION_API?.user_list,
        header: JSON_HEADER,
        data: {},
      });
      if (response && response?.status) {
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}
export function createGroupAction(request: any): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.create_group,
        header: MULTI_PART_HEADER,
        data: request,
      });
      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function updateBiometricStatusAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_biometric_status,
        header: MULTI_PART_HEADER,
        data: request,
      });
      dispatch(loading(false));

      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loading(false));
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function appointMentDetailsAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_appointment_details,
        header: MULTI_PART_HEADER,
        data: request,
      });
      dispatch(loading(false));
      console.log("------doctors_appointment_details------->", response);
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loading(false));
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function allAppointmentsByDateAction(request: any): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_appointment_list,
        header: MULTI_PART_HEADER,
        data: request,
      });
      console.log("allAppointmentsByDateAction", response);
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response?.data);
      } else {
        // showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function confirmAppointmentAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_respond_appointment,
        header: MULTI_PART_HEADER,
        data: request,
      });
      dispatch(loading(false));
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response?.data);
      } else {
        // showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function manageAvailabilityAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_add_available_slot,
        header: MULTI_PART_HEADER,
        data: request,
      });
      console.log("manageAvailabilityAction_response------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, "danger");
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function manageUnAvailabilityAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_add_unavailable_slot,
        header: MULTI_PART_HEADER,
        data: request,
      });
      console.log("manageunAvailabilityAction_response------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, "danger");
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function showAvailabilityAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_show_available_slot,
        header: MULTI_PART_HEADER,
        data: request,
      });
      console.log("doctors_show_available_slot------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        // showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function showUnavailabilityAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_show_unavailable_slot,
        header: MULTI_PART_HEADER,
        data: request,
      });
      console.log("doctors_show_available_slot------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        // showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function deleteAvailabilityAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_delete_available_slot,
        header: MULTI_PART_HEADER,
        data: request,
      });
      console.log("deleteAvailabilityAction_response------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function deleteUnavailabilityAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_delete_unavailable_slot,
        header: MULTI_PART_HEADER,
        data: request,
      });
      console.log("deleteUnavailabilityAction_response------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function stripeConnectAction(request: any): any {
  return async (dispatch: any) => {
    console.log(request, "request in stripeConnectAction");
    dispatch(loading(true));
    try {
      const response = await get({
        url: APP_SESSION_API?.doctors_stripe_connect,
        header: MULTI_PART_HEADER,
        data: request,
      });
      console.log("stripeConnectAction_response------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function helpAndSupportAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_help_and_support,
        header: MULTI_PART_HEADER,
        data: request,
      });
      console.log("helpAndSupportAction_response------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function reviewListAction(request: any): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.api_doctors_all_review,
        header: MULTI_PART_HEADER,
        data: request,
      });

      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function getUserListAction(request: any): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.medi_user_list,
        header: MULTI_PART_HEADER,
        data: request,
      });

      console.log("getmediUserListAction_response------->", response);

      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function fetchReviewByIdAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.review_details,
        header: MULTI_PART_HEADER,
        data: request,
      });
      dispatch(loading(false));
      console.log("fetchReviewByIdAction_response------->", response);

      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function replyReviewAction(request: any): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.reply_review,
        header: JSON_HEADER,
        data: request,
      });
      console.log("replyreview_response------->", response);

      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function fetchUserMedicationDetailAction(request: any): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_user_medication_detail,
        header: JSON_HEADER,
        data: request,
      });
      console.log("doctors_user_medication_detail------->", response);

      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function transactionsListAction(request: any): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_get_wallet_history,
        header: MULTI_PART_HEADER,
        data: request,
      });
      console.log("transactionsListAction_response------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, "danger");
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function notificationToggleStatusAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_notification_status,
        header: MULTI_PART_HEADER,
        data: request,
      });
      dispatch(loading(false));
      console.log("notificaiton-====>", response);
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loading(false));
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function notificationListAction(request: any): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.doctors_notification_list,
        header: JSON_HEADER,
        data: request,
      });
      console.log("notificationsListAction_response------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, "danger");
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function deleteNotificationListAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctor_delete_notification_list,
        header: JSON_HEADER,
        data: request,
      });
      console.log("deleteNotification------->", response);
      dispatch(loading(false));
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, "danger");
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function reportUserAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.doctor_add_report,
        header: JSON_HEADER,
        data: JSON.stringify(request),
      });
      dispatch(loading(false));

      if (response && response?.status) {
        console.log(response?.message);
        showToastMessage(response?.message, "success");
        console.log("Report log---------->", response);

        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, "danger");
        return Promise.resolve(false);
      }
    } catch (error) {
      console.log("error----", error);

      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}
