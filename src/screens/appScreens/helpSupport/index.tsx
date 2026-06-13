import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import styles from "./styles";
import { Header } from "../../../components";
import imagePath from "../../../theme/imagePath";
import { translateText } from "../../../utils/language";
import { Fonts } from "../../../theme";
import { useDispatch } from "react-redux";
import { helpAndSupportAction } from "../../../redux/actions/appSessionAction";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const HelpSupport = (props: any) => {
  const [faqList, setFaqList] = useState<FAQItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchFAQs(1);
  }, []);

  const fetchFAQs = async (pageNumber: number) => {
    if (loading || pageNumber > lastPage) return;

    setLoading(true);

    try {
      const response = await dispatch(helpAndSupportAction(pageNumber));
      const json = response;

      if (json?.status) {
        const mappedData: FAQItem[] = json?.data?.data?.map((item: any) => ({
          id: item.id,
          question: item.title,
          answer: item.description,
        }));

        setFaqList((prev) =>
          pageNumber === 1 ? mappedData : [...prev, ...mappedData],
        );

        setLastPage(json?.data?.last_page);
        setPage(pageNumber);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to load help data");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleLoadMore = () => {
    if (page < lastPage && !loading) {
      fetchFAQs(page + 1);
    }
  };

  const handleSendEmail = async () => {
    const mailUrl = `mailto:jason@lifetimemediapp.com?subject=Help & Support`;

    try {
      await Linking.openURL(mailUrl);
    } catch {
      Alert.alert("Error", "No email app found");
    }
  };

  const renderItem = ({ item, index }: { item: FAQItem; index: number }) => {
    const isOpen = activeIndex === index;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => toggleItem(index)}
      >
        <View style={styles.header}>
          <Text style={styles.question}>{item.question}</Text>
          <Image
            style={styles.arrow}
            source={isOpen ? imagePath.arrow_up : imagePath.arrow_down}
          />
        </View>

        {isOpen && <Text style={styles.answer}>{item.answer}</Text>}
      </TouchableOpacity>
    );
  };

  const ListFooter = () => (
    <View>
      <Text style={styles.helpText}>
        Hello,{" "}
        <Text style={{ fontFamily: Fonts.Poppins_Regular }}>
          {translateText("how_can_we_help_you")}
        </Text>
      </Text>

      <TouchableOpacity style={styles.emailBtn} onPress={handleSendEmail}>
        <Image source={imagePath.email_icon} style={styles.email} />
        <Text style={styles.emailText}>
          {translateText("send_us_an_e-mail")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title={translateText("help_&_support")}
        leftIcon={imagePath.goBackImgpng}
        onPressLeft={() => props.navigation.goBack()}
      />

      <FlatList
        data={faqList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HelpSupport;
