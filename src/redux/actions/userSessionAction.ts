import {
  logout,
  setGlobalUserToken,
  setUserData,
  showErrorMessage,
} from "../../utils/helper";
import { showToastMessage } from "../../utils/toast";
import { Delete, get, post, put } from "../apis/apiHelper";
import {
  JSON_HEADER,
  kUserData,
  kUserToken,
  MULTI_PART_HEADER,
} from "../apis/commonValue";
import { APP_SESSION_API, USER_SESSION_API } from "../apis/endpoints";
import { setData } from "../apis/keyChain";
import { loading } from "../reducer/loadingReducer";
import { userPayload } from "../reducer/userSessionReducer";
import { Dispatch } from "redux";

// export const saveUserData = (response: any, dispatch: Dispatch) => {
//   setData(kUserData, response?.data);
//   setUserData(response?.data);
//   if (response?.data?.jwt_token) {
//     setData(kUserToken, response?.data?.jwt_token);
//     setGlobalUserToken(response?.data?.jwt_token);
//   }

//   dispatch(userPayload(response?.data));
// };
export const saveUserData = (response: any, dispatch: Dispatch) => {
  // Save user object
  setData(kUserData, response?.data);
  setUserData(response?.data);

  // ✅ FIX: token is at ROOT level
  if (response?.token) {
    setData(kUserToken, response.token);
    setGlobalUserToken(response.token);
  }

  dispatch(userPayload(response?.data));
};

export function checkUserAction(request: object): any {
  return async () => {
    try {
      const response = await post({
        url: USER_SESSION_API?.send_otp,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // console.log("response>>",response);

      if (response && response?.success) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(true);
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

export function checkUserEmail(request: object): any {
  return async () => {
    try {
      const response = await post({
        url: USER_SESSION_API?.doctor_check_email,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log("response checkUseremail----->>", response);

      if (response && response?.data) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(true);
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

export function signupAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.register,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log("response signup>>", response);

      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        saveUserData(response, dispatch);
        return Promise.resolve(true);
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

export function loginAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.login,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      console.log("LOGIN RESPONSE >>>", response);

      if (response && response?.status) {
        showToastMessage(response?.message, "success");

        // ✅ PASS FULL RESPONSE
        saveUserData(response, dispatch);

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

export function forgotPasswordAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.forgot_password,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(true);
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

export function verifyOTPAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.verify_otp,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response?.success) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(true);
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
export function forgotVerifyOTPAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.forgot_verification,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(true);
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
export function resetPasswordAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.reset_password,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log("response>>", response);
      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(true);
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

export function profileAction(): any {
  return async (dispatch: any) => {
    try {
      const response = await get({
        url: USER_SESSION_API?.get_profile,
        data: JSON.stringify({}),
        header: JSON_HEADER,
      });
      console.log("profile----->", response);
      if (response && response?.status) {
        saveUserData(response, dispatch);
      } else {
        showToastMessage(response?.message);
      }
    } catch (error) {
      showErrorMessage();
    }
  };
}

export function createEditProfileAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.update_profile,
        data: request,
        header: MULTI_PART_HEADER,
      });
      console.log("response======", response);

      if (response && response?.status) {
        saveUserData(response, dispatch);
        showToastMessage(response?.message, "success");
        return Promise.resolve(true);
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

export function upcomingAppointmentAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.upcoming_appointments,
        data: request,
        header: JSON_HEADER,
      });
      console.log("response==upcomingAppointmentAction====", response);

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

export function pastAppointmentAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: APP_SESSION_API?.past_appointment,
        data: request,
        header: JSON_HEADER,
      });
      console.log("response==pastAppointmentAction====", response);

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

export function changePasswordAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.update_password,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log("response>>", response);

      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        return Promise.resolve(true);
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

export function logoutAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.logout,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      dispatch(loading(false));
      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        logout(true);
        dispatch(userPayload(null));
      } else {
        console.log("response logout else>>", response);
        showToastMessage(response?.message);
      }
    } catch (error) {
      console.log("====logout errror=>", error);
      dispatch(loading(false));
      showErrorMessage();
    }
  };
}

export function deleteAccountAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.delete_account,
        header: JSON_HEADER,
        data: JSON.stringify(request),
      });

      dispatch(loading(false));
      if (response && response?.status) {
        showToastMessage(response?.message, "success");
        logout(true);
        dispatch(userPayload(null));
      } else {
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loading(false));
      showErrorMessage();
    }
  };
}
export function manageProfilePictureAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.manage_profile_picture,
        header: JSON_HEADER,
        data: JSON.stringify(request),
      });

      dispatch(loading(false));
      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        // showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loading(false));
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}

export function getSpecialityEducation(request: object): any {
  return async (dispatch: any) => {
    console.log("request speciality education>>", request);
    try {
      const response = await get({
        url: USER_SESSION_API?.speciality_education,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      dispatch(loading(false));

      if (response && response?.status) {
        // showToastMessage(response?.message, "success");
        return Promise.resolve(response);
      } else {
        console.log("response speciality education else>>", response);
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      console.log("response speciality education error>>", error);
      dispatch(loading(false));
      showErrorMessage();
      return Promise.resolve(false);
    }
  };
}
