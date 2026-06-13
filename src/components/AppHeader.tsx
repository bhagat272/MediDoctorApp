import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts } from "../theme";

interface HeaderProps {
  title?: string;
  leftIcon?: any;
  rightIcon?: any;
  rightText?: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
}

const Header = ({
  title,
  leftIcon,
  rightIcon,
  rightText,
  onPressLeft,
  onPressRight,
}: HeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* LEFT */}
      <View style={styles.sideContainer}>
        {leftIcon && (
          <TouchableOpacity
            onPress={onPressLeft}
            hitSlop={5}
            activeOpacity={0.8}
          >
            <Image source={leftIcon} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>

      {/* CENTER */}
      <View style={styles.centerContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      {/* RIGHT */}
      <View style={[styles.sideContainer, styles.rightAlign]}>
        {(rightIcon || rightText) && (
          <TouchableOpacity onPress={onPressRight} activeOpacity={0.8}>
            {rightIcon ? (
              <Image source={rightIcon} style={styles.icon} />
            ) : (
              <Text style={styles.rightText}>{rightText}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.WHITE,
  },
  sideContainer: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  rightAlign: {
    alignItems: "flex-end",
    paddingRight: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: Fonts.SIZE_16,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.BLACK,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  rightText: {
    fontSize: Fonts.SIZE_14,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.BLACK,
  },
});
