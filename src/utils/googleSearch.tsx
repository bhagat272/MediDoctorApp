import React, { useRef } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
  SafeAreaView,
  Platform,
} from "react-native";
import Colors from "../theme/colors";
import imagePath from "../theme/imagePath";
import {
  GooglePlacesAutocomplete,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import fonts from "../theme/fonts";
import { translateText } from "./language";
import { methodSecurityDecoded } from "./helper";
import { keys } from "./firebaseRemoteConfig";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface GoogleSearchProps {
  showGoogleSearch: boolean;
  onBack: () => void;
  onSubmit: (location: Location) => void;
}

const GoogleSearch: React.FC<GoogleSearchProps> = ({
  showGoogleSearch,
  onBack,
  onSubmit,
}) => {
  const placesRef = useRef<any>(null);
  const GOOGLE_PLACE_KEY = methodSecurityDecoded(keys.google_place_api_key);
  // Handle press event from GooglePlacesAutocomplete
  const handlePress = (data: any, details: GooglePlaceDetail | null = null) => {
    if (details) {
      const location: Location = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        address: data.description,
      };
      onSubmit(location);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal transparent visible={showGoogleSearch} onRequestClose={onBack}>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <View style={styles.searchBar}>
              <TouchableOpacity activeOpacity={0.6} onPress={onBack}>
                <Image
                  source={imagePath.goBackImgpng}
                  style={styles.backLogo}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <Text style={styles.textSearch}>
                {translateText("search_address")}
              </Text>
            </View>

            <GooglePlacesAutocomplete
              ref={placesRef}
              placeholder={translateText("enter_location")}
              fetchDetails
              onFail={(err) => {
                console.log("errrr===", { err });
              }}
              renderDescription={(row) => row.description}
              onPress={handlePress}
              query={{
                key: GOOGLE_PLACE_KEY,
                language: "en",
              }}
              textInputProps={{
                placeholderTextColor: Colors.primary.BLACK, // REQUIRED
              }}
              styles={{
                textInputContainer: {
                  height: 50,
                },
                textInput: {
                  height: 50,
                  backgroundColor: Colors.primary.WHITE,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Colors.primary.BLACK,
                  fontFamily: fonts.Poppins_Regular,
                },
              }}
              nearbyPlacesAPI="GooglePlacesSearch"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GoogleSearch;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00000022",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: Platform.OS === "ios" ? 35 : 5,
    marginBottom: 20,
  },
  subContainer: {
    height,
    width,
    backgroundColor: Colors.primary.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  backLogo: {
    height: 40,
    width: 40,
    // transform: [{ rotate: '180deg' }],
  },
  textSearch: {
    fontSize: 20,
    color: Colors.primary.BLACK,
    fontFamily: fonts.Poppins_SemiBold,
    marginHorizontal: 15,
    flex: 1,
  },
});
