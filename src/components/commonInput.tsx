import React from "react";
import {
  Text,
  StyleSheet,
  TextInputProps,
  View,
  TextInput,
  Image,
  ImageSourcePropType,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  TouchableOpacity,
} from "react-native";
import { Colors, Fonts } from "../theme";

interface AppInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  inputLeftImage?: undefined | ImageSourcePropType;
  inputRightImage?: undefined | ImageSourcePropType;
  value?: string;
  secureTextEntry?: boolean | undefined;
  onChangeText?: ((text: string) => void) | undefined;
  blurOnSubmit?: boolean | undefined;
  keyboardType?: KeyboardTypeOptions | undefined;
  autoFocus?: boolean | undefined;
  getFocus?: any;
  setFocus?: () => void;
  returnKeyType?: ReturnKeyTypeOptions | undefined;
  maxLength?: number | undefined;
  multiline?: boolean | undefined;
  editable?: boolean | undefined;
  leftImageStyle?: object;
  rightImageStyle?: object;
  commonTextContainerStyle?: object;
  commonTextInputStyle?: object;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  errorMsg?: string;
  country_code?: string;
  onPressCountryCode?: () => void;
}

const AppInput: React.FC<AppInputProps> = (props) => {
  return (
    <>
      {/* Label Text */}
      {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
      <View
        style={[styles.text_input_container, props.commonTextContainerStyle]}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPressLeft}>
          <Image
            source={props.inputLeftImage}
            resizeMode="contain"
            style={[
              styles.input_image_style,
              props.leftImageStyle,
              {
                display: props.inputLeftImage ? "flex" : "none",
              },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={props.onPressCountryCode}
        >
          <Text
            style={{
              ...styles.text_code,
              display: props.country_code ? "flex" : "none",
            }}
          >
            {props.country_code}
          </Text>
        </TouchableOpacity>
        <TextInput
          placeholder={props.placeholder}
          placeholderTextColor={Colors.secondary.MONSOON}
          style={[props.commonTextInputStyle, styles.text_input_style]}
          value={props.value}
          secureTextEntry={props.secureTextEntry}
          onChangeText={props.onChangeText}
          blurOnSubmit={props.blurOnSubmit}
          keyboardType={props.keyboardType || "default"}
          returnKeyType={props.returnKeyType}
          underlineColorAndroid="transparent"
          autoFocus={props.autoFocus}
          maxLength={props.maxLength}
          multiline={props.multiline}
          ref={props.getFocus}
          onSubmitEditing={props.setFocus}
          editable={props.editable}
        />
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPressRight}>
          <Image
            source={props.inputRightImage}
            resizeMode="contain"
            style={[
              styles.input_image_right_style,
              props.rightImageStyle,
              {
                display: props.inputRightImage ? "flex" : "none",
              },
            ]}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          ...styles.error_message_text,
          display: props.errorMsg ? "flex" : "none",
        }}
      >
        {props.errorMsg}
      </Text>
    </>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  label: {
    width: "90%",
    alignSelf: "center",
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_15,
    color: Colors.secondary.LABEL,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "400",
  },
  text_input_container: {
    height: 70,
    width: "90%",
    alignSelf: "center",
    backgroundColor: Colors.secondary.OFF_WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.secondary.LABEL,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  text_input_style: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_15,
    color: Colors.primary.BLACK,
    paddingHorizontal: 0,
    flex: 1,
  },
  input_image_style: { height: 20, width: 20, marginRight: 10, top: -3 },
  input_image_right_style: { height: 20, width: 20, marginLeft: 10 },
  error_message_text: {
    color: Colors.primary.RED,
    marginHorizontal: 25,
    fontFamily: Fonts.Poppins_Medium,
    fontSize: Fonts.SIZE_12,
    marginTop: -15,
    marginBottom: 20,
  },
  text_code: {
    fontFamily: Fonts.Poppins_Medium,
    fontSize: Fonts.SIZE_15,
    color: Colors.primary.BLACK,
    marginRight: 5,
  },
});
