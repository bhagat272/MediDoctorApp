import { ImageSourcePropType, ImageURISource } from "react-native";

export const loadedImageUris = new Set<string>();

export const getUriFromSource = (
  source: ImageSourcePropType,
): string | null => {
  if (typeof source === "number") {
    return null;
  }

  if (Array.isArray(source)) {
    return source[0]?.uri ?? null;
  }

  return source.uri ?? null;
};
