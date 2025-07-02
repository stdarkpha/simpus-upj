import React, { useEffect, useState, useCallback, memo } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import BookDetailModal from "./BookDetailModal";

// Memoized item component to avoid re-renders
const BookItem = memo(({ item, onPress }) => (
   <TouchableOpacity style={styles.latestItem} activeOpacity={0.8} onPress={() => onPress(item)}>
      <View style={styles.latestImageWrapper}>
         <Image
            source={{ uri: item.img }}
            style={styles.latestImage}
            resizeMode="cover"
            // defaultSource={require("../assets/placeholder.jpg")} // Use local placeholder image
         />
      </View>
      <Text style={styles.latestTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.latestAuthor} numberOfLines={1}>{item.author}</Text>
   </TouchableOpacity>
));

export default function LatestBookSection() {
   const [books, setBooks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [modalVisible, setModalVisible] = useState(false);
   const [selectedBook, setSelectedBook] = useState(null);
   const [addCartLoading, setAddCartLoading] = useState(false);
   const [cartAvailable, setCartAvailable] = useState(false);

   useEffect(() => {
      let isMounted = true;
      fetch("https://besimpus.farouq.me/api/books?paginate=9")
         .then((res) => res.json())
         .then((data) => {
            if (isMounted) {
               setBooks(data?.data?.data || []);
               setLoading(false);
            }
         })
         .catch(() => setLoading(false));
      return () => { isMounted = false; };
   }, []);

   const handleAddToCart = useCallback(() => {
      setAddCartLoading(true);
      setTimeout(() => {
         setAddCartLoading(false);
         setCartAvailable(true);
      }, 1000);
   }, []);

   const handleOpenModal = useCallback((item) => {
      setSelectedBook(item);
      setModalVisible(true);
      setCartAvailable(false);
   }, []);

   const renderItem = useCallback(({ item }) => (
      <BookItem item={item} onPress={handleOpenModal} />
   ), [handleOpenModal]);

   if (loading) {
      return (
         <View style={styles.latestLoading}>
            <ActivityIndicator size="large" color="#dc2626" />
            <Text style={{ color: "#6b7280", marginLeft: 12 }}>Harap Tunggu...</Text>
         </View>
      );
   }

   return (
      <View>
         <FlatList
            data={books}
            horizontal
            keyExtractor={(item) => item.id?.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.latestList}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews
         />
         <BookDetailModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            item={selectedBook}
            loading={addCartLoading}
            onAddToCart={handleAddToCart}
            available={cartAvailable}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   latestList: {
      // paddingVertical: 8,
      // paddingLeft: 4,
      gap: 16
   },
   latestItem: {
      width: 120,
      // marginRight: 12,
      alignItems: "flex-start",
   },
   latestImageWrapper: {
      aspectRatio: 2 / 3,
      width: "100%",
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: "#f3f4f6",
      marginBottom: 8,
      elevation: 2,
   },
   latestImage: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
      transform: [{ scale: 1.01 }], // helps with smoother rendering
   },
   latestTitle: {
      fontWeight: "bold",
      fontSize: 14,
      marginTop: 4,
      marginBottom: 2,
      maxWidth: 110,
   },
   latestAuthor: {
      fontSize: 12,
      color: "#6b7280",
      maxWidth: 110,
   },
   latestLoading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingVertical: 32,
   },
});
