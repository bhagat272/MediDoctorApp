import { View, Text, Image, Keyboard, BackHandler } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles";
import { AppButton, Header, KeyboardScroll } from "../../../components";
import imagePath from "../../../theme/imagePath";
import BackgroundTimer from "react-native-background-timer";
import OTPTextView from "react-native-otp-textinput";
import { showToastMessage } from "../../../utils/toast";
import { DEVICE_INFO } from "../../../utils/helper";
import {
  checkUserAction,
  checkUserEmail,
  forgotPasswordAction,
  forgotVerifyOTPAction,
  signupAction,
  verifyOTPAction,
} from "../../../redux/actions/userSessionAction";
import { useDispatch, useSelector } from "react-redux";
import { buttonLoading } from "../../../redux/reducer/loadingReducer";
import { translateText } from "../../../utils/language";
// import { getFCMToken } from '../../../components/notificationPermissions';

/**
 * Verification Component
 *
 * This component handles OTP (One Time Password) verification for different scenarios,
 * such as user signup or password reset (forget password).
 * It displays a countdown timer for OTP resend, verifies the entered OTP,
 * and dispatches appropriate Redux actions based on the context.
 */
const Verification = (props: any) => {
  const dispatch = useDispatch();
  // Get loading state from Redux to disable UI interaction during API calls.
  const { buttonLoader } = useSelector((state: any) => state.loading);
  // Reference to the OTPTextView component to control its behavior (e.g., clear inputs).
  const otpInput = useRef<any>(null);
  // State to store the OTP entered by the user.
  const [otp, setOtp] = useState("");
  // State to handle the countdown for OTP resend.
  const [counter, setCounter] = useState(30);
  // Extract parameters from navigation route. They can contain data for signup, forget password, etc.
  const { signupReqData, from, forgetPasswordData } = props?.route?.params
    ? props?.route?.params
    : false;
  // State to track keyboard visibility; used to conditionally render the verification button.
  const [keyboardStatus, setKeyboardStatus] = useState<number | boolean>(false);

  // Countdown timer: decreases the counter every second and stops when it reaches 0.
  useEffect(() => {
    // Set an interval timer using BackgroundTimer to update the counter.
    let interval = BackgroundTimer.setInterval(() => {
      if (counter <= 0) {
        // When counter reaches 0, clear and stop the timer.
        BackgroundTimer.clearInterval(interval);
        BackgroundTimer.stop();
      } else {
        // Otherwise, decrement the counter.
        setCounter(counter - 1);
      }
    }, 1000);
    // Cleanup: clear the interval and stop the timer when the component unmounts.
    return () => {
      BackgroundTimer.clearInterval(interval);
      BackgroundTimer.stop();
    };
  }, [counter]);

  console.log(from, "fromfromfromfrom");

  // Prevent hardware back button press when a button action (like OTP submission) is in progress.
  useEffect(() => {
    if (buttonLoader) {
      const handleBackButtonClick = () => {
        return true; // Disable default back action.
      };
      let backEvent = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButtonClick,
      );
      return () => {
        backEvent.remove();
      };
    }
  }, [buttonLoader]);

  // Listen for keyboard events to update the keyboardStatus state.
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardStatus(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardStatus(0);
    });
    const hideSubscriptionDid = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(0);
    });

    // Cleanup listeners on unmount.
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      hideSubscriptionDid.remove();
    };
  }, []);

  /**
   * Resets the OTP input and counter.
   * Also triggers a resend of OTP based on the context (forget password vs signup).
   */
  const methodResetOtp = () => {
    // Reset the counter back to 30 seconds.
    setCounter(30);
    // Clear the OTP input field.
    otpInput?.current?.clear();

    // Depending on the context, trigger the resend OTP action.
    if (from === "forget_password") {
      // For password reset, dispatch forgotPasswordAction with provided data.
      const request = { ...forgetPasswordData };
      dispatch(forgotPasswordAction(request)).then((res: boolean) => {
        // You can optionally handle the response here.
      });
    } else if (from === "SIGNUP") {
      // For signup scenario, dispatch checkUserAction with signup data.
      const request = { ...signupReqData };
      dispatch(checkUserEmail(request)).then((res: boolean) => {
        // You can optionally handle the response here.
      });
    } else {
      // For signup scenario, dispatch checkUserAction with signup data.
      const request = { ...signupReqData, useName: "" };
      dispatch(checkUserAction(request)).then((res: boolean) => {
        // You can optionally handle the response here.
      });
    }
  };

  /**
   * Submits the OTP for verification during signup.
   *
   * Performs simple validation to ensure OTP is numeric and exactly 6 digits,
   * then dispatches the signup action with the OTP and additional device information.
   */
  const methodSubmitVerification = async () => {
    Keyboard.dismiss(); // Dismiss the keyboard before submission.
    // Check if OTP field is empty.
    if (otp === "") {
      showToastMessage(translateText("please_enter_otp"));
      return;
    }
    // Validate that OTP contains only numeric values.
    let RegExp = /^\d+$/;
    if (!RegExp.test(otp)) {
      showToastMessage(translateText("please_enter_only_numeric_values"));
      return;
    }
    // Ensure the OTP length is exactly 6 digits.
    if (otp.length !== 6) {
      showToastMessage(translateText("please_enter_valid_otp"));
      return;
    }

    // Prepare the request object by merging signup data with device info.
    const dic = { ...signupReqData, ...DEVICE_INFO };
    dic.otp = otp; // Add the entered OTP to the request.
    // Dispatch loading state and submit the OTP via the signup action.
    // let deviceDic = {...DEVICE_INFO};
    // let token: any = await getFCMToken();
    // if (!token) {
    //   deviceDic.device_token = 'simulator';
    // } else {
    //   deviceDic.device_token = token;
    // }
    // Object.assign(DEVICE_INFO, deviceDic);
    dispatch(buttonLoading(true));
    dispatch(signupAction(dic)).then((res: boolean) => {
      dispatch(buttonLoading(false));
      if (res) {
        // On successful verification, navigate to the CreateProfile screen.
        props.navigation.reset({
          index: 0,
          routes: [{ name: "CreateProfile" }],
        });
      }
    });
  };

  /**
   * Submits the OTP for verification during the forget password flow.
   *
   * Performs validation on the OTP input and then dispatches verifyOTPAction.
   * Upon successful verification, navigates the user to the ResetPassword screen.
   */

  const methodSubmitForgetVerification = () => {
    Keyboard.dismiss(); // Dismiss the keyboard.
    // Check if OTP field is empty.
    if (otp === "") {
      showToastMessage(translateText("please_enter_otp"));
      return;
    }
    // Validate OTP contains only numeric values.
    let RegExp = /^\d+$/;
    if (!RegExp.test(otp)) {
      showToastMessage(translateText("please_enter_only_numeric_values"));
      return;
    }
    // Ensure the OTP length is 6 digits.
    if (otp.length !== 6) {
      showToastMessage(translateText("please_enter_valid_otp"));
      return false;
    }
    // Prepare the request object using the forget password data.
    const dic = { ...forgetPasswordData };
    dic.otp = otp; // Add OTP to the request.

    // Dispatch loading state and verify OTP.
    dispatch(buttonLoading(true));
    dispatch(forgotVerifyOTPAction(dic)).then((res: any) => {
      console.log("res>>", res);

      dispatch(buttonLoading(false));
      if (res) {
        // On success, navigate to the ResetPassword screen.
        props.navigation.navigate("ResetPassword", {
          from: from,
          forgetPasswordData: forgetPasswordData,
          otp,
          resetToken: res?.data?.reset_token,
        });
      } else {
        // If verification fails, clear the OTP input field.
        otpInput?.current?.clear();
      }
    });
  };
  /**
   * Returns a partially masked email address.
   *
   * Masks the local-part of the email by replacing it with ● characters,
   * while leaving the domain intact. This is useful for displaying a hint to the user.
   */
  const methodShowPartialEmail = () => {
    let emailString = "";
    let emailStr = "";

    // Check the context to determine which email to use.
    if (from === "forget_password") {
      emailStr = forgetPasswordData?.email;
      // Get the domain part of the email.
      emailString = forgetPasswordData?.email?.substring(
        forgetPasswordData?.email?.indexOf("@"),
        forgetPasswordData?.email?.length,
      );
    } else {
      emailStr = signupReqData?.email;
      emailString = signupReqData?.email?.substring(
        signupReqData?.email?.indexOf("@"),
        signupReqData?.email?.length,
      );
    }
    // Mask the local-part of the email with ● symbols.
    let convertedStr = emailString?.padStart(emailStr?.length, "●");

    return convertedStr;
  };

  return (
    // Disable user interaction when a button action is loading.
    <View
      pointerEvents={buttonLoader ? "none" : "auto"}
      style={styles.container}
    >
      <Header
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />

      {/* KeyboardScroll is a custom component that allows scrolling when the keyboard is open */}
      <KeyboardScroll>
        {/* App Logo */}
        <Image
          source={imagePath.logo}
          resizeMode={"contain"}
          style={styles.logo_image}
        />
        {/* Screen Title */}
        <Text style={styles.welcome_text}>
          {translateText("otp_verification")}
        </Text>
        {/* Instruction Text showing masked email */}
        <Text style={styles.enter_details_text}>
          {translateText("6_digit_verification_code")}
          {"\n"}
          {translateText("was_just_sent_to")} {methodShowPartialEmail()}
        </Text>

        {/* OTP Input Field */}
        <View style={{ alignSelf: "center" }}>
          <OTPTextView
            ref={otpInput}
            handleTextChange={(text: string) => {
              setOtp(text);
            }}
            inputCount={6}
            keyboardType="numeric"
            tintColor={"#F5F5F5"}
            offTintColor={"#F5F5F5"}
            textInputStyle={styles.otp_text_input}
            returnKeyType="next"
          />
        </View>

        {/* Display counter for OTP resend or provide a clickable "Resend OTP" text when timer expires */}
        {counter ? (
          <Text style={styles.resend_text}>
            {translateText("resend_in")} : {counter} {translateText("sec")}
          </Text>
        ) : (
          <Text
            style={[styles.resend_button_text]}
            onPress={() => {
              methodResetOtp();
            }}
          >
            {translateText("resend_otp")}
          </Text>
        )}
      </KeyboardScroll>
      {/* Render the Verify button only when the keyboard is not visible */}
      {keyboardStatus ? (
        <></>
      ) : (
        <AppButton
          title={translateText("verify")}
          onPress={() => {
            // Depending on the context, call the appropriate verification method.
            if (from === "forget_password") {
              methodSubmitForgetVerification();
            } else {
              methodSubmitVerification();
            }
          }}
          isLoading={buttonLoader}
        />
      )}
    </View>
  );
};

export default Verification;
