import { View, Text, Image, Keyboard, BackHandler } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import {
  AppButton,
  AppInput,
  Header,
  KeyboardScroll,
} from "../../../components";
import imagePath from "../../../theme/imagePath";
import { ValidateFormType, DEVICE_INFO } from "../../../utils/helper";
import { maxLengthEmail, ValidateForm } from "../../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordAction } from "../../../redux/actions/userSessionAction";
import { buttonLoading } from "../../../redux/reducer/loadingReducer";
import { translateText } from "../../../utils/language";

const ForgotPassword = (props: any) => {
  const dispatch = useDispatch();
  const { buttonLoader } = useSelector((state: any) => state.loading);
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: "",
    type: "PASSWORD_RESET",
    validators: {
      email: {
        required: true,
        email: true,
        error: "",
        email: true,
      },
    },
  });

  const [keyboardStatus, setKeyboardStatus] = useState<number | boolean>(false);

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

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      hideSubscriptionDid.remove();
    };
  }, []);

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

  const methodSetupForgotPasswordForm = (key: string, value: string): void => {
    let dic: any = { ...forgotPasswordForm };
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    );
    if (key == "email") {
      value = value.replace(/\s/g, "");
    }
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = "";
    }
    setForgotPasswordForm(dic);
  };

  const methodForgotPassword = () => {
    Keyboard.dismiss();
    const validForm: ValidateFormType = ValidateForm(forgotPasswordForm);
    setForgotPasswordForm({ ...forgotPasswordForm });

    if (validForm.status) {
      const request: any = { ...forgotPasswordForm, ...DEVICE_INFO };
      delete request.validators;
      dispatch(buttonLoading(true));
      dispatch(forgotPasswordAction(request)).then((res: boolean) => {
        dispatch(buttonLoading(false));
        if (res) {
          props.navigation.navigate("Verification", {
            from: "forget_password",
            forgetPasswordData: request,
          });
        }
      });
    }
  };

  return (
    <View
      pointerEvents={buttonLoader ? "none" : "auto"}
      style={styles.container}
    >
      <Header
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />
      <KeyboardScroll>
        <Image
          source={imagePath.logo}
          resizeMode={"contain"}
          style={styles.logo_image}
        />
        <Text style={styles.welcome_text}>
          {translateText("forgot_password")}
        </Text>
        <Text style={styles.enter_details_text}>
          {translateText("enter_your_registered_email_address")}
          {"\n"}
          {translateText("to_receive_otp")}
        </Text>
        <AppInput
          value={forgotPasswordForm?.email}
          maxLength={maxLengthEmail}
          placeholder={translateText("email_address")}
          inputLeftImage={imagePath.email_small}
          onChangeText={(value) => {
            methodSetupForgotPasswordForm("email", value);
          }}
          errorMsg={forgotPasswordForm?.validators?.email?.error}
          returnKeyType="next"
          keyboardType="email-address"
        />
      </KeyboardScroll>
      {keyboardStatus ? (
        <></>
      ) : (
        <AppButton
          title={translateText("next")}
          onPress={() => {
            methodForgotPassword();
          }}
          isLoading={buttonLoader}
        />
      )}
    </View>
  );
};

export default ForgotPassword;
