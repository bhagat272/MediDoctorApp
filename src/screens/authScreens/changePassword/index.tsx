import {
  View,
  Text,
  TextInput,
  Keyboard,
  Image,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles";
import {
  AppButton,
  AppHeader,
  AppInput,
  Header,
  KeyboardScroll,
} from "../../../components";
import imagePath from "../../../theme/imagePath";
import { useDispatch, useSelector } from "react-redux";
import { ValidateFormType } from "../../../utils/helper";
import { maxLengthPassword, ValidateForm } from "../../../utils/validation";
import { changePasswordAction } from "../../../redux/actions/userSessionAction";
import { buttonLoading } from "../../../redux/reducer/loadingReducer";
import { translateText } from "../../../utils/language";
import { useHeaderHeight } from "@react-navigation/elements";

const ChangePassword = (props: any) => {
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();
  const { buttonLoader } = useSelector((state: any) => state.loading);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [securePasswordOld, setSecurePasswordOld] = useState(true);
  const [securePassword, setSecurePassword] = useState(true);
  const [securePasswordConfirm, setSecurePasswordConfirm] = useState(true);

  const [changePasswordReq, setChangePasswordReq] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    validators: {
      current_password: {
        required: true,

        error: "",
      },
      new_password: {
        required: true,
        password: true,
        error: "",
      },
      confirm_password: {
        required: true,
        matchWith: "new_password",
        error: "",
      },
    },
  });

  const [keyboardStatus, setKeyboardStatus] = useState<number | boolean>(false);

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

  const methodSetupChangePassword = (key: string, value: string): void => {
    let dic: any = { ...changePasswordReq };
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    );
    if (
      key == "current_password" ||
      key == "new_password" ||
      key == "confirm_password"
    ) {
      value = value.replace(/\s/g, "");
    }
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = "";
    }
    setChangePasswordReq(dic);
  };

  const methodChangePassword = () => {
    Keyboard.dismiss();
    const validForm: ValidateFormType = ValidateForm(changePasswordReq);
    setChangePasswordReq({ ...changePasswordReq });
    if (validForm.status) {
      const request: any = { ...changePasswordReq };
      delete request.validators;
      dispatch(buttonLoading(true));
      // console.log("request>>",request);
      // return
      let json = {
        old_password: request.current_password,
        password: request.new_password,
        // confirm_password: request.confirm_password,
      };
      dispatch(changePasswordAction(json)).then((res: boolean) => {
        dispatch(buttonLoading(false));
        if (res) {
          props.navigation.goBack();
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
        title={translateText("change_password")}
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />
      <KeyboardScroll>
        <Image
          source={imagePath.logo}
          resizeMode={"contain"}
          style={styles.logo_image}
        />

        <Text style={styles.enter_details_text}>
          {translateText("set_a_new_password_for")}
          {"\n"}
          {translateText("your_account")}.
        </Text>

        <AppInput
          placeholder={translateText("current_password")}
          value={changePasswordReq?.current_password}
          inputLeftImage={imagePath.password}
          inputRightImage={
            securePasswordOld ? imagePath.eye_on : imagePath.eye_off
          }
          secureTextEntry={securePasswordOld}
          onPressRight={() => {
            setSecurePasswordOld(!securePasswordOld);
          }}
          onChangeText={(value) => {
            methodSetupChangePassword("current_password", value);
          }}
          errorMsg={changePasswordReq?.validators?.current_password?.error}
          maxLength={maxLengthPassword}
          returnKeyType={"next"}
          setFocus={() => {
            if (passwordRef?.current) {
              passwordRef?.current?.focus();
            }
          }}
        />

        <AppInput
          placeholder={translateText("new_password")}
          value={changePasswordReq?.new_password}
          inputLeftImage={imagePath.password}
          inputRightImage={
            securePassword ? imagePath.eye_on : imagePath.eye_off
          }
          secureTextEntry={securePassword}
          onPressRight={() => {
            setSecurePassword(!securePassword);
          }}
          onChangeText={(value) => {
            methodSetupChangePassword("new_password", value);
          }}
          errorMsg={changePasswordReq?.validators?.new_password?.error}
          maxLength={maxLengthPassword}
          returnKeyType={"next"}
          getFocus={passwordRef}
          setFocus={() => {
            confirmPasswordRef?.current?.focus();
          }}
        />

        <AppInput
          placeholder={translateText("confirm_password")}
          value={changePasswordReq?.confirm_password}
          inputLeftImage={imagePath.password}
          inputRightImage={
            securePasswordConfirm ? imagePath.eye_on : imagePath.eye_off
          }
          secureTextEntry={securePasswordConfirm}
          onPressRight={() => {
            setSecurePasswordConfirm(!securePasswordConfirm);
          }}
          onChangeText={(value) => {
            methodSetupChangePassword("confirm_password", value);
          }}
          errorMsg={changePasswordReq?.validators?.confirm_password?.error}
          maxLength={maxLengthPassword}
          getFocus={confirmPasswordRef}
          returnKeyType={"done"}
        />
      </KeyboardScroll>

      {keyboardStatus ? (
        <></>
      ) : (
        <AppButton
          title={translateText("update_password")}
          onPress={() => {
            methodChangePassword();
          }}
          isLoading={buttonLoader}
        />
      )}
    </View>
  );
};

export default ChangePassword;
