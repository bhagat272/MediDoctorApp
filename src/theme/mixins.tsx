import { Dimensions, PixelRatio, Platform, StatusBar } from "react-native";

export const WINDOW_WIDTH = Dimensions.get("window").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;

const guidelineBaseWidth = 375;

export const scaleSize = (size: number) =>
  (WINDOW_WIDTH / guidelineBaseWidth) * size;

export const scaleFont = (size: number) => size * PixelRatio.getFontScale();

function dimensions(
  top: number,
  right = top,
  bottom = top,
  left = right,
  property: any
) {
  let styles = {};

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin({ top = 0, right = 0, bottom = 0, left = 0 }) {
  return dimensions(top, right, bottom, left, "margin");
}

export function padding({ top = 0, right = 0, bottom = 0, left = 0 }) {
  return dimensions(top, right, bottom, left, "padding");
}

export function boxShadow(
  color = "#000",
  offset = { height: 2, width: 2 },
  radius = 8,
  opacity = 0.5
) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
  };
}

export const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 44;
