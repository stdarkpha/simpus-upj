import React, { useEffect, useRef } from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Dimensions, Alert, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BookDetailModal({ visible, onClose, item, loading, setLoading }) {
   // Use state for available state
   const [isAvailable, setIsAvailable] = React.useState(false);
   // Local loading state for add to cart
   const [addCartLoading, setAddCartLoading] = React.useState(false);

   // Reset isAvailable and addCartLoading when item changes
   React.useEffect(() => {
      setIsAvailable(false);
      setAddCartLoading(false);
   }, [item?.id]);

   // Format date to Indonesian locale
   const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   // Adjusted addToCart handler
   const handleAddToCart = React.useCallback(async () => {
      if (loading || isAvailable || addCartLoading) return;
      if (!item?.id) return;
      setAddCartLoading(true);
      if (typeof setLoading === "function") setLoading(true);

      try {
         const userStr = await AsyncStorage.getItem("user");
         const user = userStr ? JSON.parse(userStr) : null;
         const token = user?.data?.token;

         const response = await fetch("https://besimpus.farouq.me/api/lending/cart", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               book_id: item.id,
            }),
         });

         const data = await response.json();

         if (typeof setLoading === "function") setLoading(false);
         setAddCartLoading(false);

         if (data?.success) {
            Alert.alert("Berhasil", data?.message || "Buku berhasil ditambahkan ke tas.");
            setIsAvailable(true);
         } else {
            Alert.alert("Gagal", data?.message || "Gagal menambah ke tas.");
            setIsAvailable(true);
         }
      } catch (e) {
         if (typeof setLoading === "function") setLoading(false);
         setAddCartLoading(false);
         Alert.alert("Gagal", "Terjadi kesalahan jaringan.");
      }
   }, [item, loading, setLoading, isAvailable, addCartLoading]);

   return (
      <Modal visible={visible} onRequestClose={onClose} animationType="slide" transparent>
         <View style={styles.overlay}>
            {/* Top Navbar */}
            {item ? (
               <>
                  <View style={styles.topBar}>
                     <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                     </TouchableOpacity>
                     {/* <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
                        <Text style={styles.iconText}>🔖</Text>
                     </TouchableOpacity> */}
                  </View>
                  {/* Main Content */}
                  <ScrollView contentContainerStyle={styles.scrollContent}>
                     <View style={styles.imageSection}>
                        <Image source={{ uri: item.img }} style={styles.bookImage} resizeMode="cover" />
                        <Image source={{ uri: item.img }} style={styles.bgImage} blurRadius={20} resizeMode="cover" />
                        <View style={styles.bgGradient} />
                     </View>
                     <View style={styles.infoSection}>
                        <Text style={styles.bookTitle}>{item.title}</Text>
                        <Text style={styles.bookAuthor}>Author: {item.author}</Text>
                        <View style={styles.grid}>
                           <View style={styles.gridItem}>
                              <Text style={styles.gridLabel}>Kategori</Text>
                              <Text style={styles.gridValue}>{item.category?.name}</Text>
                           </View>
                           <View style={styles.gridItem}>
                              <Text style={styles.gridLabel}>Tanggal Penerbitan</Text>
                              <Text style={styles.gridValue}>{formatDate(item.release_date)}</Text>
                           </View>
                           <View style={styles.gridItem}>
                              <Text style={styles.gridLabel}>{item.stock ? "Tersedia" : "Status"}</Text>
                              <Text style={styles.gridValue}>{item.stock ? `${item.stock} Buku` : "Tidak Tersedia"}</Text>
                           </View>
                           <View style={styles.gridItem}>
                              <Text style={styles.gridLabel}>Jumlah Halaman</Text>
                              <Text style={styles.gridValue}>{item.total_page} Halaman</Text>
                           </View>
                        </View>
                        <Text style={styles.descTitle}>Deskripsi</Text>
                        <Text style={styles.descText}>{item.description ? item.description.replace(/<[^>]+>/g, "") : "Tidak Ada Deskripsi"}</Text>
                     </View>
                  </ScrollView>
                  {/* Bottom Action */}
                  <View style={styles.bottomBar}>
                     {!isAvailable && item.stock ? (
                        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart} disabled={loading || isAvailable || addCartLoading} activeOpacity={0.8}>
                           {loading || addCartLoading ? <ActivityIndicator color="#fff" style={{ marginRight: 8 }} /> : <Ionicons name="bag-add-outline" size={24} color="white" />}
                           <Text style={styles.addToCartText}>{loading || addCartLoading ? "Loading.." : "Tambah ke Tas"}</Text>
                        </TouchableOpacity>
                     ) : (
                        <View style={styles.disabledBtn}>
                           <Ionicons name="bag-remove-outline" size={24} color="#888" />
                           <Text style={styles.disabledText}>{item.stock ? "Sudah ada di Tas" : "Tidak Tersedia"}</Text>
                        </View>
                     )}
                  </View>
               </>
            ) : null}
         </View>
      </Modal>
   );
}

