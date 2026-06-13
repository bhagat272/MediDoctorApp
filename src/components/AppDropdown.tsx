import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { Colors, Fonts } from "../theme";
import fonts from "../theme/fonts";

export type DropdownType = "SPECIALITY" | "EDUCATION";

interface DropdownItem {
  id: string | number;
  title: string;
  [key: string]: any;
}

interface AppDropdownProps {
  visible: boolean;
  type: DropdownType;
  onClose: () => void;
  fetchData: (type: DropdownType) => Promise<DropdownItem[]>;
  onSelect: (item: DropdownItem, type: DropdownType) => void;
  searchable?: boolean;
}

const AppDropdown: React.FC<AppDropdownProps> = ({
  visible,
  type,
  onClose,
  fetchData,
  onSelect,
  searchable = false,
}) => {
  const [data, setData] = useState<DropdownItem[]>([]);
  const [filtered, setFiltered] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (visible) {
      loadData();
    } else {
      // Reset search when modal closes
      setSearch("");
    }
  }, [visible, type]);

  useEffect(() => {
    if (!search) {
      setFiltered(data);
    } else {
      setFiltered(
        data.filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, data]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchData(type);
      setData(res);
      setFiltered(res);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: DropdownItem) => {
    onSelect(item, type);
    onClose();
    setSearch("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>
            {type === "SPECIALITY" ? "Select Speciality" : "Select Education"}
          </Text>

          {/* {searchable && (
            <TextInput
              style={styles.search}
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
            />
          )} */}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary.BLACK} />
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.values}>{item.title}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No items found</Text>
              }
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: Colors.primary.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: Fonts.SIZE_18,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.BLACK,
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: Colors.secondary.MONSOON,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.OFF_WHITE,
  },
  values: {
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary.BLACK,
    fontSize: fonts.SIZE_15,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 20,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.secondary.MONSOON,
  },
});

export default AppDropdown;