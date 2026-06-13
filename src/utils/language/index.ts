import i18next from 'i18next';
import en from './en.json';
import {initReactI18next} from 'react-i18next';
import {NativeModules, Platform} from 'react-native';

export const languageResources = {
  en: {translation: en},
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

export const translateLanguage = (lang: string) => {
  const selectedLanguage = lang ? lang : 'en';
  setGlobalLanguage(selectedLanguage);
  i18next.changeLanguage(selectedLanguage);
};

// export const methodDetectDeviceLanguage = () => {
//   const deviceLanguage =
//     Platform.OS == 'ios'
//       ? NativeModules.SettingsManager.settings.AppleLocale ||
//         NativeModules.SettingsManager.settings.AppleLanguages[0]
//       : NativeModules.I18nManager.localeIdentifier;
//   const strFirstTwo = deviceLanguage.substring(0, 2);
//   const phoneDefaultLanguage = strFirstTwo.toLowerCase();

//   if (phoneDefaultLanguage != 'fr' && phoneDefaultLanguage != 'en') {
//     return 'en';
//   }

//   return phoneDefaultLanguage;
// };
export const methodDetectDeviceLanguage = () => {
  let deviceLanguage = 'en'; // default fallback

  if (Platform.OS === 'ios') {
    const settings = NativeModules.SettingsManager?.settings || {};
    deviceLanguage =
      settings.AppleLocale ||
      (Array.isArray(settings.AppleLanguages) ? settings.AppleLanguages[0] : 'en');
  } else {
    deviceLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
  }

  const strFirstTwo = deviceLanguage?.substring(0, 2).toLowerCase();
  return strFirstTwo === 'fr' || strFirstTwo === 'en' ? strFirstTwo : 'en';
};

export const setGlobalLanguage = (language: string) => {
  global.language = language;
};

export const translateText = (text: string) => {
  return i18next.t(text);
};
