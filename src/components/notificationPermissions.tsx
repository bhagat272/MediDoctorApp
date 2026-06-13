// import {DeviceEventEmitter, Platform} from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import {
//   check,
//   Permission,
//   PERMISSIONS,
//   PermissionStatus,
//   request,
// } from 'react-native-permissions';
 
// export async function getFCMToken() {
//   let token:any = null;
//   if (Platform.OS === 'android') {
//     token = await getToken();
//   } else {
//     token = await checkPermission();
//   }
 
//   return token;
// }
 
// export async function getToken() {
//   let fcmToken:any = null;
 
//   if (Platform.OS == 'ios') {
//     if (!messaging().isDeviceRegisteredForRemoteMessages) {
//       await messaging().registerDeviceForRemoteMessages();
//     }
//   }
//   fcmToken = await messaging().getToken();
 
//   return fcmToken;
// }
 
// export async function checkPermission() {
//   return await messaging()
//     .hasPermission()
//     .then(enabled => {
//       if (enabled) {
//         return getToken();
//       } else {
//         return requestPermission();
//       }
//     });
// }
 
// export async function requestPermission() {
//   try {
//     return messaging()
//       .requestPermission()
//       .then(enabled => {
//         if (enabled) {
//           return getToken();
//         }
//       });
//   } catch (error) {}
// }
 
// export const requestAndroidNotificationPermission =
//   async (): Promise<boolean> => {
//     return new Promise<boolean>((resolve, reject) => {
//       check(
//         Platform.select({
//           android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
//         }) as Permission, // Type assertion for the permission value (which is a string)
//       )
//         .then((result: PermissionStatus) => {
//           if (
//             result === 'blocked' ||
//             result === 'unavailable' ||
//             result === 'denied'
//           ) {
//             request(
//               Platform.select({
//                 android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
//               }) as Permission, // Type assertion for the permission value (which is a string)
//             )
//               .then(() => {
//                 resolve(true);
//               })
//               .catch(() => {
//                 resolve(false);
//               });
//           } else {
//             resolve(true);
//           }
//         })
//         .catch(e => {
//           resolve(false);
//         });
//     });
//   };