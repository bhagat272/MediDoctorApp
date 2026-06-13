import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Keyboard,
  BackHandler,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { Colors, Fonts } from "../theme";
import imagePath from "../theme/imagePath";
import { methodSecurityDecoded } from "../utils/helper";
import { GOOGLE_PLACE_KEY } from "../redux/apis/commonValue";
import { hasNotch } from "react-native-device-info";
import fonts from "../theme/fonts";

// Define the structure for a prediction returned by the API
interface PlacePrediction {
  description: string;
  placeId: string;
  // Include additional properties as needed.
}
interface AppInputProps {
  placeholder?: string;
  commonInputContainerStyle?: object;
  commonMapContainerStyle?: object;
  commonTextInputStyle?: object;
  addreshInputCommon?: object;
  mapText?: object;
  keyboardType?: any;
  returnKeyType?: any;
  map?: any;
  visible?: any;
  value?: string;
  onChangeText?: ((text: string) => void) | undefined;
  getRef: any;
  onPressAddress: any;
  onCancel: any;
  initialLocation?: any;
  showDefaultLocation?: boolean;
  setShowDefaultLocation?: any;
}

// const GOOGLE_PLACE_KEY_DECODE = methodSecurityDecoded(GOOGLE_PLACE_KEY);
const GOOGLE_PLACE_KEY_DECODE = GOOGLE_PLACE_KEY;

