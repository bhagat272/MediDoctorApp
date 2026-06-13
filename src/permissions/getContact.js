import React from 'react';
import {Platform} from 'react-native';
import Contacts from 'react-native-contacts';
import {
  contactPermissions,
  methodAndroidContactPermission,
} from './appPermissions';

export const getAllContact = cb => {
  if (Platform.OS == 'ios') {
    accessContact(cb);
  } else {
    methodAndroidContactPermission(status => {
      if (status) {
        accessContact(cb);
      }
    });
  }
};

const accessContact = cb => {
  contactPermissions(status => {
    if (status) {
      Contacts.getAll().then(contacts => {
        let allContacts = [];
        let arr = [...contacts];
        arr?.map(item => {
          if (item?.phoneNumbers?.length > 0) {
            let contactNum = phoneNumberCorrectFormate(
              item?.phoneNumbers[0]?.number,
            );
            allContacts.push(contactNum);
          }
        });
        cb(allContacts);
      });
    }
  });
};

const phoneNumberCorrectFormate = strOldNumber => {
  let strCheckContact = strOldNumber.toString();

  let correctContactNumber = strCheckContact.replace(/[^+0-9]/g, '');
  /* Without Country Code Contact */
  if (correctContactNumber.indexOf('+') == -1) {
    if (correctContactNumber.charAt(0).toString() == '0') {
      correctContactNumber = correctContactNumber.slice(1);
      if (correctContactNumber.charAt(0).toString() == '0') {
        correctContactNumber = correctContactNumber.slice(1);
      }
    }
    correctContactNumber =
      global?.userData?.country_code + correctContactNumber;
  } else {
    /* With Country Code Contact */
    /* Contact Start with '+' */
    if (correctContactNumber.startsWith('+')) {
      /* Check Country Code +1 */
      let checkUkCode = correctContactNumber.charAt(1).toString();
      if (Number(checkUkCode) == 1) {
        /* Remove Country Code +1 form contact for temprary */
        let removeCodeNumber = correctContactNumber.replace('+1', '');
        if (removeCodeNumber.charAt(0).toString() == '0') {
          removeCodeNumber = removeCodeNumber.slice(1);
          if (removeCodeNumber.charAt(0).toString() == '0') {
            removeCodeNumber = removeCodeNumber.slice(1);
          }
        }
        /* Add Again Country Code +1 */
        correctContactNumber = '+1' + removeCodeNumber;
      }
    }
  }

  return correctContactNumber.replace(/[^+0-9]/g, '');
};
