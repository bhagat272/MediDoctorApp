import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Fonts} from '../theme'; // Customize the color themes as per your project.

interface CustomAlertProps {
  visible: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const CustomAlert = ({
  visible,
  message,
  onCancel,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = true,
}: CustomAlertProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel} // Android back button handling
    >
      <View style={styles.modalBackground}>
        <View style={styles.alertContainer}>
          {/* {title ? <Text style={styles.title}>{title}</Text> : null} */}
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cancelButton}
                onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.confirmButton}
              onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  alertContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: Colors.primary.WHITE,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_Regular,
    marginBottom: 10,
    color: Colors.primary.BLACK,
  },
  message: {
    fontSize: 18,
    color: Colors.primary.BLACK,
    textAlign: 'center',
    marginBottom: 20,

    fontFamily: Fonts.Poppins_Regular,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.secondary.MONSOON,
    borderRadius: 10,
    marginRight: 10,
    height: 48,
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.primary.APP_THEME,
    borderRadius: 10,
    justifyContent: 'center',
    height: 48,
  },
  cancelText: {
    color: Colors.primary.WHITE,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: Fonts.Poppins_Medium,
  },
  confirmText: {
    color: Colors.primary.WHITE,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: Fonts.Poppins_Medium,
  },
});

export default CustomAlert;
