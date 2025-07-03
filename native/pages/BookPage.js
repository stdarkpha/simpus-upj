import React, { useState, useRef, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import debounce from "lodash.debounce";
import BookDetailModal from "../components/BookDetailModal";

import Feather from "@expo/vector-icons/Feather";

export default function BookPage({ navigation }) {
   const [query, setQuery] = useState("");
   const [searchResult, setSearchResult] = useState(null);
   const [loading, setLoading] = useState(false);
   const [itemActive, setItemActive] = useState(null);
   const [modalVisible, setModalVisible] = useState(false);
   const [latestBooks, setLatestBooks] = useState([]);
   const [latestBooksLoading, setLatestBooksLoading] = useState(true);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [isFetchingMore, setIsFetchingMore] = useState(false);

   const inputRef = useRef(null);
   const route = useRoute();

   useEffect(() => {
      if (route.params?.autoFocus) {
         const timer = setTimeout(() => {
            if (inputRef.current) {
               inputRef.current.focus();
            }
         }, 300);
         return () => clearTimeout(timer);
      }
   }, [route.params?.autoFocus]);

   const debouncedQuery = useMemo(
      () =>
         debounce((text) => {
            setQuery(text);
         }, 300),
      []
   );

   useEffect(() => {
      let isMounted = true;
      if (query && query.length >= 3) {
         setLoading(true);
         fetch(`https://besimpus.farouq.me/api/books/search?query=${encodeURIComponent(query)}`)
            .then((res) => res.json())
            .then((data) => {
               if (isMounted) {
                  setSearchResult(data);
                  setLoading(false);
               }
            })
            .catch(() => {
               if (isMounted) setLoading(false);
            });
      } else {
         setSearchResult(null);
      }
      return () => {
         isMounted = false;
      };
   }, [query]);

   useEffect(() => {
      setLatestBooks([]);
      setPage(1);
      setHasMore(true);
      setLatestBooksLoading(true);
      fetch(`https://besimpus.farouq.me/api/books?paginate=9&page=1`)
         .then((res) => res.json())
         .then((data) => {
            setLatestBooks(data?.data?.data || []);
            setHasMore(!!data?.data?.next_page_url);
            setLatestBooksLoading(false);
         })
         .catch(() => setLatestBooksLoading(false));
   }, []);

   const fetchMoreBooks = () => {
      if (!hasMore || isFetchingMore || latestBooksLoading) return;
      setIsFetchingMore(true);
      const nextPage = page + 1;
      fetch(`https://besimpus.farouq.me/api/books?paginate=9&page=${nextPage}`)
         .then((res) => res.json())
         .then((data) => {
            setLatestBooks((prev) => [...prev, ...(data?.data?.data || [])]);
            setHasMore(!!data?.data?.next_page_url);
            setPage(nextPage);
            setIsFetchingMore(false);
         })
         .catch(() => setIsFetchingMore(false));
   };

   const renderBookItem = ({ item }) => (
      <View style={styles.latestGrid}>
         <TouchableOpacity
            style={styles.latestGridItem}
            activeOpacity={0.85}
            onPress={() => {
               setItemActive(item);
               setModalVisible(true);
            }}
         >
            <View style={styles.latestImageWrap}>
               <Image source={{ uri: item.img }} style={styles.latestImage} resizeMode="cover" />
            </View>
            <Text style={styles.latestTitle} numberOfLines={2}>
               {item.title}
            </Text>
            <Text style={styles.latestAuthor} numberOfLines={1}>
               {item.author}
            </Text>
         </TouchableOpacity>
      </View>
   );

   return (
      <View style={{ flex: 1, backgroundColor: "#fff", position: "relative", zIndex: 1 }}>
         <View style={styles.headerBg} />
         <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Buku Perpustakaan</Text>
            <Text style={styles.headerSubtitle}>Cari buku berdasarkan judul</Text>
            <View style={styles.searchBar}>
               <Feather name="search" size={24} color="#dc2626" />
               <TextInput ref={inputRef} style={styles.searchInput} placeholder="Cari buku berdasarkan judul" placeholderTextColor="#888" onChangeText={debouncedQuery} />
               <Feather name="filter" size={24} color="#dc2626" />
            </View>
         </View>
         <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionTitle}>{query.length > 2 ? `Hasil Pencarian "${query}"` : "Buku Terbaru"}</Text>
         </View>
         {query.length > 2 ? (
            loading ? (
               <View style={styles.loadingWrap}>
                  <ActivityIndicator size="large" color="#dc2626" />
                  <Text style={styles.loadingText}>Mencari Buku...</Text>
               </View>
            ) : searchResult?.data?.length > 0 ? (
               <FlatList
                  data={searchResult.data}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{ padding: 12, width: "100%", gap: 8 }}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        style={styles.resultCard}
                        activeOpacity={0.85}
                        onPress={() => {
                           setItemActive(item);
                           setModalVisible(true);
                        }}
                     >
                        <View style={styles.resultImageWrap}>
                           <Image source={{ uri: item.img }} style={styles.resultImage} resizeMode="cover" />
                        </View>
                        <View style={styles.resultInfo}>
                           <Text style={styles.resultTitle} numberOfLines={2}>
                              {item.title}
                           </Text>
                           <Text style={styles.resultAuthor}>Author: {item.author}</Text>
                           <Text style={styles.resultDesc} numberOfLines={2}>
                              {item.description ? item.description.replace(/<[^>]+>/g, "") : "Tidak Ada Deskripsi"}
                           </Text>
                           <View style={styles.resultFooter}>
                              {item.stock ? (
                                 <Text style={styles.resultStock}>
                                    Tersedia <Text style={{ color: "#dc2626", fontWeight: "bold" }}>{item.stock} Buku</Text>
                                 </Text>
                              ) : (
                                 <Text style={styles.resultNotAvailable}>Status: Tidak Tersedia</Text>
                              )}
                              <Text style={styles.resultDetail}>Detail ➔</Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  )}
               />
            ) : (
               <View style={styles.notFoundWrap}>
                  <Image source={{ uri: "https://fesimp.farouq.me/404.png" }} style={styles.notFoundImage} resizeMode="contain" />
                  <Text style={styles.notFoundTitle}>
                     Maaf kami tidak dapat menemukan pencarian
                     <Text style={{ color: "#dc2626" }}>“{query}”</Text>
                  </Text>
                  <Text style={styles.notFoundDesc}>Silahkan mencoba lagi dengan gunakan frasa atau kata yang berbeda</Text>
               </View>
            )
         ) : (
            <FlatList
               data={latestBooks}
               keyExtractor={(item) => item.id.toString()}
               numColumns={3}
               contentContainerStyle={{ padding: 12 }}
               renderItem={renderBookItem}
               ListFooterComponent={
                  isFetchingMore && (
                     <View style={{ alignItems: "center", paddingVertical: 16 }}>
                        <ActivityIndicator size="small" color="#dc2626" />
                        <Text style={styles.loadingText}>Memuat lebih banyak...</Text>
                     </View>
                  )
               }
               onEndReachedThreshold={0.5}
               onEndReached={fetchMoreBooks}
               ListEmptyComponent={
                  latestBooksLoading && (
                     <View style={styles.latestLoadingWrap}>
                        <ActivityIndicator size="large" color="#dc2626" />
                        <Text style={styles.loadingText}>Harap Tunggu...</Text>
                     </View>
                  )
               }
            />
         )}
         <BookDetailModal visible={modalVisible} onClose={() => setModalVisible(false)} item={itemActive} />
      </View>
   );
}
const styles = StyleSheet.create({
   headerBg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: 160,
      backgroundColor: "#E7000B",
      // borderBottomLeftRadius: 24,
      // borderBottomRightRadius: 24,
      zIndex: -1,
   },
   headerContainer: {
      padding: 16,
      gap: 4,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
   },
   headerSubtitle: {
      color: "#fff",
      fontSize: 16,
      marginBottom: 8,
   },
   searchBar: {
      backgroundColor: "#fff",
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginTop: 8,
   },
   searchIcon: {
      fontSize: 22,
      color: "#dc2626",
      marginRight: 8,
   },
   searchInput: {
      flex: 1,
      fontSize: 15,
      color: "#222",
      paddingVertical: 0,
      paddingHorizontal: 6,
   },
   filterIcon: {
      fontSize: 22,
      color: "#dc2626",
      marginLeft: 8,
   },
   sectionTitleWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      marginTop: 24,
      marginBottom: 8,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
   },
   loadingWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingVertical: 32,
      gap: 12,
   },
   loadingText: {
      color: "#6b7280",
      marginLeft: 12,
      fontSize: 16,
   },
   latestGridWrap: {
      marginBottom: 16,
      // paddingHorizontal: 8,
   },
   latestLoadingWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingVertical: 32,
      gap: 12,
   },
   latestGrid: {
      // width: "100%",
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      // gap: 8,
      paddingHorizontal: 8,
      // backgroundColor: "#000",
   },
   latestGridItem: {
      // width: (width - 60) / 3, // 3 columns with padding
      // margin: 8,
      // alignItems: "center",
      marginBottom: 16,
   },
   latestImageWrap: {
      aspectRatio: 2 / 3,
      width: "100%",
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: "#f3f4f6",
      marginBottom: 8,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
   },
   latestImage: {
      width: "100%",
      height: undefined,
      aspectRatio: 2 / 3,
      borderRadius: 8,
   },
   latestTitle: {
      fontWeight: "bold",
      fontSize: 14,
      marginTop: 4,
      marginBottom: 2,
      maxWidth: "100%",
   },
   latestAuthor: {
      fontSize: 12,
      color: "#6b7280",
      maxWidth: "100%",
   },
   resultCard: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 12,
      marginHorizontal: 12,
      marginBottom: 12,
      padding: 12,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      alignItems: "flex-start",
   },
   resultImageWrap: {
      width: 80,
      aspectRatio: 2 / 3,
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: "#f3f4f6",
      marginRight: 12,
   },
   resultImage: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
   },
   resultInfo: {
      flex: 1,
      gap: 4,
   },
   resultTitle: {
      fontWeight: "bold",
      fontSize: 16,
      marginBottom: 2,
   },
   resultAuthor: {
      fontSize: 13,
      color: "#dc2626",
      fontWeight: "bold",
   },
   resultDesc: {
      fontSize: 12,
      color: "#6b7280",
   },
   resultFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
   },
   resultStock: {
      fontSize: 12,
      color: "#222",
   },
   resultNotAvailable: {
      fontSize: 12,
      color: "#dc2626",
   },
   resultDetail: {
      fontSize: 13,
      color: "#222",
      fontWeight: "500",
      marginLeft: 8,
   },
   notFoundWrap: {
      alignItems: "center",
      // justifyContent: "center",
      paddingVertical: 32,
      gap: 8,
   },
   notFoundImage: {
      width: "75%",
      height: "50%",
      objectFit: "contain",
      marginBottom: 12,
   },
   notFoundTitle: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 16,
      paddingHorizontal: 16,
      maxWidth: 320,
   },
   notFoundDesc: {
      textAlign: "center",
      fontSize: 12,
      color: "#6b7280",
      paddingHorizontal: 16,
      maxWidth: 320,
   },
});
