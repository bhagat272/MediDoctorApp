import {
  View,
  Keyboard,
  BackHandler,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { Activity, useEffect, useRef, useState } from "react";
import styles from "./styles";
import {
  AppButton,
  AppDropdown,
  AppDropdownRef,
  AppHeader,
  AppInput,
  AppPickerButton,
  DropdownType,
  FullScreenImage,
  GoogleApiAddressList,
  Header,
  ImageLoadView,
  KeyboardScroll,
} from "../../../components";
import imagePath from "../../../theme/imagePath";
import {
  maxLengthMobile,
  maxLengthName,
  ValidateForm,
} from "../../../utils/validation";
import { updateUserData, ValidateFormType } from "../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  createEditProfileAction,
  getSpecialityEducation,
  manageProfilePictureAction,
} from "../../../redux/actions/userSessionAction";
import { buttonLoading, loading } from "../../../redux/reducer/loadingReducer";
import { translateText } from "../../../utils/language";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "../../../theme";
import GoogleSearch from "../../../utils/googleSearch";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { IMAGE_URL } from "../../../redux/apis/commonValue";
import { AppConstant } from "../../../constants/appconstant";
import CountryPicker from "../../../utils/countryPicker";
import { showToastMessage } from "../../../utils/toast";
type Certificate = {
  uri: string;
  type: string;
  name: string;
};
interface ProfileFormType {
  name: string;
  clinic_name: string;
  email: string;

  publications: string;
  address: string;
  phone_code: string;
  phone_number: string;
  latitude: string;
  longitude: string;
  consultation_fee: string;
  speciality: string;
  profile_picture: string;
  certificates: Certificate[];
  education: string;
  language: string;
  validators: {
    name: {
      required: boolean;
      error: string;
      alphabetsOnly: boolean;
      minLength: number;
      maxLength: number;
    };
    language: {
      required: boolean;
      minLength: number;
      // alphabetsOnly: boolean;
      error: string;
    };

    clinic_name: {
      required: boolean;
      error: string;
      minLength: number;
      maxLength: number;
    };
    phone_number: {
      required: boolean;
      error: string;
      numeric: boolean;
      minLengthDigit: number;
      maxLengthDigit: number;
    };
    speciality: { required: boolean; error: string };
    education: { required: boolean; error: string };
    address: { required: boolean; error: string };
    publications: {
      required: boolean;
      error: string;
      minLength: number;
      maxLength: number;
    };
    consultation_fee: {
      required: boolean;
      error: string;
      fee: boolean;
      minLength: number;
      maxLength: number;
    };
    certificates: { required: boolean; error: string };
  };
}

