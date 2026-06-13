import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  AppButton,
  AppDropdown,
  AppDropdownRef,
  AppInput,
  AppPickerButton,
  DropdownType,
  GoogleApiAddressList,
  Header,
  ImageLoadView,
  KeyboardScroll,
} from "../../../components";
import {
  createEditProfileAction,
  getSpecialityEducation,
} from "../../../redux/actions/userSessionAction";
import { buttonLoading } from "../../../redux/reducer/loadingReducer";
import imagePath from "../../../theme/imagePath";
import CountryPicker from "../../../utils/countryPicker";
import { ValidateFormType } from "../../../utils/helper";
import { translateText } from "../../../utils/language";
import {
  maxLengthMobile,
  maxLengthName,
  ValidateForm,
} from "../../../utils/validation";
import styles from "./styles";
import { Colors } from "../../../theme";
import GoogleSearch from "../../../utils/googleSearch";
import { showToastMessage } from "../../../utils/toast";

const CreateProfile = (props: any) => {
  const dispatch = useDispatch();
  const { buttonLoader } = useSelector((state: any) => state.loading);
  const phoneRef = useRef<TextInput>(null);
  const [keyboardStatus, setKeyboardStatus] = useState<number | boolean>(false);
  const [isModalVisibleCode, setModalVisibleCode] = useState(false);
  const dropdownRef = useRef<AppDropdownRef>(null);
  const { userData } = useSelector((state: any) => state.session);
  const [speciality, setSpeciality] = useState<any>(null);
  const [education, setEducation] = useState<any>(null);
  const [specialityList, setSpecialityList] = useState<any[]>([]);
  const [educationList, setEducationList] = useState<any[]>([]);
  const [isDropdownLoaded, setIsDropdownLoaded] = useState(false);
  const [showGooglePlace, setShowGooglePlace] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [locationMapVisible, setLocationMapVisible] = useState(false);
  const placesRef = useRef<TextInput>(null);
  const [dropdownType, setDropdownType] = useState<DropdownType>("SPECIALITY");
  type Certificate = {
    uri: string;
    type: string;
    name: string;
  };
  const [location, setLocation] = useState({
    latitude: 33.749,
    longitude: -84.388,
    address: "",
  });
  const [profileForm, setProfileForm] = useState<{
    name: string;
    phone_code: string;
    phone_number: string;
    speciality: string;
    address: string;
    education: string;
    publications: string;
    consultation_fee: string;
    clinic_name: string;
    profile_picture: string;
    language?: string;
    certificates: Certificate[];
    validators: {
      name: {
        required: boolean;
        alphabetsOnly: boolean;
        error: string;
        minLength: number;
        maxLength: number;
      };
      clinic_name: {
        required: boolean;
        error: string;
        minLength: number;
        maxLength: number;
      };
      address: { required: boolean; error: string };
      language: {
        required: boolean;
        minLength: number;
        // alphabetsOnly: boolean;
        error: string;
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
      publications: {
        required: boolean;
        error: string;
        minLength: number;
        maxLength: number;
      };
      consultation_fee: {
        required: boolean;
        error: string;
        // numeric: boolean;
        fee: boolean;
        minLength: number;
        maxLength: number;
      };
      certificates: { required: boolean; error: string };
    };
  }>({
    name: "",
    phone_code: "+1",
    phone_number: "",
    speciality: "",
    education: "",
    publications: "",
    consultation_fee: "",
    profile_picture: "",
    certificates: [],
    address: "",
    language: "",
    clinic_name: "",

    validators: {
      name: {
        required: true,
        alphabetsOnly: true,
        minLength: 2,
        maxLength: 40,
        error: "",
      },
      address: {
        required: true,
        error: "",
      },
      phone_number: {
        required: true,
        numeric: true,
        minLengthDigit: 7,
        maxLengthDigit: 15,
        error: "",
      },
      speciality: {
        required: true,
        error: "",
      },
      education: {
        required: true,
        error: "",
      },
      clinic_name: {
        required: true,
        minLength: 2,
        maxLength: 150,
        error: "",
      },
      publications: {
        required: true,
        minLength: 2,
        maxLength: 150,
        error: "",
      },
      consultation_fee: {
        required: true,
        // numeric: true,
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

  useEffect(() => {
    if (buttonLoader) {
      const handleBackButtonClick = () => {
        return true;
      };

      let backEvent = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButtonClick,
      );

      return () => {
        backEvent.remove();
      };
    }
  }, [buttonLoader]);

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

  const fetchDropdownData = async (type: DropdownType) => {
    if (type === "SPECIALITY") {
      return specialityList;
    }
    return educationList;
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardStatus(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardStatus(0);
    });
    const hideSubscriptionDid = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      hideSubscriptionDid.remove();
    };
  }, []);

  const methodSetupProfile = (key: string, value: string): void => {
    const dic: any = { ...profileForm };
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
    if (dic.validators && dic.validators[key]) {
      dic.validators[key].error = "";
    }
    setProfileForm(dic);
  };

  const methodProfileApi = () => {
    Keyboard.dismiss();
    const validForm: ValidateFormType = ValidateForm(profileForm);
    setProfileForm({ ...profileForm });

    if (validForm.status) {
      const request: any = { ...profileForm };
      delete request.validators;
      // delete request.certificates;

      const formData = new FormData();
      formData.append("name", request?.name);
      formData.append("phone_code", request?.phone_code);
      formData.append("phone_number", request?.phone_number);
      formData.append("speciality_id", request?.speciality);
      formData.append("degree_id", request?.education);
      formData.append("publications", request?.publications);
      formData.append("fee", request?.consultation_fee);
      const cleanedLanguage = request.language
        .replace(/\s*,\s*/g, ",")
        .replace(/,+$/, "");

      formData.append("language", cleanedLanguage);
      formData.append("clinic_address", request.address);
      formData.append("clinic_name", request.clinic_name);
      formData.append("type", "create");

      if (profileForm?.profile_picture) {
        formData.append("profile_picture", {
          uri: profileForm?.profile_picture,
          type: "image/jpeg",
          name: "image_" + Math.floor(Date.now() / 1000) + ".jpeg",
        });
      }

      // // Add certificates if any

      if (profileForm.certificates.length > 0) {
        profileForm.certificates.forEach((cert, index) => {
          formData.append("document[]", {
            uri: cert.uri,
            type: cert.type || "image/jpeg",
            name:
              cert.name ||
              `document_${index}_${Math.floor(Date.now() / 1000)}.jpeg`,
          } as any);
        });
      }

      console.log("formData======", JSON.stringify(formData));

      dispatch(buttonLoading(true));
      dispatch(createEditProfileAction(formData)).then((res: boolean) => {
        console.log("createEditProfileAction res>>", res);
        dispatch(buttonLoading(false));
        if (res) {
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
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

  const methodSetCountryCode = (code: any) => {
    methodSetupProfile("phone_code", code.dial_code);
    setModalVisibleCode(false);
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

  return (
    <View
      pointerEvents={buttonLoader ? "none" : "auto"}
      style={styles.container}
    >
      <Header
        title={translateText("create_profile")}
        // leftIcon={imagePath.goBackImgpng}
        // onPressLeft={() => props?.navigation.goBack()}
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
            activeOpacity={0.8}
            onPress={() => {
              methodUploadImage();
            }}
            style={styles.add_photo_view}
          >
            <Image
              source={imagePath.add_icon}
              resizeMode="contain"
              style={styles.edit_icon}
            />
            <Text style={styles.add_photo_text}>Add Photo</Text>
          </TouchableOpacity>
        </View>
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
                <Image
                  source={{ uri: item.uri }}
                  style={styles.certificateImage}
                />
              </View>
            ))}
          </View>
        )}

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
          multiline={false}
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
            display: profileForm?.validators?.address?.error ? "flex" : "none",
          }}
        >
          {profileForm?.validators?.address?.error}
        </Text>

        {keyboardStatus ? (
          <></>
        ) : (
          <AppButton
            title={translateText("continue")}
            onPress={() => {
              methodProfileApi();
            }}
            isLoading={buttonLoader}
          />
        )}
      </KeyboardScroll>
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
            // latitude: data?.lat,
            // longitude: data?.long,
            validators: {
              ...profileForm.validators,
              address: {
                ...profileForm.validators.address,
                error: "",
              },
            },
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
    </View>
  );
};

export default CreateProfile;
