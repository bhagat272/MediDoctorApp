import { View, Text, Modal } from "react-native";
import React from "react";
import { Colors, Fonts } from "../../../theme";
import { AppButton } from "../../../components";
import { translateText } from "../../../utils/language";

const LogoutModal = (props: any) => {
  const { visible, onConfirm, onCancel } = props;
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000088",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: Colors.primary.WHITE,
            borderRadius: 16,
            padding: 10,
            width: "90%",
          }}
        >
          <Text
            style={{
              fontFamily: Fonts.Poppins_Medium,
              fontSize: Fonts.SIZE_16,
              color: Colors.primary.BLACK,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            {translateText("Are you sure you want to")}
            {"\n"}
            {translateText("logout")}?
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
              marginHorizontal: 20,
            }}
          >
            <AppButton
              title={translateText("cancel")}
              buttonStyle={{
                width: "48%",
                height: 44,
                backgroundColor: Colors.secondary.COTTON_SEED,
              }}
              textStyle={{
                color: Colors.primary.BLACK,
                fontFamily: Fonts.Poppins_Medium,
              }}
              onPress={() => onCancel()}
            />
            <AppButton
              title={translateText("confirm")}
              buttonStyle={{ width: "48%", height: 44 }}
              textStyle={{
                fontFamily: Fonts.Poppins_Medium,
              }}
              onPress={() => onConfirm()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
