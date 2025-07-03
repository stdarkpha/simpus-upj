import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Modal, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import Config from "../config";

import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function BagPage({ navigation }) {
   const isFocused = useIsFocused();
   const [cartData, setCartData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [isLend, setIsLend] = useState(false);
   const [duration, setDuration] = useState(1);
   const [customDuration, setCustomDuration] = useState("");
   const [lendLoading, setLendLoading] = useState(false);

   // Fetch cart data
   const fetchCart = async () => {
      setLoading(true);
      try {
         const userStr = await AsyncStorage.getItem("user");
         const user = userStr ? JSON.parse(userStr) : null;
         const token = user?.data?.token;
         const res = await fetch(`${Config.API_BASE_URL}/lending/cart`, {
            headers: {
               Authorization: `Bearer ${token}`,
               Accept: "application/json",
            },
         });
         const data = await res.json();
         setCartData(data?.data || []);
      } catch (e) {
         setCartData([]);
      }
      setLoading(false);
   };

   useEffect(() => {
      fetchCart();
   }, []);

   useEffect(() => {
      if (isFocused) fetchCart();
   }, [isFocused]);

   // Delete single item
   const deleteItem = async (id) => {
      Alert.alert("Konfirmasi", "Apakah Anda yakin ingin menghapus buku ini dari tas?", [
         { text: "Batal", style: "cancel" },
         {
            text: "Hapus",
            style: "destructive",
            onPress: async () => {
               try {
                  const userStr = await AsyncStorage.getItem("user");
                  const user = userStr ? JSON.parse(userStr) : null;
                  const token = user?.data?.token;
                  await fetch(`${Config.API_BASE_URL}/lending/cart/${id}`, {
                     method: "DELETE",
                     headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                     },
                  });
                  fetchCart();
               } catch (e) {
                  Alert.alert("Gagal", "Terjadi kesalahan saat menghapus buku.");
               }
            },
         },
      ]);
   };

   // Clear cart
   const clearCart = async () => {
      Alert.alert("Konfirmasi", "Apakah Anda yakin ingin menghapus semua buku dari tas?", [
         { text: "Batal", style: "cancel" },
         {
            text: "Hapus Semua",
            style: "destructive",
            onPress: async () => {
               try {
                  const userStr = await AsyncStorage.getItem("user");
                  const user = userStr ? JSON.parse(userStr) : null;
                  const token = user?.data?.token;
                  await fetch(`${Config.API_BASE_URL}/lending/cart/clear`, {
                     method: "DELETE",
                     headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                     },
                  });
                  fetchCart();
                  Alert.alert("Berhasil", "Semua buku telah dihapus dari tas.");
               } catch (e) {
                  Alert.alert("Gagal", "Terjadi kesalahan saat menghapus semua buku.");
               }
            },
         },
      ]);
   };

   // Confirm lend
   const confirmLend = async () => {
      if (!duration && !customDuration) {
         Alert.alert("Pilih Durasi", "Silakan pilih durasi peminjaman.");
         return;
      }
      setLendLoading(true);
      try {
         const userStr = await AsyncStorage.getItem("user");
         const user = userStr ? JSON.parse(userStr) : null;
         const token = user?.data?.token;
         await fetch(`${Config.API_BASE_URL}/lending/confirm`, {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
               Accept: "application/json",
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ days: customDuration ? Number(customDuration) : duration }),
         });
         setIsLend(false);
         fetchCart();
         Alert.alert("Berhasil", "Buku telah berhasil dipinjam.");
      } catch (e) {
         Alert.alert("Gagal", "Terjadi kesalahan saat meminjam buku.");
      }
      setLendLoading(false);
   };

   // Render
   return (
      <View style={{ flex: 1, backgroundColor: "#fff", position: "relative" }}>
         <ScrollView contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 0 }}>
               <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tas Saya</Text>
               <Text style={{ fontWeight: "bold", color: "#dc2626" }}>Total: {cartData.length}</Text>
            </View>
            {loading ? (
               <View style={{ alignItems: "center", marginTop: 32 }}>
                  <ActivityIndicator size="large" color="#dc2626" />
               </View>
            ) : cartData.length > 0 ? (
               <View style={{ gap: 4, marginTop: 16 }}>
                  {cartData.map((item) => (
                     <View key={item.id} style={styles.cartItem}>
                        <View style={styles.cartImageWrap}>
                           <Image source={{ uri: item.book.img }} style={styles.cartImage} resizeMode="cover" />
                        </View>
                        <View style={{ flex: 1 }}>
                           <Text style={styles.cartTitle} numberOfLines={2}>
                              {item.book.title}
                           </Text>
                           <View style={{ flexDirection: "col", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                              <View>
                                 <Text style={{ color: "#dc2626", fontSize: 13 }}>Author: {item.book.author}</Text>
                                 <Text style={{ color: "#6b7280", fontSize: 13 }}>Tersedia: {item.book.stock}</Text>
                              </View>
                              <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteBtn}>
                                 <Text style={{ color: "#dc2626", fontWeight: "bold", fontSize: 12 }}>Hapus Buku</Text>
                              </TouchableOpacity>
                           </View>
                        </View>
                     </View>
                  ))}
               </View>
            ) : (
               <View style={styles.emptyWrap}>
                  <Text style={{ fontSize: 64, color: "#e5e7eb" }}>📚</Text>
                  <Text style={{ fontSize: 20, fontWeight: "bold", color: "#dc2626", marginTop: 16 }}>Tas Anda Kosong</Text>
                  <Text style={{ color: "#9ca3af", textAlign: "center", marginTop: 8 }}>Silakan tambahkan buku untuk meminjam.</Text>
               </View>
            )}
         </ScrollView>
         {/* Bottom Actions */}
         {cartData.length > 0 && (
            <View style={styles.bottomActions}>
               <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
                  <Ionicons name="bag-remove-outline" size={24} color="black" />
                  <Text style={{ color: "#222", fontWeight: "bold" }}>Bersihkan</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.lendBtn} onPress={() => setIsLend(true)}>
                  <Ionicons name="bag-check-outline" size={24} color="white" />
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Pinjam ({cartData.length})</Text>
               </TouchableOpacity>
            </View>
         )}
         {/* Lend Modal */}
         <Modal visible={isLend} transparent animationType="fade" onRequestClose={() => setIsLend(false)}>
            <View style={styles.modalOverlay}>
               <View style={styles.modalContent}>
                  <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>Pilih Durasi Peminjaman</Text>
                  <View style={styles.durationRow}>
                     {[1, 3, 5].map((d) => (
                        <TouchableOpacity
                           key={d}
                           style={[styles.durationBtn, duration === d && styles.durationBtnActive]}
                           onPress={() => {
                              setDuration(d);
                              setCustomDuration("");
                           }}
                        >
                           <Text style={[styles.durationText, duration === d && { color: "#dc2626" }]}>{d} Hari</Text>
                        </TouchableOpacity>
                     ))}
                  </View>
                  <Text style={{ textAlign: "center", color: "#9ca3af", marginVertical: 8 }}>atau</Text>
                  <View style={[styles.customDurationWrap, customDuration ? styles.customDurationActive : null]}>
                     <TextInput
                        style={styles.customDurationInput}
                        placeholder="Masukkan .."
                        keyboardType="numeric"
                        value={customDuration}
                        onChangeText={(val) => {
                           // Only allow numbers 1-14
                           let num = val.replace(/[^0-9]/g, "");
                           if (num) num = Math.max(1, Math.min(14, Number(num))).toString();
                           setCustomDuration(num);
                           setDuration(null);
                        }}
                        onBlur={() => {
                           if (!customDuration) setCustomDuration("");
                        }}
                        maxLength={2}
                     />
                     <Text style={{ marginLeft: 4 }}>Hari</Text>
                  </View>
                  <Text style={{ color: "#dc2626", fontWeight: "bold", fontSize: 13, marginTop: 8, alignSelf: "flex-end" }}>** Batas Maximal 14 Hari</Text>
                  <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
                     <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsLend(false)}>
                        <FontAwesome5 name="times-circle" size={20} color="black" />
                        <Text style={{ color: "#222", fontWeight: "bold" }}>Batalkan</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.confirmBtn} onPress={confirmLend} disabled={lendLoading}>
                        <Feather name="check-circle" size={20} color="white" />
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>{lendLoading ? "Meminjam..." : "Konfirmasi"}</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>
      </View>
   );
}

