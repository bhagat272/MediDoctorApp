const BASE_URL = "https://lifetimemediapp.ca/api/";
// const BASE_URL = 'http://192.168.1.236:3000/api/v1/';
const IMAGE_URL = "https://demo.dev9server.com/nick-modules/";
const PRIVACY_POLICY = "https://lifetimemediapp.ca/privacy-policy";
const TERMS_AND_CONDITIONS = "https://lifetimemediapp.ca/terms-conditions";
const ABOUT_US = "https://demo.dev9server.com/nick-modules/page/about-us";
const SOCKET_URL = "https://lifetimemediapp.ca:4192";
const GOOGLE_PLACE_KEY = "AIzaSyCD4XfASHD3Ml6ow07DWjwXjFscRLK0DB0";
const AGORA_KEY = "73c2a6d20d5745adac538a2e5981a675";

const kInternetError = "You're offline \n Please check internet connection.";
const kSorryError = "Sorry, something went wrong.";
const commonMapKey = "AIzaSyCDGDgzu6tArx2CMJkb9qQFYyANJzoX564";
const kUserFCMToken = "simulator";
const kTrue = true;
const kFalse = false;

const VoipCallData = "voip_call_data";
const VoipCallAccept = "voip_call_accept";

const kPost = "POST";
const kGet = "GET";
const kPut = "PUT";
const kDelete = "DELETE";

const kUserToken = "user_token";
const kUserData = "userData";
const kRememberData = "remember_me_data";
const kAndroidProminent = "androidProminent";
const KAUthToken = "auth_token";

const JSON_HEADER = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const MULTI_PART_HEADER = {
  Accept: "application/json",
  "Content-Type": "multipart/form-data",
};

const API_FAILED = {
  status: false,
  message: kSorryError,
};

const INTERNET_FAILED = {
  status: false,
  message: kInternetError,
};

export {
  BASE_URL,
  IMAGE_URL,
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS,
  ABOUT_US,
  kTrue,
  kFalse,
  kDelete,
  kPost,
  kGet,
  kPut,
  kUserToken,
  kUserData,
  kRememberData,
  kAndroidProminent,
  KAUthToken,
  JSON_HEADER,
  MULTI_PART_HEADER,
  API_FAILED,
  INTERNET_FAILED,
  kSorryError,
  kInternetError,
  GOOGLE_PLACE_KEY,
  SOCKET_URL,
  commonMapKey,
  AGORA_KEY,
  VoipCallAccept,
  VoipCallData,
  kUserFCMToken,
};