const EditProfile = (props: any) => {
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();
  const { buttonLoader } = useSelector((state: any) => state.loading);
  const { userData } = useSelector((state: any) => state.session);
  const [selectDate, setSelectDate] = useState(false);
  const [showGooglePlace, setShowGooglePlace] = useState(false);
  const [isModalVisibleCode, setModalVisibleCode] = useState(false);
  const placesRef = useRef<TextInput>(null);
  const [locationMapVisible, setLocationMapVisible] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormType>({
    name: "",
    email: "",

    clinic_name: "",
    publications: "",
    address: "",
    education: "",
    phone_code: "+1",
    phone_number: "",
    speciality: "",
    latitude: "",
    longitude: "",
    consultation_fee: "",
    profile_picture: "",
    certificates: [],
    language: "",
    validators: {
      name: {
        required: true,
        alphabetsOnly: true,
        minLength: 2,
        maxLength: 40,
        error: "",
      },
      education: {
        required: true,
        error: "",
      },
      speciality: {
        required: true,
        error: "",
      },
      clinic_name: {
        required: true,
        minLength: 2,
        maxLength: 150,
        error: "",
      },
      phone_number: {
        required: true,
        numeric: true,
        minLengthDigit: 7,
        maxLengthDigit: 15,
        error: "",
      },
      address: {
        required: true,
        error: "",
      },
      publications: {
        required: true,
        minLength: 2,
        maxLength: 50,
        error: "",
      },
      consultation_fee: {
        required: true,
        fee: true,
        minLength: 1,
        maxLength: 10,
        error: "",
      },
      certificates: {
        required: true,
        error: "",
      },
      language: {
        required: true,
        minLength: 2,
        // alphabetsOnly: true,
        error: "",
      },
    },
  });
  const dropdownRef = useRef<AppDropdownRef>(null);
  const [speciality, setSpeciality] = useState<any>(null);
  const [education, setEducation] = useState<any>(null);
  const [specialityList, setSpecialityList] = useState<any[]>(
    userData?.speciality,
  );
  const [showImage, setShowImage] = useState(false);
  const [educationList, setEducationList] = useState<any[]>([]);
  const [isDropdownLoaded, setIsDropdownLoaded] = useState(false);
  const phoneRef = useRef<TextInput>(null);
  const isProfileInitialized = useRef(false);
  const [location, setLocation] = useState({
    latitude: 33.749,
    longitude: -84.388,
    address: "",
  });
  const [selectCertifiacteImage, setSelectCertifiacteImage] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState<DropdownType>("SPECIALITY");

  // Set up the header with a custom left image and back navigation.
  useEffect(() => {
    const loadDropdownData = async () => {
      if (isDropdownLoaded) return;

      const res = await dispatch(getSpecialityEducation({}));

      if (res?.status) {
        setSpecialityList(res?.data?.speciality || []);
        setEducationList(res?.data?.education_level || []);
        setIsDropdownLoaded(true);
      }
    };

    loadDropdownData();
  }, []);

  // Disable hardware back button press when a request is in progress.
  useEffect(() => {
    if (buttonLoader) {
      const handleBackButtonClick = () => true;
      let backEvent = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButtonClick,
      );
      return () => {
        backEvent.remove();
      };
    }
  }, [buttonLoader]);

  const fetchDropdownData = async (type: DropdownType) => {
    if (type === "SPECIALITY") {
      return specialityList;
    }
    return educationList;
  };

  const formSetup = () => {
    if (!userData) return;
    if (isProfileInitialized.current) return;
    if (!specialityList.length || !educationList.length) return;

    isProfileInitialized.current = true;

    // SPECIALITY
    if (userData?.speciality_id) {
      console.log(userData?.speciality_id);
      const spec = specialityList.find(
        (i) => i.id.toString() === userData.speciality_id.toString(),
      );
      if (spec) {
        console.log(spec);
        setSpeciality(spec);
        methodSetupProfile("speciality", spec.id.toString());
      }
    }

    // EDUCATION
    if (userData?.degree_id) {
      const edu = educationList.find(
        (i) => i.id.toString() === userData.degree_id.toString(),
      );
      if (edu) {
        setEducation(edu);
        methodSetupProfile("education", edu.id.toString());
      }
    }
    const mappedCertificates =
      userData?.documents?.map((doc: any, index: number) => ({
        uri: doc.image, // API image URL
        type: "image/jpeg", // default type
        name: `document_${index}.jpg`, // required for FormData
      })) || [];

    // REST FIELDS
    setProfileForm((prev) => ({
      ...prev,
      name: userData.name ?? "",
      email: userData.email ?? "",
      clinic_name: userData.clinic_name ?? "",
      publications: userData.publications ?? "",
      address: userData.clinic_address ?? "",
      language: userData.language ?? "",
      phone_code: userData.phone_code ?? "+1",
      phone_number: userData.phone_number ?? "",
      consultation_fee: userData.fee ? String(userData.fee) : "",
      latitude: userData.lat ?? "",
      longitude: userData.lng ?? "",
      certificates: mappedCertificates,
      profile_picture: userData.profile_picture ?? "",
      speciality: userData?.speciality_id
        ? userData.speciality_id.toString()
        : "",
      education: userData?.degree_id ? userData.degree_id.toString() : "",
    }));
  };

  // When userData is available from Redux, populate the profileForm with the existing data.
  useEffect(() => {
    formSetup();
  }, [userData, specialityList, educationList]);

  const MAX_CERTIFICATES = 10;

  const methodUploadCertificate = () => {
    Keyboard.dismiss();
    if (profileForm.certificates.length >= MAX_CERTIFICATES) {
      showToastMessage(
        "You can upload a maximum of 10 certificates",
        "warning",
      );
      return;
    }
    props.navigation.navigate("ImageController", {
      mediaType: "photo",
      onSuccess: (res: any) => {
        if (res?.path) {
          const newCertificate = {
            uri: res.path,
            type: "image/jpeg",
            name: `certificate_${Math.floor(Date.now() / 1000)}.jpeg`,
          };
          setProfileForm({
            ...profileForm,
            certificates: [...profileForm.certificates, newCertificate],
            validators: {
              ...profileForm.validators,
              certificates: {
                ...profileForm.validators.certificates,
                error: "",
              },
            },
          });
        }
      },
    });
  };

  const methodSetupProfile = (key: string, value: string): void => {
    const dic: any = { ...profileForm };
    // Remove emojis and certain special characters.
    value = value.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    );

    if (key === "name") {
      value = value
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/\s+/g, " ")
        .replace(/^\s/, "");
    }
    if (key === "language") {
      value = value
        .replace(/[^a-zA-Z, ]/g, "")
        .replace(/\s+/g, " ")
        .replace(/,+/g, ",")
        .replace(/^[,\s]+/, "")

        .replace(/^\s+/, "");
    }

    if (key == "consultation_fee" || key == "phone_number") {
      // Remove leading zeros
      value = value.replace(/^0+/, "");
      // If empty after removing zeros, keep empty string
      if (value === "") {
        value = "";
      }
    }

    dic[key] = value;
    // Clear the error message if any validation error existed for this field.
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = "";
    }
    setProfileForm(dic);
  };

  const methodProfileApi = () => {
    Keyboard.dismiss();
    const validForm: ValidateFormType = ValidateForm(profileForm);
    // Update state to display validation errors (if any).
    setProfileForm({ ...profileForm });

    if (validForm.status) {
      const request: any = { ...profileForm };
      // Remove validators before submission.
      delete request.validators;

      // Prepare the form data to be sent to the API.
      const formData = new FormData();
      formData.append("name", request.name);
      formData.append("phone_code", request?.phone_code);
      formData.append("phone_number", request?.phone_number);
      formData.append("publications", request.publications);
      formData.append("speciality_id", request?.speciality);
      formData.append("degree_id", request?.education);
      formData.append("fee", request?.consultation_fee);
      formData.append("clinic_address", request.address);
      formData.append("clinic_name", request.clinic_name);
      const cleanedLanguage = request.language
        .replace(/\s*,\s*/g, ",")
        .replace(/,+$/, "");

      formData.append("language", cleanedLanguage);

      // formData.append("latitude", request.latitude);
      // formData.append("longitude", request.longitude);

      // Only append the profile picture if it's a local image (does not include 'http').
      if (
        profileForm?.profile_picture &&
        !profileForm?.profile_picture?.includes("http")
      ) {
        formData.append("profile_picture", {
          uri: profileForm?.profile_picture,
          type: "image/jpeg",
          name: "image_" + Math.floor(Date.now() / 1000) + ".jpeg",
        });
      }

      if (profileForm.certificates.length > 0) {
        profileForm.certificates.forEach((cert, index) => {
          formData.append("document[]", {
            uri: cert.uri,
            type: "image/jpeg",
            name:
              cert.name ||
              `document_${index}_${Math.floor(Date.now() / 1000)}.jpeg`,
          } as any);
        });
      }
      console.log("formData======>", JSON.stringify(formData));

      // Dispatch loading state and submit the form via Redux action.
      dispatch(buttonLoading(true));
      dispatch(loading(true));
      dispatch(createEditProfileAction(formData)).then((res: boolean) => {
        dispatch(buttonLoading(false));
        if (res) {
          dispatch(loading(false));
          // On successful profile update, reset navigation to the 'BottomTab' screen.
          props.navigation.goBack();
        }
      });
    }
  };

  const methodUploadImage = () => {
    props.navigation.navigate("ImageController", {
      mediaType: "photo",
      onSuccess: (res: any) => {
        if (res?.path) {
          setProfileForm({ ...profileForm, profile_picture: res?.path });
        }
      },
    });
  };

  const removeCertificate = (index: number) => {
    const updatedCertificates = profileForm.certificates.filter(
      (_, i) => i !== index,
    );

    setProfileForm({
      ...profileForm,
      certificates: updatedCertificates,
    });
  };

  const methodSetCountryCode = (code: any) => {
    methodSetupProfile("phone_code", code.dial_code);
    setModalVisibleCode(false);
  };

  const methodDeleteImage = () => {
    if (
      !profileForm?.profile_picture?.includes("http") ||
      !profileForm?.profile_picture?.includes("https")
    ) {
      setProfileForm({ ...profileForm, profile_picture: "" });
      return;
    }
    let dic = {
      profile_picture: "",
      key: 1,
    };
    dispatch(loading(true));
    dispatch(manageProfilePictureAction(dic)).then((res: any) => {
      dispatch(loading(false));
      if (res) {
        setProfileForm({ ...profileForm, profile_picture: "" });
        let userDetail: Record<string, any> = { ...userData };
        userDetail.profile_picture = "";
        updateUserData(userDetail, dispatch);
      }
    });
  };

  return (
    <View
      pointerEvents={buttonLoader ? "none" : "auto"}
      style={styles.container}
    >
      <Header
        title={translateText("edit_profile")}
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />

      <KeyboardScroll>
        {/* Profile Image Section */}
        <View style={styles.image_container_view}>
          <ImageLoadView
            source={
              profileForm?.profile_picture
                ? { uri: profileForm?.profile_picture }
                : imagePath.user_icon
            }
            resizeMode={"cover"}
            style={styles.profile_image_style}
          />
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                AppConstant.appName,
                "Are you sure you want to delete profile photo",
                [
                  {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => methodDeleteImage() },
                ],
              );
            }}
            style={{
              ...styles.delete_icon_view,
              display: profileForm?.profile_picture ? "flex" : "none",
            }}
          >
            <Image
              source={imagePath.cancel}
              resizeMode="contain"
              style={{ height: 25, width: 25 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Keyboard.dismiss();
              methodUploadImage();
            }}
            style={styles.add_photo_view}
          >
            <Image
              source={imagePath.add_icon}
              resizeMode="contain"
              style={styles.edit_icon}
            />
            <Text style={styles.add_photo_text}>Edit Photo</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label_one}>
          {translateText("basic_information")}
        </Text>
        <View style={styles.form_container}>
          {/* Name Input Field */}
          <AppInput
            value={profileForm?.name}
            inputLeftImage={imagePath.name}
            placeholder={translateText("name")}
            onChangeText={(value) => {
              if (value?.length == 1) {
                value = value.replace(/\s/g, "");
              }
              methodSetupProfile("name", value);
            }}
            returnKeyType={"done"}
            maxLength={maxLengthName}
            errorMsg={profileForm?.validators?.name?.error}
          />
          {/* Email Input Field (non-editable) */}

          <AppInput
            value={profileForm?.email}
            inputLeftImage={imagePath.email_small}
            placeholder={translateText("email")}
            returnKeyType={"done"}
            maxLength={maxLengthName}
            editable={false} // Email is not editable.
          />
          <AppPickerButton
            placeholder={translateText("select_education_level")}
            value={education?.title || ""}
            disabled={!isDropdownLoaded}
            onPress={() => {
              Keyboard.dismiss();
              setDropdownType("EDUCATION");
              setDropdownVisible(true);
            }}
            containerStyle={styles.education_btn}
            rightIcon={imagePath.down_arrrow}
            errorMsg={
              profileForm?.validators?.education?.error
                ? translateText("please_select_education")
                : ""
            }
          />
          {/* publications Input Field */}
          <AppInput
            value={profileForm?.publications}
            placeholder={translateText("enter_publications")}
            onChangeText={(value) => {
              value = value.replace(/\s+/g, " ").replace(/^\s/, "");

              methodSetupProfile("publications", value);
            }}
            returnKeyType={"done"}
            maxLength={150}
            multiline={true}
            errorMsg={profileForm?.validators?.publications?.error}
          />
          <AppInput
            value={profileForm?.language}
            placeholder={translateText("enter_language")}
            onChangeText={(value) => {
              if (value?.length == 1) {
                value = value.replace(/\s/g, "");
              }
              methodSetupProfile("language", value);
            }}
            returnKeyType={"done"}
            maxLength={150}
            errorMsg={profileForm?.validators?.language?.error}
          />

          <AppInput
            placeholder={translateText("enter_mobile_number")}
            keyboardType={"phone-pad"}
            returnKeyType={"next"}
            value={profileForm?.phone_number}
            onChangeText={(value) => {
              value = value.replace(/\s/g, "").replace(/[^0-9]/g, "");

              methodSetupProfile("phone_number", value);
            }}
            getFocus={phoneRef}
            maxLength={maxLengthMobile}
            onPressCountryCode={() => {
              setModalVisibleCode(true);
            }}
            errorMsg={profileForm?.validators?.phone_number?.error}
            country_code={profileForm?.phone_code}
          />
          <AppPickerButton
            placeholder={translateText("select_speciality")}
            value={speciality?.title || ""}
            onPress={() => {
              Keyboard.dismiss();
              setDropdownType("SPECIALITY");
              setDropdownVisible(true);
            }}
            containerStyle={styles.education_btn}
            disabled={!isDropdownLoaded}
            rightIcon={imagePath.down_arrrow}
            errorMsg={
              profileForm?.validators?.speciality?.error
                ? translateText("please_select_speciality")
                : ""
            }
          />
          <AppInput
            placeholder={translateText("enter_amount")}
            inputLeftImage={imagePath.dollar_sign}
            keyboardType={"number-pad"}
            returnKeyType={"done"}
            value={profileForm?.consultation_fee}
            onChangeText={(value) => {
              const numericValue = value.replace(/[^0-9]/g, "");
              methodSetupProfile("consultation_fee", numericValue);
            }}
            maxLength={10}
            errorMsg={profileForm?.validators?.consultation_fee?.error}
          />

          <TouchableOpacity onPress={methodUploadCertificate}>
            <View style={styles.upload_view}>
              <Image source={imagePath.green_add} style={styles.green_add} />
              <Text style={styles.upload_text}>
                {translateText("upload_certificate")}
              </Text>
            </View>
          </TouchableOpacity>
          {/* Display certificate error message */}
          {profileForm?.validators?.certificates?.error ? (
            <Text style={styles.error_message_text}>
              {translateText("please_upload_at_least_one")}
            </Text>
          ) : null}
          {profileForm.certificates?.length > 0 && (
            <View style={styles.certificateList}>
              {profileForm.certificates.map((item, index) => (
                <View key={index} style={styles.certificateWrapper}>
                  {/* Cross button */}
                  <TouchableOpacity
                    style={styles.certificateRemove}
                    onPress={() => removeCertificate(index)}
                  >
                    <Text style={styles.certificateRemoveText}>✕</Text>
                  </TouchableOpacity>

                  {/* Certificate Image */}
                  <TouchableOpacity
                    onPress={() => {
                      setSelectCertifiacteImage(item.uri);
                      setShowImage(true);
                    }}
                  >
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.certificateImage}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        <Text style={styles.label_one}>{translateText("clinic_details")}</Text>
        <View style={styles.form_container2}>
          <AppInput
            placeholder={translateText("enter_clinic_name")}
            keyboardType={"default"}
            returnKeyType={"done"}
            onChangeText={(value) => {
              value = value.replace(/\s+/g, " ").replace(/^\s/, "");
              methodSetupProfile("clinic_name", value);
            }}
            value={profileForm?.clinic_name}
            maxLength={150}
            multiline={true}
            errorMsg={profileForm?.validators?.clinic_name?.error}
          />

          {/* Address Input Field (opens GoogleSearch modal) */}
          <TouchableOpacity
            onPress={() => setLocationMapVisible(true)}
            activeOpacity={0.6}
            style={{
              ...styles.view_input,
              marginHorizontal: 20,
              borderWidth: 1,
              borderColor: Colors.secondary.LABEL,
            }}
          >
            <Image source={imagePath.location} resizeMode="contain" />
            <Text
              numberOfLines={3}
              style={[
                styles.text_input,
                {
                  color: profileForm?.address
                    ? Colors.primary.BLACK
                    : Colors.secondary.MONSOON,
                },
              ]}
            >
              {profileForm?.address || translateText("select_location")}
            </Text>
            {/* Optionally add an arrow icon here */}
          </TouchableOpacity>
          <Text
            style={{
              ...styles.error_message_text,
              display: profileForm?.validators?.address?.error
                ? "flex"
                : "none",
            }}
          >
            {profileForm?.validators?.address?.error}
          </Text>
        </View>
        {/* Button to submit the updated profile */}
        <AppButton
          title={translateText("update_profile")}
          onPress={() => {
            methodProfileApi();
          }}
          isLoading={buttonLoader}
        />
      </KeyboardScroll>

      {/* GoogleSearch Modal for selecting an Address */}
      {/* <GoogleSearch
        showGoogleSearch={showGooglePlace}
        onBack={() => {
          setShowGooglePlace(false);
        }}
        onSubmit={(res: any) => {
          setProfileForm({
            ...profileForm,
            address: res?.address,
            latitude: res?.latitude,
            longitude: res?.longitude,
          });
          setShowGooglePlace(false);
        }}
      /> */}

      <GoogleApiAddressList
        visible={locationMapVisible}
        placeholder={translateText("Search Location")}
        map={true}
        getRef={placesRef}
        initialLocation={location}
        showDefaultLocation
        //setShowDefaultLocation={setShowDefaultLocation}
        onPressAddress={(data: any) => {
          console.log(data);
          setProfileForm({
            ...profileForm,
            address: data?.addressName,
            latitude: data?.lat,
            longitude: data?.long,
          });
          setLocationMapVisible(false);
        }}
        onCancel={() => {
          setLocationMapVisible(false);
        }}
      />

      <CountryPicker
        show={isModalVisibleCode}
        closeModal={() => setModalVisibleCode(false)}
        onSelect={(value: object) => methodSetCountryCode(value)}
      />

      <AppDropdown
        visible={dropdownVisible}
        type={dropdownType}
        onClose={() => setDropdownVisible(false)}
        fetchData={fetchDropdownData}
        searchable
        onSelect={(item, type) => {
          if (type === "SPECIALITY") {
            setSpeciality(item);
            methodSetupProfile("speciality", item?.id?.toString());
          } else {
            setEducation(item);
            methodSetupProfile("education", item?.id?.toString());
          }
        }}
      />

      <Modal
        visible={showImage}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImage(false)}
      >
        <TouchableOpacity
          style={styles.image_viewer}
          onPress={() => setShowImage(false)}
        >
          <Image source={imagePath.cancel} style={styles.cross_icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fullscreenContainer}
          activeOpacity={1}
          onPress={() => setShowImage(false)}
        >
          <FullScreenImage
            uri={selectCertifiacteImage}
            imageStyle={styles.fullscreenImage}
            loaderSize="large"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default EditProfile;
