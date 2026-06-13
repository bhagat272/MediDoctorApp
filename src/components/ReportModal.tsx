import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../theme";
import fonts from "../theme/fonts";
import imagePath from "../theme/imagePath";
import AppButton from "./commonButton";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (details: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [details, setDetails] = useState("");

  const [reasonError, setReasonError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  const emojiRegex =
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDDFF])/g;

  const cleanInputText = (text: string): string => {
    if (!text) return "";

    return text.replace(emojiRegex, "").replace(/\s+/g, " ").trim();
  };

  const handleDetailsChange = (text: string) => {
    // 1. Block leading space
    if (text.startsWith(" ")) {
      return;
    }

    // 2. Block multiple consecutive spaces
    if (/\s{2,}/.test(text)) {
      return;
    }

    setDetails(text);
  };

  const handleSubmit = () => {
    let hasError = false;

    // Reset errors first
    setReasonError("");
    setDetailsError("");

    const cleanedDetails = cleanInputText(details);

    if (!cleanedDetails) {
      setDetailsError("Please enter details");
      hasError = true;
    } else if (cleanedDetails.length < 10) {
      setDetailsError("Please provide at least 10 characters in details");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // ✅ No errors
    onSubmit(cleanedDetails);

    setDetails("");
    onClose();
  };

  const handleClose = () => {
    setDetails("");
    setReasonError("");
    setDetailsError("");
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <Pressable style={styles.container} onPress={() => {}}>
            <View style={styles.header}>
              <Text style={styles.title}>Report</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeIcon}>
                <Image source={imagePath.cancel} style={styles.crossIcon} />
              </TouchableOpacity>
            </View>

            {/* Optional details */}
            {/* <Text style={styles.label}>Additional details</Text> */}
            <TextInput
              style={styles.input}
              placeholder="Type here..."
              placeholderTextColor={Colors.primary.GREY}
              multiline
              numberOfLines={4}
              maxLength={200}
              value={details}
              onChangeText={handleDetailsChange}
            />
            <Text style={styles.charCount}>{`${details.length}/200`}</Text>
            {detailsError ? (
              <Text style={styles.errorText}>{detailsError}</Text>
            ) : null}

            <AppButton
              title="Send"
              onPress={handleSubmit}
              buttonStyle={styles.sendButton}
            />
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default ReportModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoid: {
    width: "100%",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.primary.BLACK,
    borderRadius: 16,
    padding: 20,
    width: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.Poppins_Medium,
    color: Colors.primary.WHITE,
  },
  closeIcon: {
    padding: 4,
  },
  crossIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.primary.WHITE,
  },
  label: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    marginBottom: 8,
    fontFamily: fonts.Poppins_Light,
  },
  dropdownContainer: {
    backgroundColor: "#333",
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: '#444',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dropdownText: {
    color: Colors.primary.WHITE,
    fontSize: 16,
    fontFamily: fonts.Poppins_Regular,
  },
  dropdownIcon: {
    width: 16,
    height: 16,
    tintColor: Colors.primary.WHITE,
    transform: [{ rotate: "90deg" }],
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: Colors.primary.WHITE,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#444",
  },
  charCount: {
    color: Colors.primary.GREY,
    fontSize: 12,
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 8,
  },
  sendButton: {
    width: "100%",
    marginTop: 8,
  },
  errorText: {
    color: Colors.primary.APP_THEME,
    fontSize: 14,
    marginBottom: 8,
    textAlign: "left",
    fontFamily: fonts.Poppins_Regular,
    paddingLeft: 5,
  },
});
