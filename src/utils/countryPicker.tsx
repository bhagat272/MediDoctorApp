import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import font from "../theme/fonts";
import imagePath from "../theme/imagePath";
import { translateText } from "./language";
import { Colors } from "../theme";

// Type definitions
interface Country {
  name: string;
  dial_code: string;
}

interface CountryPickerProps {
  show: boolean;
  onSelect: (country: Country) => void;
  closeModal: () => void;
}

const countryData: Country[] = require("./countries.json");
const screenHeight = Dimensions.get("window").height;

const CountryPicker: React.FC<CountryPickerProps> = (props) => {
  const [searchKey, setSearchKey] = useState<string>("");
  const [data, setData] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listData, setListData] = useState<Country[]>(countryData);

  useEffect(() => {
    setIsLoading(true);
    setData(listData || []);
    setIsLoading(false);
  }, [listData]);

  const renderItem = ({ item }: { item: Country }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.onSelect(item);
          setSearchKey("");
        }}
        style={styles.countryView}
      >
        <View style={styles.country}>
          <View style={{ flex: 1 }}>
            <Text style={styles.countryText}>
              {item.name} ({item.dial_code})
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filterCountries = (value: string) => {
    setSearchKey(value);
  };

  let filteredData: Country[] = [];
  const lowercasedFilter = searchKey.toLowerCase();
  if (data.length > 0) {
    filteredData = data.filter((item) => {
      return Object.keys(item).some((key) =>
        item[key as keyof Country]
          ? item[key as keyof Country]
              .toString()
              .toLowerCase()
              .startsWith(lowercasedFilter)
          : item.name.toLowerCase().startsWith(lowercasedFilter)
      );
    });
  }

  return (
    <Modal
      animationType="slide"
      visible={props.show}
      onRequestClose={() => {
        setSearchKey("");
        props.closeModal();
      }}
    >
      <SafeAreaView style={styles.modalParent}>
        <View style={styles.modalCenter}>
          <View style={styles.modalViewStyle}>
            <TouchableOpacity
              onPress={() => {
                setSearchKey("");
                props.closeModal();
              }}
              style={{
                marginBottom: 20,
              }}
            >
              <Image
                source={imagePath.goBackImgpng}
                style={{
                  height: 40,
                  width: 40,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
            <View style={{ ...styles.searchView, borderWidth: 1 }}>
              <TextInput
                placeholder={translateText("search")}
                value={searchKey}
                onChangeText={(value) => filterCountries(value)}
                style={styles.searchInput}
                placeholderTextColor={Colors.primary.BOTTOM_INACTIVE}
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchKey("");
                  // props.closeModal();
                }}
              >
                <Image
                  source={imagePath.cancel}
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 50,
                    resizeMode: "contain",
                    padding: 8,
                    tintColor: Colors.primary.BOTTOM_INACTIVE,
                  }}
                />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View style={{ marginTop: screenHeight / 3 }}>
                <ActivityIndicator size="large" color={Colors.primary.BLACK} />
              </View>
            ) : null}
            <FlatList
              data={filteredData}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              style={{ marginBottom: 45 }}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CountryPicker;

const styles = StyleSheet.create({
  modalParent: {
    height: Dimensions.get("window").height,
  },
  modalCenter: {
    flex: 1,
    borderRadius: 10,
    padding: 20,
  },
  modalViewStyle: {
    maxHeight: Dimensions.get("window").height,
    backgroundColor: Colors.primary.WHITE,
    borderRadius: 5,
  },
  countryView: {
    borderColor: Colors.secondary.COTTON_SEED,
  },
  country: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  countryText: {
    fontFamily: font.Poppins_Regular,
    fontSize: font.SIZE_16,
    color: Colors.primary.BLACK,
  },
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.WHITE,
    borderColor: "#ddd",
    marginBottom: 12,
    padding: 5,
    paddingHorizontal: 15,
    shadowColor: Colors.primary.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  },
  searchInput: {
    fontFamily: font.Poppins_Regular,
    fontSize: 16,
    paddingVertical: 9,
    marginLeft: 5,
    flex: 1,
  },
});