const styles = StyleSheet.create({
   cartItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      padding: 8,
      backgroundColor: "#fff",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      marginBottom: 8,
   },
   cartImageWrap: {
      height: 100,
      width: 70,
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: "#f3f4f6",
      marginRight: 8,
   },
   cartImage: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
   },
   cartTitle: {
      fontWeight: "bold",
      fontSize: 16,
      lineHeight: 20,
   },
   deleteBtn: {
      borderWidth: 2,
      borderColor: "#dc2626",
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 16,
      // marginLeft: 8,
      marginLeft: "auto",
      marginBottom: 4,
   },
   emptyWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: 320,
      backgroundColor: "#f9fafb",
      marginTop: 16,
      borderRadius: 16,
   },
   bottomActions: {
      flexDirection: "row",
      gap: 12,
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 72,
      paddingHorizontal: 16,
      zIndex: 10,
   },
   clearBtn: {
      flex: 1,
      backgroundColor: "#fff",
      borderWidth: 2,
      borderColor: "#222",
      borderRadius: 8,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      marginRight: 4,
   },
   lendBtn: {
      flex: 1,
      backgroundColor: "#dc2626",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      marginLeft: 4,
      flexDirection: "row",
      gap: 8,
   },
   modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.7)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
   },
   modalContent: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 20,
      width: "100%",
      maxWidth: 400,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
   },
   durationRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 8,
      gap: 8,
   },
   durationBtn: {
      flex: 1,
      backgroundColor: "#f3f4f6",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      marginHorizontal: 4,
   },
   durationBtnActive: {
      backgroundColor: "#fff",
      borderWidth: 2,
      borderColor: "#dc2626",
   },
   durationText: {
      color: "#9ca3af",
      fontWeight: "bold",
      fontSize: 16,
   },
   customDurationWrap: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f3f4f6",
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginTop: 8,
      marginBottom: 4,
      borderWidth: 2,
      borderColor: "#f3f4f6",
   },
   customDurationActive: {
      borderColor: "#dc2626",
      backgroundColor: "#fff",
   },
   customDurationInput: {
      // width: "100%",
      flexGrow: 1,
      fontSize: 16,
      paddingVertical: 8,
      paddingHorizontal: 8,
      backgroundColor: "transparent",
      borderWidth: 0,
      textAlign: "center",
   },
   cancelBtn: {
      flex: 1,
      backgroundColor: "#fff",
      borderWidth: 2,
      borderColor: "#222",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      marginRight: 4,
      flexDirection: "row",
      gap: 8,
   },
   confirmBtn: {
      flex: 1,
      backgroundColor: "#dc2626",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      marginLeft: 4,
      flexDirection: "row",
      gap: 8,
   },
});
