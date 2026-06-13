import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from "react-native";
import {
  cameraPermissions,
  checkMicroPhonePermission,
  galleryPermissions,
} from "./appPermissions";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  cleanFiles,
  isValidFile,
  listFiles,
  showEditor,
} from "react-native-video-trim";
import { messages } from "./permissionMessage";
import ImageCropPicker from "react-native-image-crop-picker";
import { Colors } from "../theme";
import fonts from "../theme/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image as ImageCompressor } from "react-native-compressor";
import RNFS from "react-native-fs";
import ImageResizer from "react-native-image-resizer";

const fixOrientation = async (imagePath) => {
  try {
    const normalized = await ImageResizer.createResizedImage(
      imagePath,
      1024,
      2000,
      "JPEG",
      100,
      0,
      undefined,
      false,
    );

    return normalized.uri;
  } catch (err) {
    console.log("Orientation fix error:", err);
    return imagePath;
  }
};

const compressIfNeeded = async (imagePath) => {
  try {
    const stats = await RNFS.stat(imagePath);
    const originalSize = Number(stats.size);
    const targetBytes = 3 * 1024 * 1024; // 1 MB
    const originalSizeMB = (originalSize / (1024 * 1024)).toFixed(2);

    console.log(`🖼️ Original size: ${originalSizeMB} MB`);

    // If already under 1 MB, skip compression
    if (originalSize <= targetBytes) {
      console.log("No compression needed (under 1 MB)");
      return imagePath;
    }

    let quality = 0.8;
    let compressedUri = imagePath;
    let compressedSize = originalSize;

    console.log("Compressing image to reach ~1 MB target...");

    // Compress repeatedly until size < 1 MB or quality < 0.2
    while (compressedSize > targetBytes && quality >= 0.2) {
      compressedUri = await ImageCompressor.compress(imagePath, {
        compressionMethod: "manual",
        quality,
        orientation: 0,
      });

      const compressedStats = await RNFS.stat(compressedUri);
      compressedSize = Number(compressedStats.size);

      console.log(
        `Tried quality=${quality.toFixed(1)}, size=${(
          compressedSize /
          (1024 * 1024)
        ).toFixed(2)} MB`,
      );

      quality -= 0.1; // lower quality gradually
    }

    const finalSizeMB = (compressedSize / (1024 * 1024)).toFixed(2);
    console.log(`✅ Final compressed size: ${finalSizeMB} MB`);
    return compressedUri;
  } catch (err) {
    console.log("Compression error:", err);
    return imagePath; // fallback if anything fails
  }
};
const getRotationFromExif = (exif) => {
  if (!exif) {
    return 0;
  }
  const orientation =
    exif.Orientation || exif.orientation || exif["Orientation"];
  switch (orientation) {
    case 3:
    case "3":
      return 180;
    case 6:
    case "6":
      return 90;
    case 8:
    case "8":
      return 270;
    default:
      return 0;
  }
};
const normalizeOrientation = async (path, width, height) => {
  try {
    const fixed = await ImageResizer.createResizedImage(
      path,
      width,
      height,
      "JPEG",
      100,
      0,
      undefined,
      false,
      { mode: "contain" },
    );
    console.log("image value =====>", fixed);
    return fixed.uri;
  } catch (e) {
    console.log("normalizeOrientation error:", e);
    return path;
  }
};

const normalizeImageOrientation = async (image) => {
  const rotation = getRotationFromExif(image?.exif || {});
  console.log("exif response>", rotation);
  if (!rotation) {
    return image;
  }

  return {
    ...image,
    width: rotation ? image?.height : image?.width,
    height: rotation ? image?.width : image?.height,
  };
};

