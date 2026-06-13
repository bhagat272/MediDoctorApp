import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  SafeAreaView,
  Text,
  BackHandler,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import WebView from "react-native-webview";
import imagePath from "../theme/imagePath";

const StripeConnect = (props: any) => {
  let { stripe_url, visible, onCompletion, onCancel } = props;
  const [modalVisible, setModalVisible] = useState(visible);
  const [changed, setChanged] = useState<null | string>(null);
  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (changed == "error") {
      setTimeout(() => {
        onCompletion(false);
        setModalVisible(false);
      }, 2000);
    }

    if (changed == "success") {
      setTimeout(() => {
        onCompletion(true);
        setModalVisible(false);
      }, 5000);
    }
  }, [changed]);

  return (
    <Modal transparent visible={modalVisible}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <TouchableOpacity activeOpacity={0.8} onPress={onCancel}>
          <Image
            source={imagePath.goBackImgpng}
            style={{
              height: 40,
              width: 40,
              marginTop: Platform.OS == "android" ? 0 : 50,
              marginBottom: 20,
              marginHorizontal: 20,
            }}
          />
        </TouchableOpacity>
        <WebView
          source={{
            uri: stripe_url,
          }}
          style={{ flex: 1 }}
          useWebKit={true}
          startInLoadingState
          onNavigationStateChange={(state) => {
            console.log("state.url===", state.url);

            if (state.url.includes("/success")) {
              setChanged("success");
              // setTimeout(() => {
              //   onCompletion(true);
              //   setModalVisible(false);
              // }, 2000);
            }

            if (state.url.includes("/error")) {
              setChanged("error");

              // setTimeout(() => {
              //   onCompletion(false);
              //   setModalVisible(false);
              // }, 2000);
            }
          }}
        />
      </View>
    </Modal>
  );
};

export default StripeConnect;
