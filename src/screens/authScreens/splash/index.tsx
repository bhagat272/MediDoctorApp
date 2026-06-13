import React, { useEffect, useState } from "react";
import {
  methodSecurityEncoded,
  setDefaultValues,
  setGlobalUserToken,
  setUserData,
} from "../../../utils/helper";
import BootSplash from "react-native-bootsplash";
import { getData } from "../../../redux/apis/keyChain";
import { kUserData, kUserToken } from "../../../redux/apis/commonValue";
import {
  methodDetectDeviceLanguage,
  translateLanguage,
} from "../../../utils/language";
import { useDispatch } from "react-redux";
import { userPayload } from "../../../redux/reducer/userSessionReducer";
import { BiometricGuard } from "../../../components/BiometricGuard";

const Splash = (props: any) => {
  const dispatch = useDispatch();
  const [allow, setAllow] = useState(false);
  const userDataRef = React.useRef<any>(null);

  useEffect(() => {
    setLocalData();
  }, []);

  const setLocalData = async () => {
    const userData: any = await getData(kUserData);
    userDataRef.current = userData;

    setDefaultValues(props.navigation);

    const deviceLanguage = methodDetectDeviceLanguage();
    translateLanguage(deviceLanguage);

    if (Number(userData?.biometric_status) === 1) {
      setAllow(true);
    } else {
      setTimeout(() => {
        initialize();
      }, 2000);
    }
  };

  const getNavigationRoute = (userData: any) => {
    // Check if admin hasn't approved yet
    if (userData.admin_approval !== 1) {
      return "Login"; // Or create a "PendingApproval" screen
    }
    // Check if profile is not set up yet
    if (userData.profile_setup !== 1) {
      return "CreateProfile";
    }

    // All checks passed, go to main app
    return "BottomTab";
  };

  const initialize = async () => {
    try {
      const userData = userDataRef.current;

      let token: any = await getData(kUserToken);
      console.log("TOKEN===>", token);
      console.log("USERDATA===>", userData);

      if (token && userData) {
        setGlobalUserToken(token);
        setUserData(userData);
        dispatch(userPayload(userData));

        const route = getNavigationRoute(userData);

        props.navigation.reset({
          index: 0,
          routes: [{ name: route }],
        });
      } else {
        props.navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    } catch (error) {
      console.error("Splash initialization error:", error);
      props.navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }

    BootSplash.hide({ fade: true });
  };

  if (allow) {
    return (
      <BiometricGuard
        allow={true}
        onAutenticated={initialize}
        children={undefined}
      />
    );
  }

  return null;
};

export default Splash;
