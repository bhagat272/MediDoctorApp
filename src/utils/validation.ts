import { firebaseRemoteConfigData } from "./firebaseConfigMsg";
import {
  alphabetsOnlyRegex,
  companyNameRegex,
  emojiRegexp,
  gstNumberRegex,
  noSpecialChar,
  numberRegex,
  panCardRegex,
  pinCodeRegex,
  strongPassword,
  urlRegex,
  validEmailRegex,
} from "./regex";

export const maxLengthPassword = 15;
export const minLengthPassword = 8;
export const minLengthName = 2;
export const maxLengthName = 40;
export const minLengthMobile = 7;
export const maxLengthMobile = 15;
export const maxLengthEmail = 60;
export const maxLengthUsername = 25;
export const minLengthLastName = 1;

export function ValidateForm(form: any) {
  let isValidForm = true;
  let fireBaseMsg = firebaseRemoteConfigData.msg;

  for (let val in form.validators) {
    form.validators[val].error = "";
    for (let i in form.validators[val]) {
      let message = "";
      if (form.validators[val].error != "") break;

      let valData = form.validators[val][i];
      if (i == "required" && (!form[val] || !form[val].toString().trim())) {
        // let value = (val.charAt(0).toUpperCase() + val.slice(1))
        let value = (val.charAt(0).toLowerCase() + val.slice(1))
          .split("_")
          .join(" ");
        message = `${fireBaseMsg.required + " " + value}`;
      } else if (i == "noSpecial" && noSpecialChar.test(form[val]) == false) {
        let value = (val.charAt(0).toUpperCase() + val.slice(1))
          .split("_")
          .join(" ");
        message = fireBaseMsg.special_digit + " " + value;
      } else if (
        (i == "minLength" || i == "minLengthDigit") &&
        form[val].length < valData
      ) {
        let value = (val.charAt(0).toUpperCase() + val.slice(1))
          .split("_")
          .join(" ");
        var cStr = i == "minLengthDigit" ? " " + "digits" : " " + "characters";
        message = value + " " + "must be at least" + " " + valData + cStr;
      } else if (
        (i == "maxLength" || i == "maxLengthDigit") &&
        form[val].length > valData
      ) {
        let value = (val.charAt(0).toUpperCase() + val.slice(1))
          .split("_")
          .join(" ");
        var cStr = i == "maxLengthDigit" ? " " + "digits" : " " + "characters";
        message = value + " " + "should be smaller than" + " " + valData + cStr;
      } else if (i == "matchWith" && form[val] != form[valData]) {
        let value = (val.charAt(0).toUpperCase() + val.slice(1))
          .split("_")
          .join(" ");
        let value2 = (valData.charAt(0).toUpperCase() + valData.slice(1))
          .split("_")
          .join(" ");
        message = fireBaseMsg.matchWith;
      } else if (i == "email" && validEmailRegex.test(form[val]) == false) {
        message = fireBaseMsg.valid_email;
      } else if (i == "numeric" && numberRegex.test(form[val]) == false) {
        let value = (val.charAt(0).toUpperCase() + val.slice(1))
          .split("_")
          .join(" ");
        if (value.length != 15) {
          message = value + " " + fireBaseMsg.numeric;
        }
        message = fireBaseMsg.valid_mobile;
      } else if (i == "emoji" && emojiRegexp.test(form[val]) == true) {
        let value = (val.charAt(0).toUpperCase() + val.slice(1))
          .split("_")
          .join(" ");
        message = fireBaseMsg.emoji + " " + value;
      } else if (i === "fee" && numberRegex.test(form[val]) === false) {
        message = "Please enter a valid consultation fee";
      } else if (i == "weblink" && urlRegex.test(form[val]) == false) {
        message = fireBaseMsg.valid_url;
      } else if (i == "password" && strongPassword.test(form[val]) == false) {
        let value = (val.charAt(0).toUpperCase() + val.slice(1))
          .split("_")
          .join(" ");
        message = value + " " + fireBaseMsg.valid_password;
      } else if (
        i == "alphabetsOnly" &&
        alphabetsOnlyRegex.test(form[val]) == false
      ) {
        let value = (val.charAt(0).toUpperCase() + val.slice(1))
          .split("_")
          .join(" ");
        message = value + " " + fireBaseMsg.alphabetsOnly;
      } else if (
        i == "companyName" &&
        companyNameRegex.test(form[val]) == false
      ) {
        let value = (val.charAt(0).toUpperCase() + val.slice(1))
          .split("_")
          .join(" ");
        message = fireBaseMsg.companyName;
      } else if (i == "pinCode" && pinCodeRegex.test(form[val]) == false) {
        let value = (val.charAt(0).toUpperCase() + val.slice(1))
          .split("_")
          .join(" ");
        message = fireBaseMsg.pinCode;
      }
      if (message && form?.validators[val]?.required) {
        isValidForm = false;
        form.validators[val].error = message;
      } else {
        form.validators[val].error = "";
      }
    }
  }
  return {
    value: form,
    status: isValidForm,
  };
}
