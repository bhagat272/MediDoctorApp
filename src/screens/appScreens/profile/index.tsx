import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import imagePath from "../../../theme/imagePath";
import { AppHeader, Header, ImageLoadView } from "../../../components";
import LogoutModal from "./logoutModal";
import { DEVICE_INFO } from "../../../utils/helper";
import {
  logoutAction,
  profileAction,
} from "../../../redux/actions/userSessionAction";
import { useDispatch, useSelector } from "react-redux";
import { loading } from "../../../redux/reducer/loadingReducer";
import { translateText } from "../../../utils/language";
import { IMAGE_URL } from "../../../redux/apis/commonValue";
import {
  authenticateBiometric,
  isBiometricAvailable,
} from "../../../utils/biometric";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  notificationToggleStatusAction,
  updateBiometricStatusAction,
} from "../../../redux/actions/appSessionAction";

const Profile = (props: any) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: any) => state.session);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    if (userData?.biometric_status !== undefined) {
      setBiometricEnabled(Number(userData.biometric_status) === 1);
    }
  }, [userData?.biometric_status]);

  useEffect(() => {
    if (userData?.notification_permissions !== undefined) {
      setNotificationEnabled(Number(userData.notification_permissions) === 1);
    }
  }, [userData?.notification_permissions]);

  console.log(userData);

  const SettingItem = ({
    icon,
    title,
    onPress,
    rightComponent,
    isLast,
  }: any) => (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.settingItem, isLast && styles.settingItemLast]}
      >
        <View style={styles.iconContainer}>
          <Image
            source={icon}
            resizeMode="contain"
            style={styles.settingIcon}
          />
        </View>
        <Text style={styles.settingText}>{title}</Text>
        {rightComponent}
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );

  const handleBiometricToggle = async () => {
    try {
      const newValue = biometricEnabled ? 0 : 1;

      const payload = {
        biometric_status: newValue,
      };

      dispatch(updateBiometricStatusAction(payload)).then(() => {
        dispatch(profileAction());
      });
    } catch (error) {
      Alert.alert("Failed to update biometric setting");
      console.error("Biometric toggle error:", error);
    }
  };

  const handleNotfication = async () => {
    try {
      const newValue = notificationEnabled ? 0 : 1;

      const payload = {
        notification_permissions: newValue,
      };

      dispatch(notificationToggleStatusAction(payload)).then((res: any) => {
        dispatch(profileAction());
        console.log(res);
      });
    } catch (error) {
      Alert.alert("Failed to update notification setting");
      console.error("notification toggle error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={translateText("settings")}
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Notification Settings */}
        <SettingItem
          icon={imagePath.notification_settings}
          title="Notification Settings"
          rightComponent={
            <TouchableOpacity
              onPress={handleNotfication}
              style={styles.toggleContainer}
            >
              <View
                style={[
                  styles.toggleTrack,
                  notificationEnabled && styles.toggleTrackActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    notificationEnabled && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          }
        />

        {/* Biometric Authentication */}
        <SettingItem
          icon={imagePath.biometric_icon}
          title="Biometric Authentication"
          rightComponent={
            <TouchableOpacity
              onPress={handleBiometricToggle}
              style={styles.toggleContainer}
            >
              <View
                style={[
                  styles.toggleTrack,
                  biometricEnabled && styles.toggleTrackActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    biometricEnabled && styles.toggleThumbActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          }
        />

        {/* Transaction List */}
        <SettingItem
          icon={imagePath.transaction_icon}
          title="Transaction List"
          onPress={() => props.navigation.navigate("TransactionList")}
          rightComponent={
            <Image
              source={imagePath.right_arrow}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          }
        />

        {/* User List */}
        <SettingItem
          icon={imagePath.user_list_icon}
          title="User Medication"
          onPress={() => props.navigation.navigate("UserList")}
          rightComponent={
            <Image
              source={imagePath.right_arrow}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          }
        />

        {/* Chat */}
        <SettingItem
          icon={imagePath.chat_icon}
          title="Chat"
          onPress={() => props.navigation.navigate("ChatList")}
          rightComponent={
            <Image
              source={imagePath.right_arrow}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          }
        />

        {/* Change Password */}
        <SettingItem
          icon={imagePath.lock_icon}
          title="Change Password"
          onPress={() => props.navigation.navigate("ChangePassword")}
          rightComponent={
            <Image
              source={imagePath.right_arrow}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          }
        />

        {/* Help & Support */}
        <SettingItem
          icon={imagePath.help_icon}
          title="Help & Support"
          onPress={() => props.navigation.navigate("HelpSupport")}
          rightComponent={
            <Image
              source={imagePath.right_arrow}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          }
        />

        {/* Terms & Conditions */}
        <SettingItem
          icon={imagePath.terms_icon}
          title="Terms & Conditions"
          onPress={() => {
            props.navigation.navigate("CmsScreen", {
              title: "Terms & Conditions",
            });
          }}
          rightComponent={
            <Image
              source={imagePath.right_arrow}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          }
        />

        {/* Privacy Policy */}
        <SettingItem
          icon={imagePath.privacy_policy_icon}
          title="Privacy Policy"
          onPress={() => {
            props.navigation.navigate("CmsScreen", {
              title: "Privacy Policy",
            });
          }}
          rightComponent={
            <Image
              source={imagePath.right_arrow}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          }
        />

        {/* Delete Account */}
        <SettingItem
          icon={imagePath.delete_icon}
          title="Delete Account"
          onPress={() => props.navigation.navigate("DeleteAccount")}
          rightComponent={
            <Image
              source={imagePath.right_arrow}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          }
        />

        {/* Logout */}
        <SettingItem
          icon={imagePath.logout_icon}
          title="Logout"
          onPress={() => setShowLogoutModal(true)}
          rightComponent={
            <Image
              source={imagePath.right_arrow}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          }
          isLast={true}
        />
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        onConfirm={() => {
          setShowLogoutModal(false);
          setTimeout(() => {
            const dic = { ...DEVICE_INFO };
            dispatch(loading(true));
            dispatch(logoutAction(dic));
          }, 100);
        }}
        onCancel={() => {
          setShowLogoutModal(false);
        }}
      />
    </View>
  );
};

export default Profile;
