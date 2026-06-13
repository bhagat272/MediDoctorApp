import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageSourcePropType,
  ImageResizeMode,
} from "react-native";
import imagePath from "../theme/imagePath";

type Props = {
  source: ImageSourcePropType;
  style?: any;
  resizeMode?: ImageResizeMode;
  loaderColor?: string;
  loaderSize?: "small" | "large";
  onLoad?: () => void;
  onError?: () => void;
};

const LOADER_DURATION = 4000;

const ImageLoadView: React.FC<Props> = ({
  source,
  style,
  resizeMode = "cover",
  loaderColor = "#919191",
  loaderSize = "small",
}) => {
  const [loading, setLoading] = useState(true);

  const isValidRemoteUri =
    typeof (source as any)?.uri === "string" &&
    (source as any).uri.trim().length > 0;

  const safeSource: ImageSourcePropType =
    typeof source === "number"
      ? source
      : isValidRemoteUri
        ? source
        : imagePath.user_icon;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={safeSource}
        resizeMode={resizeMode}
        style={[
          StyleSheet.absoluteFillObject,
          { width: "100%", height: "100%" },
        ]}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
      />

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size={loaderSize} color={loaderColor} />
        </View>
      )}
    </View>
  );
};

export default ImageLoadView;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden", // 👈 keeps borderRadius working
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
