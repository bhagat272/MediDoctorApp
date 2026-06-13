import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  TextInputProps,
  TextInput,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles";
import imagePath from "../../../theme/imagePath";
import { AppButton, AppInput } from "../../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  maxLengthEmail,
  maxLengthMobile,
  maxLengthPassword,
  ValidateForm,
} from "../../../utils/validation";
import {
  checkUserAction,
  checkUserEmail,
} from "../../../redux/actions/userSessionAction";
import { useDispatch, useSelector } from "react-redux";
import { ValidateFormType } from "../../../utils/helper";
import { buttonLoading } from "../../../redux/reducer/loadingReducer";
import { translateText } from "../../../utils/language";
import CountryPicker from "../../../utils/countryPicker";
import { showToastMessage } from "../../../utils/toast";

// Define the interface for the signup request data
interface SignupRequest {
  // register_type: string;
  email: string;
  // mobile_number: string;
  country_code: string;
  password: string;
  confirm_password: string;
  type: string;
  validators?: {
    email: {
      required: boolean;
      email: boolean;
      error: string;
    };
    // mobile_number: {
    //   required: boolean;
    //   numeric: boolean;
    //   minLength: number;
    //   error: string;
    // };
    password: {
      required: boolean;
      password: boolean;
      error: string;
    };
    confirm_password: {
      required: boolean;
      matchWith: string;
      error: string;
    };
  };
}

/**
 * Signup Component
 *
 * This component allows a new user to sign up by providing their email,
 * mobile number, and password information. It also includes country code
 * selection via a country picker modal, form validation, and navigation.
 */
