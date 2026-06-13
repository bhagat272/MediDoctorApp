import * as React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  View,
  StyleSheet,
  ImageSourcePropType,
  ImageStyle,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors, Fonts } from "../theme";

interface AppPickerButtonProps {
  placeholder?: string;
  value?: string;
  onPress?: () => void;
  leftIcon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  leftIconStyle?: ImageStyle;
  rightIconStyle?: ImageStyle;
  errorMsg?: any;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const AppPickerButton: React.FC<AppPickerButtonProps> = ({
  placeholder,
  value,
  onPress,
  leftIcon,
  rightIcon,
  leftIconStyle,
  rightIconStyle,
  errorMsg,
  containerStyle,
  textStyle,
  disabled = false,
}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}
        style={[
          styles.container,
          containerStyle,
          disabled && styles.disabled,
          errorMsg && styles.error_border,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <Image
            source={leftIcon}
            resizeMode="contain"
            style={[styles.left_icon, leftIconStyle]}
          />
        )}

        {/* Text/Placeholder */}
        <Text
          style={[
            styles.text,
            textStyle,
            {
              color: value ? Colors.primary.BLACK : Colors.secondary.MONSOON,
            },
          ]}
        >
          {value || placeholder}
        </Text>

        {/* Right Icon */}
        {rightIcon && (
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={[styles.right_icon, rightIconStyle]}
          />
        )}
      </TouchableOpacity>

      {/* Error Message */}
      {errorMsg ? <Text style={styles.error_text}>{errorMsg}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary.OFF_WHITE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    minHeight: 56,
    borderWidth: 1,
    height: 70,
    borderColor: Colors.secondary.inputBorderColor,
  },
  disabled: {
    opacity: 0.5,
  },
  error_border: {
    borderWidth: 1,
    borderColor: Colors.primary.RED,
  },
  left_icon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: Colors.secondary.MONSOON,
  },
  text: {
    fontSize: 15,
    fontFamily: Fonts.Poppins_Regular,
    flex: 1,
  },
  right_icon: {
    width: 20,
    height: 20,
    marginLeft: 12,
    tintColor: Colors.primary.BLACK,
  },
  error_text: {
    color: Colors.primary.RED,
    marginHorizontal: 25,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: Fonts.SIZE_12,
    marginTop: -15,
    marginBottom: 20,
  },
});

export default AppPickerButton;
