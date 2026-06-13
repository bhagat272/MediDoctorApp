import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { transactionsListAction } from "../../../redux/actions/appSessionAction";
import styles from "./styles";
import { Header } from "../../../components";
import { translateText } from "../../../utils/language";
import { Colors, ImagePath } from "../../../theme";
import { loading as Loader } from "../../../redux/reducer/loadingReducer";
const TransactionListScreen = (props: any) => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchTransactions(1);
    dispatch(Loader(true));
  }, []);

  const fetchTransactions = async (pageNo: number) => {
    if (loading || loadingMore) return;

    pageNo === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const res = await dispatch(transactionsListAction({ page: pageNo }));
      dispatch(Loader(false));

      const list = res?.data?.data;

      console.log("==========>transactionlist", list);

      if (Array.isArray(list)) {
        setData((prev) => (pageNo === 1 ? list : [...prev, ...list]));
      }

      setPage(pageNo);
      setLastPage(res?.data?.last_page);
    } catch (e) {
      console.warn("API error", e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && page < lastPage) {
      fetchTransactions(page + 1);
    }
  };

  const onRefresh = () => {
    setPage(1);
    fetchTransactions(1);
  };

  const getMeta = (item: any) => {
    switch (item.transaction_type) {
      case "0":
        return { label: "Credited Amount", sign: "+", color: "#3CB371" };
      case "1":
        return { label: "Debited Amount", sign: "-", color: "#FF3B30" };
      case "2":
        return { label: "Refunded Amount", sign: "+", color: "#FF3B30" };
      default:
        return { label: "Transaction", sign: "", color: "#000" };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr.replace(" ", "T"));
    return date.toLocaleDateString("en-US");
  };

  const renderItem = ({ item }: any) => {
    const meta = getMeta(item);

    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{meta.label}</Text>

          {/* 👤 User Name */}
          <Text style={styles.userName}>{item.user_name}</Text>

          <Text style={styles.date}>Date : {formatDate(item.created_at)}</Text>
        </View>

        <Text style={[styles.amount, { color: meta.color }]}>
          {meta.sign}${Number(item.amount).toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={translateText("transaction_List")}
        leftIcon={ImagePath.goBackImgpng}
        onPressLeft={() => props?.navigation.goBack()}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatlist}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[Colors.primary.APP_THEME]}
            tintColor={Colors.primary.APP_THEME}
          />
        }
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 20 }} />
          ) : null
        }
      />
    </View>
  );
};

export default TransactionListScreen;