const GoogleApiAddressList: React.FC<AppInputProps> = (props: any) => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const { visible, onConfirm, onCancel } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [location, setLocation] = useState<any>({});
  const [isAddressSelected, setIsAddressSelected] = useState<boolean>(false);
  const { onPressAddress } = props;
  useEffect(() => {
    if (searchText.length > 0 && searchText.length < 25) {
      fetchPredictions();
    } else setPredictions([]);
  }, [searchText]);

  const fetchPlaceDetails = async (placeId: string) => {
    console.log("placeId---->", placeId);

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: "GET",
          headers: {
            "X-Goog-FieldMask": "*",
            "X-Goog-Api-Key": GOOGLE_PLACE_KEY,
          },
        },
      );

      const json = await response.json();
      // console.log(' fetchPlaceDetails json---->', json?.location);
      //   console.log(" fetchPlaceDetails json value---->", JSON.stringify(json));

      return {
        lat: json?.location?.latitude,
        long: json?.location?.longitude,
        addressName: json?.displayName?.text + ", " + json?.formattedAddress,
        city: json?.addressComponents?.find((component: any) =>
          component?.types?.includes("locality"),
        )?.longText,
        country: json?.addressComponents?.find((component: any) =>
          component?.types?.includes("country"),
        )?.longText,
        zipCodeNumber: json?.postalAddress?.postalCode
          ? json?.postalAddress?.postalCode
          : "",
      };
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    }
  };

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const data = {
        input: searchText,
        locationBias: {
          circle: {
            center: { latitude: 37.7937, longitude: -122.3965 },
            radius: 500.0,
          },
        },
      };

      const response = await fetch(
        "https://places.googleapis.com/v1/places:autocomplete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_PLACE_KEY_DECODE,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      const result = JSON.stringify(json);
      //console.log('result---->', result);

      // Assuming the API returns a field named "predictions"
      setPredictions(json.suggestions || []);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItemSearchList = ({ item }: { item: PlacePrediction }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.itemContainer}
        onPress={async () => {
          setIsLoading(true);
          const locations = await fetchPlaceDetails(
            item?.placePrediction?.placeId,
          );
          if (locations) {
            // console.log("locations--" + JSON.stringify(locations));
            // props.onPressAddress({...item, ...location});
            Keyboard.dismiss();
            setIsLoading(false);
            setLocation(locations);
            setSearchText(locations?.addressName);
            setPredictions([]);
            setIsAddressSelected(true);
            //props.onPressAddress({...location});

            // setTimeout(() => {
            //   setSearchText('');
            //   props.onPressAddress({...locations});
            // }, 300);
          }
        }}
      >
        <Text style={[props.addreshInputCommon, styles.addreshInputStyle]}>
          {item?.placePrediction?.text?.text}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={false}
      onRequestClose={onCancel}
      visible={visible}
    >
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 15,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setSearchText("");
                setPredictions([]);
                setLocation({});
                setIsAddressSelected(false);
                onCancel();
              }}
            >
              <Image
                source={imagePath.goBackImgpng}
                resizeMode="contain"
                style={styles.back_Img}
              />
            </TouchableOpacity>
            <Text style={[styles.map_text]}>Location Search</Text>
            <View style={{ width: 30 }} />
          </View>
          <View style={[styles.input_view, props.commonInputContainerStyle]}>
            <TextInput
              onChangeText={(e) => {
                setSearchText(e);
              }}
              ref={props.getRef}
              value={searchText}
              placeholder={props.placeholder}
              placeholderTextColor={Colors.primary.BLACK}
              keyboardType={props.keyboardType || "default"}
              returnKeyType={props.returnKeyType}
              style={[props.commonTextInputStyle, styles.text_input_style]}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setSearchText("");
                setPredictions([]);
                setLocation({});
                setIsAddressSelected(false);
              }}
              style={{
                display: searchText ? "flex" : "none",
              }}
            >
              <Image
                source={imagePath.cancel}
                resizeMode="contain"
                style={styles.close_Img}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={predictions}
            renderItem={renderItemSearchList}
            keyExtractor={(item) => item?.placePrediction?.placeId}
            style={{ display: predictions?.length ? "flex" : "none", flex: 1 }}
            extraData={predictions}
            keyboardShouldPersistTaps="always"
          />

          {isLoading ? (
            <ActivityIndicator
              animating={isLoading}
              size="large"
              color="blue"
              style={{
                position: "absolute",
                top: Dimensions.get("window").height / 2 - 20,
                left: Dimensions.get("window").width / 2 - 10,
                zIndex: 1,
              }}
            />
          ) : (
            <></>
          )}

          {props?.map ? (
            <MapView
              showsUserLocation={true}
              region={{
                latitude: !location?.lat ? 38.7946 : Number(location?.lat),
                longitude: !location?.lat ? 106.5348 : Number(location?.long),
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0121,
              }}
              // provider={
              //   Platform.OS == 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE
              // }
              style={[styles.map_view, props?.commonMapContainerStyle]}
            >
              <Marker
                //key={001}
                coordinate={{
                  latitude: location?.lat
                    ? Number(location?.lat)
                    : Number(38.7946),
                  longitude: location?.long
                    ? Number(location?.long)
                    : Number(106.5348),
                }}
              ></Marker>
            </MapView>
          ) : (
            <></>
          )}
        </View>

        {isAddressSelected && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // onConfirm();
              //console.log('ON CONFIRM', location);
              props.onPressAddress({ ...location });
              setTimeout(() => {
                setSearchText("");
                setLocation({});
                setIsAddressSelected(false);
              }, 300);
            }}
            style={{
              position: "absolute",
              bottom: Platform.OS == "ios" ? 70 : 50,
              alignSelf: "center",
              backgroundColor: Colors.primary.BLACK,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              height: 48,
              width: "40%",
            }}
          >
            <Text
              style={{
                fontSize: Fonts.SIZE_16,
                fontFamily: fonts.Poppins_Medium,
                color: "#fff",
              }}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // methodGetCurrentLocation();
          }}
          style={{
            position: 'absolute',
            bottom: Platform.OS == 'ios' ? 50 : 30,
            right: 20,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: Colors?.primary?.WHITE,
          }}>
          <Image
            source={imagePath.location}
            style={{width: 30, height: 30}}
            tintColor={'#4B93FE'}
            resizeMode="contain"
          />
        </TouchableOpacity> */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hasNotch() ? 50 : 20,
  },

  input_view: {
    height: 50,
    width: "90%",
    marginTop: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.primary.WHITE,
    paddingHorizontal: 15,
    borderColor: Colors.primary.GREY,
    borderWidth: 1,
    marginBottom: 10,
  },
  map_view: {
    flex: 1,
    borderRadius: 12,
  },
  close_Img: {
    height: 26,
    width: 26,
  },
  back_Img: {
    height: 35,
    width: 35,
    //tintColor: 'grey',
  },
  text_input_style: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.BLACK,
    flex: 1,
  },
  addreshInputStyle: {
    fontFamily: Fonts.Poppins_Medium,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.BLACK,
    flex: 1,
  },
  map_text: {
    fontFamily: Fonts.Poppins_Bold,
    fontSize: Fonts.SIZE_15,
    color: Colors.primary.BLACK,
    //flex: 1,
  },
  itemContainer: {
    paddingVertical: 10,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default GoogleApiAddressList;
