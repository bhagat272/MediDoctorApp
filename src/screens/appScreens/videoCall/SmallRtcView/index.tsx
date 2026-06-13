import React, { useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { RtcSurfaceView } from "react-native-agora";
import imagePath from "../../../../theme/imagePath";

interface SmallRtcViewProps {
  isLocalMain: boolean;
  remoteUid?: number;
  channelId: string;
  localCameraOn: boolean;
  remoteCameraOn: boolean;
  onToggle: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const SmallRtcView: React.FC<SmallRtcViewProps> = ({
  isLocalMain,
  remoteUid,
  channelId,
  localCameraOn,
  remoteCameraOn,
  onToggle,
}) => {
  const viewWidth = 120;
  const viewHeight = 150;
  const position = useRef(
    new Animated.ValueXY({ x: SCREEN_WIDTH - viewWidth - 20, y: 80 }),
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2,

      onPanResponderGrant: () => {
        position.setOffset({
          x: (position.x as any)._value,
          y: (position.y as any)._value,
        });
        position.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false },
      ),

      onPanResponderRelease: (_, gestureState) => {
        position.flattenOffset();

        let newX = (position.x as any)._value;
        let newY = (position.y as any)._value;

        // Clamp within screen bounds
        const minX = 0;
        const minY = 50;
        const maxX = SCREEN_WIDTH - viewWidth;
        const maxY = SCREEN_HEIGHT - viewHeight - 120; // adjust for bottom safe area or buttons

        if (newX < minX) newX = minX;
        if (newX > maxX) newX = maxX;
        if (newY < minY) newY = minY;
        if (newY > maxY) newY = maxY;

        Animated.spring(position, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
          friction: 7,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        { width: viewWidth, height: viewHeight },
        { transform: position.getTranslateTransform() },
      ]}
    >
      {(!localCameraOn && !isLocalMain) || (!remoteCameraOn && isLocalMain) ? (
        <View style={styles.cameraoffStyle}>
          <Image
            source={imagePath.videooff}
            tintColor="white"
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
      ) : (
        <TouchableOpacity onPress={onToggle} activeOpacity={1}>
          <RtcSurfaceView
            style={styles.videoFill}
            canvas={{ uid: isLocalMain ? remoteUid : 0 }}
            connection={{ channelId }}
            zOrderMediaOverlay={true}
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default SmallRtcView;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 20,
  },
  videoFill: {
    width: "100%",
    height: "100%",
  },
  cameraoffStyle: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
});
