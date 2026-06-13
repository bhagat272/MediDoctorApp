// import React, {useState} from 'react';

// import * as DocumentPicker from '@react-native-documents/picker';
// import {galleryPermissions} from './appPermissions';

// const AddMusicFile = (cb: any) => {
//   try {
//     // Use pickSingle for a single file selection
//     galleryPermissions(async (status: boolean) => {
//       if (!status) {
//         return cb(false);
//       }
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.audio],
//         mode: 'open',
//         copyTo: 'cachesDirectory',
//       });
//       cb(res);
//     });
//   } catch (err: any) {
//     cb(false);
//     if (DocumentPicker.isCancel(err)) {
//       console.log('User cancelled document picker');
//     } else {
//       console.error('DocumentPicker Error: ', err);
//     }
//   }
// };

// export default AddMusicFile;
import * as DocumentPicker from '@react-native-documents/picker';
import { galleryPermissions } from './appPermissions';

const AddMusicFile = (cb: any) => {
  galleryPermissions(async (status: boolean) => {
    if (!status) return cb(false);

    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
        copyTo: 'cachesDirectory',
      });

      const file = result[0]; // pick returns array
      cb(file);
    } catch (err: any) {
      cb(false);

      if (DocumentPicker.isErrorWithCode?.(err) && err.code === 'DOCUMENT_PICKER_CANCELED') {
        console.log('User canceled');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    }
  });
};

export default AddMusicFile;
