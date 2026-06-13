import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { AppHeader, Header } from "../../../components";
import imagePath from "../../../theme/imagePath";
import {
  ABOUT_US,
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS,
} from "../../../redux/apis/commonValue";
import { Colors } from "../../../theme";
import WebView from "react-native-webview";
import { hasNotch } from "react-native-device-info";

const CmsScreen = (props: any) => {
  const { title } = props?.route?.params ? props?.route?.params : "";

  return (
    <View style={styles.container}>
      <Header
        title={title}
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />
      <WebView
        style={{ flex: 1 }}
        source={{
          uri:
            title == "About"
              ? ABOUT_US
              : title == "Terms & Conditions"
                ? TERMS_AND_CONDITIONS
                : PRIVACY_POLICY,
        }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        originWhitelist={["*"]}
        automaticallyAdjustContentInsets={false}
        domStorageEnabled={true}
        scrollEnabled
        scalesPageToFit={true}
        zoomable={true}
        contentMode={"mobile"}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        containerStyle={{ padding: 0 }}
      />
    </View>
  );
};

export default CmsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.WHITE,
    paddingTop: hasNotch() ? 50 : 40,
  },
});
