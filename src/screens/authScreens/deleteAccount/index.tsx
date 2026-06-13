import { View, Text, Image, Keyboard, BackHandler } from "react-native";
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
import { deleteAccountAction } from "../../../redux/actions/userSessionAction";
import { loading } from "../../../redux/reducer/loadingReducer";
import { translateText } from "../../../utils/language";
import { useHeaderHeight } from "@react-navigation/elements";

const DeleteAccount = (props: any) => {
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();
  const { buttonLoader } = useSelector((state: any) => state.loading);
  const [securePassword, setSecurePassword] = useState(true);
  const [deleteAccountForm, setDeleteAccountForm] = useState({
    password: "",
    validators: {
      password: {
        required: true,
        password: true,
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

  const methodSetupDeleteAccountForm = (key: string, value: string): void => {
    let dic: any = { ...deleteAccountForm };
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    );
    if (key == "password") {
      value = value.replace(/\s/g, "");
    }
    dic[key] = value;
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = "";
    }
    setDeleteAccountForm(dic);
  };

  const methodDeleteAccount = () => {
    Keyboard.dismiss();
    const validForm: ValidateFormType = ValidateForm(deleteAccountForm);
    setDeleteAccountForm({ ...deleteAccountForm });

    if (validForm.status) {
      const request: any = { ...deleteAccountForm };
      delete request.validators;
      dispatch(loading(true));
      dispatch(deleteAccountAction(request));
    }
  };

  return (
    <View
      pointerEvents={buttonLoader ? "none" : "auto"}
      style={styles.container}
    >
      <Header
        title={translateText("delete_account")}
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
          {translateText("enter_your_password")}
          {"\n"}
          {translateText("to_delete_your_account")}
        </Text>
        <AppInput
          placeholder={translateText("password")}
          inputLeftImage={imagePath.password}
          inputRightImage={
            securePassword ? imagePath.eye_on : imagePath.eye_off
          }
          onPressRight={() => {
            setSecurePassword(!securePassword);
          }}
          onChangeText={(value) => {
            methodSetupDeleteAccountForm("password", value);
          }}
          secureTextEntry={securePassword}
          value={deleteAccountForm?.password}
          errorMsg={deleteAccountForm?.validators?.password?.error}
          maxLength={maxLengthPassword}
          returnKeyType={"done"}
        />
      </KeyboardScroll>

      {keyboardStatus ? (
        <></>
      ) : (
        <AppButton
          title={translateText("delete_account")}
          onPress={() => {
            methodDeleteAccount();
          }}
          isLoading={buttonLoader}
        />
      )}
    </View>
  );
};

export default DeleteAccount;
