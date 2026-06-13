import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

export const isBiometricAvailable = async () => {
  const { available, biometryType } = await rnBiometrics.isSensorAvailable();
  return { available, biometryType };
};

export const authenticateBiometric = async () => {
  return rnBiometrics.simplePrompt({
    promptMessage: 'Confirm your identity',
  });
};
