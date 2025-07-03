import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import BookDetailModal from "./BookDetailModal";
import Config from "../config";

export default function UserHomeCategory({ navigation }) {
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedIdx, setSelectedIdx] = useState(0);
   const [modalVisible, setModalVisible] = useState(false);
   const [selectedBook, setSelectedBook] = useState(null);
   const [addCartLoading, setAddCartLoading] = useState(false);
   const [cartAvailable, setCartAvailable] = useState(false);

   useEffect(() => {
      let isMounted = true;
      fetch(`${Config.API_URL}/books/category`)
         .then((res) => res.json())
         .then((data) => {
            if (isMounted) {
               setCategories(data?.data || []);
               setLoading(false);
            }
         })
         .catch(() => setLoading(false));
      return () => {
         isMounted = false;
      };
   }, []);

   const handleAddToCart = useCallback(() => {
      setAddCartLoading(true);
      setTimeout(() => {
         setAddCartLoading(false);
         setCartAvailable(true);
      }, 1000);
   }, []);

   const handleBookPress = useCallback((item) => {
      setSelectedBook(item);
      setModalVisible(true);
      setCartAvailable(false);
   }, []);

   const selectedCategory = categories[selectedIdx];
   const books = selectedCategory?.books || [];

   const renderCategoryTab = useCallback(
      ({ item, index }) => (
         <TouchableOpacity onPress={() => setSelectedIdx(index)} style={[styles.categoryTab, index === selectedIdx ? styles.categoryTabActive : styles.categoryTabInactive]} activeOpacity={0.8}>
            <Text style={[styles.categoryTabText, index === selectedIdx ? styles.categoryTabTextActive : styles.categoryTabTextInactive]}>
               {item.name} ({item.books?.length || 0})
            </Text>
         </TouchableOpacity>
      ),
      [selectedIdx]
   );

   const renderBookItem = useCallback(
      ({ item }) => (
         <TouchableOpacity style={styles.categoryBookCard} activeOpacity={0.85} onPress={() => handleBookPress(item)}>
            <View style={styles.categoryBookImageWrap}>
               <Image source={{ uri: item.img }} style={styles.categoryBookImage} resizeMode="cover" />
            </View>
            <View style={styles.categoryBookInfo}>
               <Text style={styles.categoryBookTitle} numberOfLines={2}>
                  {item.title}
               </Text>
               <Text style={styles.categoryBookAuthor}>Author: {item.author}</Text>
               <Text style={styles.categoryBookDesc} numberOfLines={2}>
                  {item.description ? item.description.replace(/<[^>]+>/g, "") : "Tidak Ada Deskripsi"}
               </Text>
               <View style={styles.categoryBookFooter}>
                  {item.stock ? (
                     <Text style={styles.categoryBookStock}>
                        Tersedia <Text style={{ color: "#dc2626", fontWeight: "bold" }}>{item.stock} Buku</Text>
                     </Text>
                  ) : (
                     <Text style={styles.categoryBookNotAvailable}>Status: Tidak Tersedia</Text>
                  )}
                  <Text style={styles.categoryBookDetail}>Detail ➔</Text>
               </View>
            </View>
         </TouchableOpacity>
      ),
      [handleBookPress]
   );

   if (loading) {
      return (
         <View style={styles.latestLoading}>
            <ActivityIndicator size="large" color="#dc2626" />
            <Text style={{ color: "#6b7280", marginLeft: 12 }}>Harap Tunggu...</Text>
         </View>
      );
   }

   if (!categories.length) {
      return (
         <View style={styles.latestLoading}>
            <Text style={{ color: "#6b7280" }}>Tidak ada kategori ditemukan.</Text>
         </View>
      );
   }

   return (
      <View style={{ marginTop: 4 }}>
         <FlatList data={categories} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(item) => item.id?.toString()} contentContainerStyle={{ paddingLeft: 4, paddingBottom: 8 }} renderItem={renderCategoryTab} extraData={selectedIdx} />

         {books.length > 0 ? <FlatList data={books} keyExtractor={(item) => item.id?.toString()} renderItem={renderBookItem} contentContainerStyle={{ paddingBottom: 20 }} scrollEnabled={false} /> : <Text style={{ color: "#6b7280", marginTop: 16 }}>Tidak ada buku di kategori ini.</Text>}

         <BookDetailModal visible={modalVisible} onClose={() => setModalVisible(false)} item={selectedBook} loading={addCartLoading} onAddToCart={handleAddToCart} available={cartAvailable} />
      </View>
   );
}

const styles = StyleSheet.create({
   categoryTab: {
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: 999,
      marginRight: 8,
      borderWidth: 1,
   },
   categoryTabActive: {
      backgroundColor: "#dc2626",
      borderColor: "#dc2626",
   },
   categoryTabInactive: {
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
   },
   categoryTabText: {
      fontSize: 11,
      fontWeight: "600",
      textTransform: "capitalize",
   },
   categoryTabTextActive: {
      color: "#fff",
   },
   categoryTabTextInactive: {
      color: "#dc2626",
   },
   categoryBookCard: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      overflow: "visible",
      gap: 12,
   },
   categoryBookImageWrap: {
      width: 70,
      aspectRatio: 2 / 3,
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: "#f3f4f6",
      marginRight: 8,
   },
   categoryBookImage: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
   },
   categoryBookInfo: {
      flex: 1,
      justifyContent: "space-between",
      gap: 4,
      minHeight: 100,
   },
   categoryBookTitle: {
      fontWeight: "bold",
      fontSize: 16,
   },
   categoryBookAuthor: {
      fontSize: 13,
      fontWeight: "bold",
      color: "#dc2626",
   },
   categoryBookDesc: {
      fontSize: 12,
      color: "#6b7280",
   },
   categoryBookFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
   },
   categoryBookStock: {
      fontSize: 12,
      color: "#222",
   },
   categoryBookNotAvailable: {
      fontSize: 12,
      color: "#dc2626",
   },
   categoryBookDetail: {
      fontSize: 12,
      color: "#dc2626",
      fontWeight: "bold",
   },
   latestLoading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingVertical: 32,
   },
});
