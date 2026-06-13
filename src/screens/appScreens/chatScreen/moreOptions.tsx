import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import React, { useMemo } from "react";
import Colors from "../../../theme/colors";
import fonts from "../../../theme/fonts";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

const MoreOptions = (props: any) => {
  const { cb, status, type } = props?.route?.params ?? false;
  const usePlatformEdges = (): Edge[] =>
    useMemo(
      () =>
        Platform.OS === "android"
          ? ["bottom", "left", "right"]
          : ["left", "right"],
      [],
    );

  const edges = usePlatformEdges();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={edges}>
      <View style={styles.container}>
        <View style={styles.modal_view}>
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.goBack();
                cb && cb("block");
              }}
              style={{
                ...styles.row_view,
                display: type == "GROUP" ? "none" : "flex",
              }}
            >
              <Text style={styles.text_style}>{status}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.goBack();
                cb && cb("delete");
              }}
              style={styles.row_view}
            >
              <Text style={styles.text_style}>Delete chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.goBack();
                cb && cb("report");
              }}
              style={styles.row_view}
            >
              <Text style={styles.text_style}> {"Report"} </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.goBack();
              }}
              style={styles.row_view_cancel}
            >
              <Text style={styles.text_style}>Cancel</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MoreOptions;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modal_view: {
    backgroundColor: Colors.primary.APP_THEME,
    minHeight: 200,
    width: Dimensions.get("window").width,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  row_view: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: Colors.primary.WHITE,
    borderBottomWidth: 1,
  },
  row_view_cancel: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text_style: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.WHITE,
  },
});