const { height: windowHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      position: "relative",
      width: "100%",
      backgroundColor: "#fff",
      height: windowHeight, // Ensure overlay fills the screen
   },
   topBar: {
      position: "absolute",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 8,
      //   backgroundColor: "rgba(220,38,38,0.85)",
      zIndex: 10,
   },
   iconBtn: {
      width: 48,
      height: 48,
      backgroundColor: "rgba(255,255,255,1)",
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
   },
   iconText: {
      fontSize: 24,
      color: "#000",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
   },
   scrollContent: {
      paddingBottom: 32,
      alignItems: "center",
   },
   imageSection: {
      width: "100%",
      alignItems: "center",
      //   marginTop: 16,
      //   marginBottom: 8,
      position: "relative",
      minHeight: 360,
      justifyContent: "center",
   },
   bookImage: {
      width: 160,
      height: 240,
      borderRadius: 12,
      zIndex: 2,
      marginBottom: 8,
   },
   bgImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: 1,
      zIndex: 0,
   },
   bgGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255,255,255,0.5)",
      zIndex: 1,
   },
   infoSection: {
      width: "100%",
      paddingTop: 16,
      paddingHorizontal: 24,
      alignItems: "flex-start",
   },
   bookTitle: {
      fontWeight: "bold",
      fontSize: 22,
      textAlign: "center",
      width: "100%",
      marginBottom: 4,
      marginTop: 8,
   },
   bookAuthor: {
      fontWeight: "bold",
      fontSize: 16,
      color: "#dc2626",
      textAlign: "center",
      width: "100%",
      marginBottom: 12,
   },
   grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
      marginBottom: 8,
      width: "100%",
      justifyContent: "space-between",
   },
   gridItem: {
      width: "48%",
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
   },
   gridLabel: {
      fontSize: 12,
      color: "#6b7280",
      marginBottom: 2,
   },
   gridValue: {
      color: "#dc2626",
      fontSize: 15,
      textTransform: "capitalize",
   },
   descTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 12,
      marginBottom: 4,
   },
   descText: {
      fontSize: 14,
      color: "#444",
      textAlign: "justify",
      marginBottom: 16,
   },
   bottomBar: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: 16,
      backgroundColor: "#fff",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: -4 },
      elevation: 8,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 20,
   },
   addToCartBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#dc2626",
      paddingVertical: 16,
      height: 56,
      gap: 8,
      borderRadius: 8,
      width: "100%",
   },
   addToCartText: {
      color: "#fff",
      fontWeight: 500,
      fontSize: 16,
   },
   disabledBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#e5e7eb",
      paddingVertical: 16,
      borderRadius: 8,
      gap: 8,
      width: "100%",
   },
   disabledIcon: {
      fontSize: 22,
      color: "#888",
      marginRight: 8,
   },
   disabledText: {
      color: "#888",
      fontWeight: 500,
      fontSize: 16,
   },
});