const ImageController = (props) => {
  const { mediaType, onSuccess } = props.route.params || {
    mediaType: "photo",
    onSuccess: () => {},
  };

  useEffect(() => {
    let subscription = null;
    if (mediaType === "video") {
      eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
      const subscription = eventEmitter.addListener("VideoTrim", (event) => {
        if (!event) {
          return;
        }
        switch (event?.name) {
          case "onShow":
            break;
          case "onHide":
            break;
          case "onStartTrimming":
            break;
          case "onFinishTrimming":
            if (event && event?.outputPath) {
              let obj = {
                path:
                  Platform.OS === "ios"
                    ? event.outputPath
                    : "file://" + event.outputPath,
                duration: 60,
              };
              onComplete(obj);
            }
            break;
          case "onCancelTrimming":
            break;
          case "onError":
            break;
        }
      });
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const onComplete = (data) => {
    onSuccess(data);
    props.navigation.goBack(null);
  };

  const onCamera = () => {
    cameraPermissions(async (status) => {
      let microPhonePermission =
        mediaType === "video" ? await checkMicroPhonePermission() : null;

      if (status) {
        if (mediaType === "video" && microPhonePermission) {
          const options = {
            mediaType: "video",
            durationLimit: 60,
            allowsEditing: true,
            videoQuality: "high",
          };
          launchCamera(options, (response) => {
            if (
              response?.didCancel ||
              response?.errorCode ||
              response?.errorMessage
            ) {
              console.log("User cancelled video picker");
              return;
            } else if (response?.assets) {
              let dic = {
                path: response?.assets[0]?.uri,
                duration: response?.assets[0]?.duration,
              };
              onComplete(dic);
            } else {
              console.log("User cancelled video picker");
            }
          }).catch((e) => console.log("e-------", e));
        } else if (mediaType === "photo") {
          ImageCropPicker.openCamera({
            loadingLabelText: messages.IMAGE_PROCESSING,
            mediaType: "photo",
            forceJpg: true,
            includeExif: true,
          }).then(async (response) => {
            try {
              // 👉 Compress before cropping
              // const normalized = await normalizeImageOrientation(response);

              const normalized = await normalizeOrientation(
                response?.path,
                response?.width,
                response?.height,
              );
              console.log("---normalized======---->", normalized);
              const compressedPath = await compressIfNeeded(normalized);
              const cropped = await ImageCropPicker.openCropper({
                width: response?.width,
                height: response?.height,
                path: compressedPath,
                freeStyleCropEnabled: true,
              });

              onComplete(cropped);
            } catch (e) {
              if (e.message === "Cannot find image data") {
                alert("Please select a valid file.");
              }
            }
          });
        }
      }
    });
  };

  const onGallery = () => {
    listFiles().then((res) => {
      if (res?.length) {
        cleanFiles().then((r) => console.log(r));
      }
    });

    galleryPermissions(async (status) => {
      if (status) {
        if (mediaType === "video") {
          const options = {
            mediaType: "video",
            assetRepresentationMode: "current",
          };
          launchImageLibrary(options, (result) => {
            if (
              result?.didCancel ||
              result?.errorCode ||
              result?.errorMessage
            ) {
              console.log("User cancelled video picker");
              return;
            } else if (result?.assets) {
              isValidFile(
                result?.assets && result?.assets[0]
                  ? result?.assets[0]?.uri
                  : "",
              );
              const path =
                String(result?.assets[0]?.uri).startsWith("file://") &&
                Platform.OS == "ios"
                  ? String(result?.assets[0]?.uri).replace(/^file:\/\//, "")
                  : result?.assets[0]?.uri;
              showEditor(path || "", {
                maxDuration: 60,
              });
              let dic = {
                path: result?.assets[0]?.uri,
                duration: result?.assets[0]?.duration,
              };
              onComplete(dic);
            } else {
              console.log("User cancelled video picker");
            }
          });
        } else {
          ImageCropPicker.openPicker({
            mediaType: "photo",
            loadingLabelText: messages.IMAGE_PROCESSING,
          }).then(async (response) => {
            try {
              const normalized = await normalizeOrientation(
                response.path,
                response.width,
                response.height,
              );
              const compressedPath = await compressIfNeeded(normalized);
              const cropped = await ImageCropPicker.openCropper({
                width: response?.width,
                height: response?.height,
                path: compressedPath,
                freeStyleCropEnabled: true,
              });

              onComplete(cropped);
            } catch (e) {
              if (e.message === "Cannot find image data") {
                alert("Please select a valid file.");
              }
            }
          });
        }
      }
    });
  };

  const edges = Platform.select({
    ios: ["left", "right"], // No bottom on iOS
    android: ["bottom", "left", "right"],
  });

  return (
    <SafeAreaView style={styles.container} edges={edges}>
      <View style={styles.mainView}>
        <TouchableOpacity onPress={onCamera} style={styles.cameraView}>
          <Text style={styles.textTitle}>Camera</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={onGallery} style={styles.cameraView}>
          <Text style={styles.textTitle}>Gallery</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.cameraView}
        >
          <Text style={styles.textTitle}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ImageController;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  mainView: {
    bottom: 0,
    backgroundColor: Colors.primary.APP_THEME,
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
    // borderRadius: 10,
    paddingBottom: 20,
  },
  cameraView: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  textTitle: {
    color: "white",
    fontFamily: fonts.Poppins_SemiBold,
  },
  separator: {
    height: 1,
    backgroundColor: "white",
    width: "100%",
  },
});
