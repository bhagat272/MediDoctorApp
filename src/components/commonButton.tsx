import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Colors, Fonts } from "../theme";
import { Flow } from "react-native-animated-spinkit";

interface AppButtonProps extends TouchableOpacityProps {
  isLoading?: boolean;
  onPress: () => void;
  disabled?: boolean;
  buttonStyle?: object;
  title?: string;
  textStyle?: object;
  color?: string;
}

const AppButton: React.FC<AppButtonProps> = (props) => {
  return (
    <TouchableOpacity
      disabled={props?.disabled || props?.isLoading}
      activeOpacity={0.8}
      onPress={() => props.onPress()}
      style={[styles.btn_style, props.buttonStyle]}
    >
      {props?.isLoading ? (
        <Flow
          color={props.color ? props.color : Colors.primary.WHITE}
          size={60}
        />
      ) : (
        <Text style={[styles.title_style, props.textStyle]}>{props.title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  btn_style: {
    height: 63,
    width: "90%",
    alignSelf: "center",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary.APP_THEME,
    marginVertical: 5,
    marginBottom: 20,
  },
  title_style: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_SemiBold,
    textAlign: "center",
    color: Colors.primary.WHITE,
  },
});
