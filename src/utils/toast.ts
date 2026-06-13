import { showMessage, MessageType } from "react-native-flash-message";

export function showToastMessage(
  message: string,
  type: undefined | MessageType = "danger",
) {
  showMessage({
    message: message,
    type: type,
    duration: 3000,
  });
}
