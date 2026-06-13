export const emojiRegexp =
  /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
export const urlRegex =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
export const strongPassword =
  /(?=^.{8,}$)((?=.*\d)(?=.*[\W_]+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const noSpecialChar = /^[a-zA-Z0-9- ]*$/;
export const panCardRegex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
export const gstNumberRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}[Z][0-9A-Z]{1}$/;
export const companyNameRegex = /^[a-zA-Z ]+$/;
export const alphabetsOnlyRegex = /^[a-zA-Z ]+$/;
export const pinCodeRegex = /^[0-9]+$/;
export const validEmailRegex =/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
export const numberRegex = /^\d+$/; // number