const Signup = (props: any) => {
  const dispatch = useDispatch();
  // Get the loading state from Redux to disable interactions when processing.
  const { buttonLoader } = useSelector((state: any) => state.loading);

  // Reference to the keyboard aware scroll view for controlling scroll behavior.
  const keyboardRef = useRef<KeyboardAwareScrollView>(null);
  // Reference to the mobile number input for setting focus.
  const phoneRef = useRef<TextInput>(null);
  // Reference to the password input for setting focus.
  const passwordRef = useRef<TextInput>(null);
  // Reference to the confirm password input for setting focus.
  const confirmPasswordRef = useRef<TextInput>(null);
  const [agreeData, setAgreeData] = useState(false);
  // State to manage secure text entry for password field (show/hide password).
  const [securePassword, setSecurePassword] = useState(true);
  // State to manage secure text entry for confirm password field.
  const [securePasswordConfirm, setSecurePasswordConfirm] = useState(true);
  // State to control the visibility of the country code modal.
  const [modalVisibleCode, setModalVisibleCode] = useState(false);

  // Initial signup form state including validators for each required field.
  const [signupForm, setSignupForm] = useState<SignupRequest>({
    // register_type: 'email', // email / mobile
    email: "",
    // mobile_number: "",
    country_code: "+1", // Default country code
    password: "",
    type: "EMAIL_VERIFICATION",
    confirm_password: "",
    validators: {
      email: {
        required: true,
        email: true,
        error: "",
      },
      // mobile_number: {
      //   required: true,
      //   numeric: true,
      //   minLength: 7,
      //   error: "",
      // },
      password: {
        required: true,
        password: true,
        error: "",
      },
      confirm_password: {
        required: true,
        matchWith: "password", // Confirm password must match 'password'
        error: "",
      },
    },
  });

  // Prevent the hardware back button from interfering when a button action is in progress.
  useEffect(() => {
    if (buttonLoader) {
      const handleBackButtonClick = () => {
        return true;
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

  /**
   * Updates the signup form state for a given field.
   *
   * @param key - The key in the signup form (e.g., 'email', 'mobile_number', etc.).
   * @param value - The new value for that field.
   *
   * Removes unwanted characters such as emojis and spaces from certain fields.
   * Also ensures that the mobile number contains only numeric values.
   */
  const methodSetupSignupForm = (key: string, value: string): void => {
    let dic: any = { ...signupForm };
    // Remove emojis and certain special characters from the value.
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    );
    // For email, password, confirm password, and mobile number, remove spaces.
    if (
      key == "email" ||
      key == "password" ||
      key == "confirm_password"
      // key == "mobile_number"
    ) {
      value = value.replace(/\s/g, "");
    }
    // For mobile number, ensure only numeric values are allowed.
    // if (key == "mobile_number") {
    //   value = value.replace(/[^0-9]/g, "");
    // }
    // Update the form state with the new value.
    dic[key] = value;
    // Clear any existing error for this field.
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = "";
    }
    setSignupForm(dic);
  };

  /**
   * Handles the signup action.
   *
   * Dismisses the keyboard, validates the signup form, and if valid,
   * dispatches the checkUserAction to verify the user details.
   * Upon successful validation, navigates to the Verification screen with the request data.
   */
  const methodSignup = () => {
    Keyboard.dismiss();
    const validForm: ValidateFormType = ValidateForm(signupForm);

    setSignupForm({ ...signupForm });
    if (validForm.status) {
      if (!agreeData) {
        showToastMessage(
          "Please agree with Privacy Policy and Terms & Conditions",
        );
        return;
      }
      // Create a request object from the signup form (excluding validators).
      const request: SignupRequest = { ...signupForm };
      // console.log("request>>>>>",request);
      // return
      delete request.validators;
      // Dispatch loading state and checkUserAction.
      dispatch(buttonLoading(true));
      dispatch(checkUserEmail(request)).then((res: boolean) => {
        console.log("res>>>>>>>", res);

        dispatch(buttonLoading(false));
        if (res) {
          // Navigate to the Verification screen and pass the signup request data.
          props.navigation.navigate("Verification", {
            signupReqData: request,
            from: "SIGNUP",
          });
        }
      });
    }
  };

  /**
   * Sets the selected country code from the CountryPicker.
   *
   * @param code - The selected country code object.
   */
  const methodSetCountryCode = (code: any) => {
    methodSetupSignupForm("country_code", code.dial_code);
    setModalVisibleCode(false);
  };

  return (
    // Disable touch interactions when a process (like a button click) is in progress.
    <View
      pointerEvents={buttonLoader ? "none" : "auto"}
      style={styles.container}
    >
      <KeyboardAwareScrollView
        ref={keyboardRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
        bounces={false}
        enableAutomaticScroll={true}
      >
        {/* App Logo */}
        <Image
          source={imagePath.logo}
          resizeMode={"contain"}
          style={styles.logo_image}
        />
        {/* Signup Title */}
        <Text style={styles.welcome_text}>{translateText("sign_up")}</Text>
        {/* Instruction Text */}
        <Text style={styles.enter_details_text}>
          {translateText("enter_your_details_to_create")}
          {"\n"}
          {translateText("your_account")}
        </Text>

        {/* Email Input Field */}
        <AppInput
          value={signupForm?.email}
          // label={translateText("email_address")}
          maxLength={maxLengthEmail}
          placeholder={translateText("email_address")}
          inputLeftImage={imagePath.email_small}
          onChangeText={(value) => {
            methodSetupSignupForm("email", value);
          }}
          errorMsg={signupForm?.validators?.email?.error}
          returnKeyType="next"
          setFocus={() => {
            // After entering the email, focus on the mobile number field.
            if (phoneRef?.current) {
              phoneRef?.current?.focus();
            }
          }}
          keyboardType="email-address"
        />

        {/* Mobile Number Input Field with Country Code 
        <AppInput
          placeholder={translateText("enter_mobile_number")}
          inputLeftImage={imagePath.phone} // You can change the icon as needed.
          keyboardType={"numeric"}
          returnKeyType={"next"}
          value={signupForm?.mobile_number}
          onChangeText={(value) => {
            methodSetupSignupForm("mobile_number", value);
          }}
          getFocus={phoneRef}
          setFocus={() => {
            // After mobile number, focus on the password field.
            if (passwordRef?.current) {
              passwordRef?.current?.focus();
            }
          }}
          maxLength={maxLengthMobile}
          // When the country code area is pressed, show the country picker modal.
          onPressCountryCode={() => {
            setModalVisibleCode(true);
          }}
          errorMsg={signupForm?.validators?.mobile_number?.error}
          country_code={signupForm?.country_code}
        />
*/}
        {/* Password Input Field */}
        <AppInput
          getFocus={passwordRef}
          placeholder={translateText("password")}
          // label={translateText("password")}
          value={signupForm?.password}
          maxLength={maxLengthPassword}
          inputLeftImage={imagePath.password}
          secureTextEntry={securePassword}
          // Toggle the visibility icon for password.
          inputRightImage={
            securePassword ? imagePath.eye_on : imagePath.eye_off
          }
          onPressRight={() => {
            setSecurePassword(!securePassword);
          }}
          leftImageStyle={styles.password_icon_style}
          onChangeText={(value) => {
            methodSetupSignupForm("password", value);
          }}
          errorMsg={signupForm?.validators?.password?.error}
          returnKeyType="next"
          setFocus={() => {
            // After password, focus on the confirm password field.
            if (confirmPasswordRef?.current) {
              confirmPasswordRef?.current?.focus();
            }
          }}
        />

        {/* Confirm Password Input Field */}
        <AppInput
          getFocus={confirmPasswordRef}
          maxLength={maxLengthPassword}
          // label={translateText("confirm_password")}
          placeholder={translateText("confirm_password")}
          inputLeftImage={imagePath.password}
          secureTextEntry={securePasswordConfirm}
          // Toggle the visibility icon for confirm password.
          inputRightImage={
            securePasswordConfirm ? imagePath.eye_on : imagePath.eye_off
          }
          onPressRight={() => {
            setSecurePasswordConfirm(!securePasswordConfirm);
          }}
          value={signupForm?.confirm_password}
          leftImageStyle={styles.password_icon_style}
          onChangeText={(value) => {
            methodSetupSignupForm("confirm_password", value);
          }}
          errorMsg={signupForm?.validators?.confirm_password?.error}
          returnKeyType="done"
        />

        {/* Privacy Policy and Terms & Conditions */}
        <View style={styles.check_view}>
          <TouchableOpacity
            onPress={() => {
              if (!buttonLoader) {
                setAgreeData(!agreeData);
              }
            }}
          >
            <Image
              resizeMode="contain"
              source={agreeData ? imagePath.check : imagePath.uncheck}
              style={styles.check_image}
            />
          </TouchableOpacity>

          <Text style={styles.privacy_policy_text}>
            {translateText("i_agree_with")}{" "}
            <Text
              onPress={() => {
                // Navigate to the Privacy Policy screen.
                props.navigation.navigate("CmsScreen", {
                  title: "Privacy Policy",
                });
              }}
              style={styles.privacy_policy_touchable_text}
            >
              {translateText("privacy_policy")}
            </Text>{" "}
            &{" "}
            <Text
              onPress={() => {
                // Navigate to the Terms & Conditions screen.
                props.navigation.navigate("CmsScreen", {
                  title: "Terms & Conditions",
                });
              }}
              style={styles.privacy_policy_touchable_text}
            >
              {translateText("terms_&_conditions")}
            </Text>
          </Text>
        </View>

        {/* Signup Button */}
        <AppButton
          title={translateText("sign_up")}
          onPress={() => {
            methodSignup();
          }}
          isLoading={buttonLoader}
        />

        {/* Link to navigate back if the user already has an account */}
        <Text
          onPress={() => {
            props.navigation.goBack();
          }}
          style={styles.dont_have_acc_text}
        >
          {translateText("have_an_account")}?{" "}
          <Text style={styles.sign_up_text}>{translateText("login")}</Text>
        </Text>

        {/* Country Picker Modal for selecting the country code */}
        <CountryPicker
          show={modalVisibleCode}
          closeModal={() => setModalVisibleCode(false)}
          onSelect={(value: object) => methodSetCountryCode(value)}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Signup;
