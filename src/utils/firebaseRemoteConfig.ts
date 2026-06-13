// import remoteConfig from "@react-native-firebase/remote-config";
// import { appLogs } from "./helper";
// import { BASE_URLS } from "../appRedux/apis/commonValue";

export let keys = {
  msg: {
    r_n: "Please enter name", //empty condition for name
    r_f_n: "Please enter a first name", //empty condition for first name
    r_l_n: "Please enter a last name", //empty condition for last name
    r_u_n: "Please enter a user name", //empty condition for username

    v_n: "Please enter a valid name", //required condition for name
    v_f_n: "Please enter a valid first name", //required condition for first name
    v_l_n: "Please enter a valid last name", //required condition for last name
    v_u_n: "Please enter a valid user name", //required condition for username

    r_e: "Please enter your email", //required condition for email
    v_e: "Please enter valid email", //validation condition for email

    r_ph: "Please enter your phone number", //required condition for phone number
    r_mb: "Please enter your mobile number", //required condition for mobile number

    r_p: "Please enter your password", //empty condition for password(signup screen)
    r_c_p: "Please enter old password", //empty condition for current password(change password screen)
    r_n_p: "Please enter your new password", //empty condition for new password(change password screen)
    r_co_p: "Please enter your confirm password", //empty condition for confirm password
    v_l_p: "Please enter a valid password",
    o_w_p:
      "Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.",
    s_c_p:
      "Confirm Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.", //validation condition for passwords(new,old,confirm)
    s_c_p_p:
      "Confirm Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.",
    c_p_p:
      "Confirm Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.",
    v_c_p_p:
      "Confirm Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.",
    v_p: "Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.", //validation condition for passwords(new,old,confirm)
    v_c_p:
      "Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.", //validation condition for passwords(new,old,confirm)
    v_n_p:
      "Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.", //validation condition for passwords(new,old,confirm)
    v_co_p:
      "Password should be between 8 to 15 characters and should contain atleast one uppercase, one lowercase ,one number and one special character.", //validation condition for passwords(new,old,confirm)
    c_n_p: "Password and Confirm password must be the same",
    v_n_c_p: "New password and confirm password must be the same", //confirm password does not match password or new password

    r_z_c: "Please enter your zip code", //required condition for zip code

    r_i: "Please select image", //required condition for image

    r_a: "Please select address", //required condition for address

    r_o: "Please enter OTP", //required condition for otp
    i_o: "Invalid OTP", //otp does not match

    b_i_r: "Please enter bio",
    r_t_p: "Please agree with Terms and Condition and Privacy Policy", //required condition for terms and conditions & privacy policy
    // l_n: ""s,
  },

  Kpass: "MediDoctorAppRandom@123",
  google_place_api_key:
    "UVVsNllWTjVRMFEwV0daQlUwaEVNMDFzTm05M01EZEVWMnAzV0dwR2MyTlNURXN3UkVJd01lZGlEb2N0b3JBcHBSYW5kb21AMTIzVVZWc05sbFdUalZSTUZFd1YwZGFRbFV3YUVWTk1ERnpUbTA1TTAxRVpFVldNbkF6VjBkd1IyTXlUbE5VUlhOM1VrVkpkMDFsWkdsRWIyTjBiM0pCY0hCU1lXNWtiMjFBTVRJeg==",

  lengths: {
    min_n: 1, //minimum length of name
    max_n: 45, //maximum length of name
    max_e: 50, //maximum email length
    min_p: 8, //minimum password length
    max_p: 16, //maximum password length
    min_m: 7, //minimum phone number length
    max_m: 15, //maximum phone number length
    min_z_c: 4, //minimum zip code length
    max_z_c: 10, //maximum zip code length
  },
};
