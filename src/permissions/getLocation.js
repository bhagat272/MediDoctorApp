import { Platform } from 'react-native';
import { locationPermissions } from './appPermissions';
import { getDistance } from 'geolib';
import { methodSecurityDecoded } from '../utils/helper';
import { GOOGLE_PLACE_KEY } from '../appRedux/apis/commonValue';
import GetLocation from 'react-native-get-location';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';

// Decoding the Google Place API key
let google_place_api_key = methodSecurityDecoded(GOOGLE_PLACE_KEY);

// Function to fetch current location
export async function geoCurrentLocation(cb) {
  if (Platform.OS === 'android') {
    try {
      const enableResult = await promptForEnableLocationIfNeeded();
      if (enableResult) {
        accessLocation(cb);
      } else {
        cb(false);
      }
    } catch (error) {
      cb(false);
    }
  } else {
    accessLocation(cb);
  }
}

// Function to access location
export function accessLocation(cb) {
  locationPermissions(status => {
    if (status) {
      selectLatLong(cb);
    } else {
      cb({ latitude: '', longitude: '' });
    }
  });
}

// Function to get latitude and longitude
export function selectLatLong(cb) {
  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 60000,
  })
    .then(location => {
      if (location.latitude && location.longitude) {
        GetAddressFromLatLong(location.latitude, location.longitude, cb);
      }
    })
    .catch(error => {
      cb({ latitude: '', longitude: '' });
    });
}

// Function to get address from latitude and longitude
export function GetAddressFromLatLong(latitude, longitude, cb) {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${google_place_api_key}`
  )
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson && responseJson.results.length > 0) {
        let addressComponent = {
          address: responseJson.results[0].formatted_address,
          latitude: latitude,
          longitude: longitude,
        };
        cb(addressComponent);
      } else {
        cb({ latitude: '', longitude: '' });
      }
    })
    .catch(err => {
      cb({ latitude: '', longitude: '' });
    });
}

// Function to calculate distance between two locations
export function GetDistanceBetweenTwoLocation(fromPos, toPos) {
  return getDistance(fromPos, toPos);
}
