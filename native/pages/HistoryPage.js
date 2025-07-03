import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Modal, TextInput, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Pusher from "pusher-js";
import Config from "../config";

const { width } = Dimensions.get("window");

const statusMapping = {
   pending: "Belum Diambil",
   claim: "Sudah Diambil",
   returned: "Dikembalikan",
   overdue: "Terlambat",
};

function formatDate(dateString) {
   if (!dateString) return "-";
   return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
   });
}

function getStatusColor(status) {
   switch (status) {
      case "pending":
         return "#ca8a04"; // yellow-600
      case "claim":
         return "#2563eb"; // blue-600
      case "returned":
         return "#059669"; // green-600
      case "overdue":
         return "#ea580c"; // orange-600
      case "reject":
         return "#dc2626"; // red-600
      default:
         return "#4b5563"; // gray-600
   }
}

export default function HistoryPage({ navigation }) {
   const [historyData, setHistoryData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
   const [isConnected, setIsConnected] = useState(false);
   const [lastUpdate, setLastUpdate] = useState(null);
   const [selectedItem, setSelectedItem] = useState(null);
   const [showQR, setShowQR] = useState(false);
   const [qrData, setQRData] = useState(null);
   const [dateFilter, setDateFilter] = useState("");

   // Pusher WebSocket refs
   const pusherRef = useRef(null);
   const channelRef = useRef(null);
   const userDataRef = useRef(null);

   const fetchHistory = async (isRefresh = false) => {
      if (isRefresh) {
         setRefreshing(true);
      } else {
         setLoading(true);
      }
      try {
         const userStr = await AsyncStorage.getItem("user");
         const user = userStr ? JSON.parse(userStr) : null;
         const token = user?.data?.token;
         let url = `${Config.API_BASE_URL}/lending/history`;
         if (dateFilter) url += `?date=${dateFilter}`;
         const res = await fetch(url, {
            headers: {
               Authorization: `Bearer ${token}`,
               Accept: "application/json",
            },
         });
         const data = await res.json();
         setHistoryData(data?.data || []);
      } catch (e) {
         setHistoryData([]);
      }
      if (isRefresh) {
         setRefreshing(false);
      } else {
         setLoading(false);
      }
   };

   // Initialize Pusher WebSocket for real-time updates
   const initializePusher = async () => {
      try {
         // console.log("🚀 [HistoryPage] Initializing Pusher...");

         // Get user data and token from AsyncStorage
         const userStr = await AsyncStorage.getItem("user");
         const user = userStr ? JSON.parse(userStr) : null;

         if (!user?.data?.id) {
            console.warn("⚠️ [HistoryPage] No user data found, skipping Pusher initialization");
            return;
         }

         userDataRef.current = user;
         // console.log("🆔 [HistoryPage] User ID found:", user.data.id);

         // Initialize Pusher
         pusherRef.current = new Pusher(Config.PUSHER_KEY, {
            cluster: Config.PUSHER_CLUSTER,
            forceTLS: true,
            enabledTransports: ["ws", "wss"],
         });

         const channelName = `user.${user.data.id}`;
         // console.log("📡 [HistoryPage] Subscribing to channel:", channelName);

         channelRef.current = pusherRef.current.subscribe(channelName);

         // Listen for notification events that should trigger history refresh
         channelRef.current.bind("notification.created", (data) => {
            // console.log("🔔 [HistoryPage] Notification received:", data);
            // console.log("🔄 [HistoryPage] Refreshing history due to new notification...");

            // Close any open modals to show updated data
            setSelectedItem(null);
            setShowQR(false);

            // Update last update timestamp
            setLastUpdate(new Date().toLocaleTimeString());

            // Show a brief visual feedback that new data is coming
            setTimeout(() => {
               fetchHistory(true); // Refresh history when notification is received (with refresh indicator)
            }, 500); // Small delay to show the refresh indicator
         });

         pusherRef.current.connection.bind("connected", () => {
            console.log("✅ [HistoryPage] Pusher connected successfully!");
            setIsConnected(true);
         });

         pusherRef.current.connection.bind("disconnected", () => {
            console.log("🔌 [HistoryPage] Pusher disconnected");
            setIsConnected(false);
         });

         pusherRef.current.connection.bind("error", (error) => {
            console.error("❌ [HistoryPage] Pusher connection error:", error);
            setIsConnected(false);
         });
      } catch (error) {
         console.error("💥 [HistoryPage] Failed to initialize Pusher:", error);
      }
   };

   // Cleanup Pusher connections
   const cleanup = () => {
      console.log("🧹 [HistoryPage] Cleaning up Pusher connections...");

      setIsConnected(false);
      setLastUpdate(null);

      if (channelRef.current) {
         channelRef.current.unbind_all();
         channelRef.current.unsubscribe();
         channelRef.current = null;
      }

      if (pusherRef.current) {
         pusherRef.current.disconnect();
         pusherRef.current = null;
      }
   };

   useEffect(() => {
      fetchHistory();
      initializePusher();

      // Cleanup function
      return () => {
         cleanup();
      };
   }, [dateFilter]);

   // Fetch QR code for selected item
   useEffect(() => {
      const fetchQR = async () => {
         if (!showQR || !selectedItem) return setQRData(null);
         try {
            const userStr = await AsyncStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const token = user?.data?.token;
            const res = await fetch(`${Config.API_BASE_URL}/lending/history/${selectedItem.id}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
               },
            });
            const data = await res.json();
            setQRData(data?.data || null);
         } catch (e) {
            setQRData(null);
         }
      };
      fetchQR();
   }, [showQR, selectedItem]);

   return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
         {/* Red header background */}
         <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
            <View style={styles.headerBg} />
            <View style={styles.headerContainer}>
               <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View>
                     <Text style={styles.headerTitle}>Riwayat Pinjaman</Text>
                     <Text style={styles.headerSubtitle}>Filter riwayat dengan tanggal</Text>
                  </View>
                  {/* Connection status indicator */}
                  <View style={[styles.connectionStatus, { backgroundColor: isConnected ? "#059669" : "#6b7280" }]}>
                     <MaterialIcons name="wifi" size={16} color="#fff" />
                     <Text style={styles.connectionText}>{isConnected ? "Live" : "Offline"}</Text>
                     {lastUpdate && isConnected && <Text style={styles.lastUpdateText}>• {lastUpdate}</Text>}
                  </View>
               </View>
               {/* Date Filter */}
               <View style={styles.searchBar}>
                  <Text style={styles.searchIcon}>📅</Text>
                  <TextInput style={styles.searchInput} placeholder="Pilih Tanggal (YYYY-MM-DD)" placeholderTextColor="#888" value={dateFilter} onChangeText={setDateFilter} />
               </View>
            </View>
            <View style={styles.sectionTitleWrap}>
               <Text style={styles.sectionTitle}>Daftar Riwayat</Text>
               <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  {!refreshing && (
                     <TouchableOpacity style={[styles.refreshBtn, refreshing && styles.refreshBtnDisabled]} onPress={() => fetchHistory(true)}>
                        <MaterialIcons name="refresh" size={18} color={refreshing ? "#9ca3af" : "#fff"} />
                     </TouchableOpacity>
                  )}
                  {refreshing && (
                     <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <ActivityIndicator size="small" color="#dc2626" />
                        <Text style={styles.refreshingText}>Memperbarui...</Text>
                     </View>
                  )}
                  {!refreshing && <Text style={styles.sectionTotal}>Total: {historyData.length}</Text>}
               </View>
            </View>
            {loading ? (
               <View style={{ alignItems: "center", marginTop: 32 }}>
                  <ActivityIndicator size="large" color="#dc2626" />
               </View>
            ) : (
               <View style={{ paddingHorizontal: 12 }}>
                  {historyData.map((item) => (
                     <TouchableOpacity
                        key={item.id}
                        style={styles.historyCard}
                        activeOpacity={0.9}
                        onPress={() => {
                           setSelectedItem(item);
                           setShowQR(false);
                        }}
                     >
                        <View style={styles.historyCardRow}>
                           <Text style={styles.historyId}>{item.transaction_id}</Text>
                           <Text style={[styles.historyStatus, { backgroundColor: getStatusColor(item.status) }]}>{statusMapping[item.status] || item.status}</Text>
                        </View>
                        {/* <View style={styles.historyBooksWrap}>
                           {item.compact.map((data, idx) => (
                              <View key={idx} style={styles.historyBookRow}>
                                 <Text style={styles.historyBookTitle} numberOfLines={1}>
                                    Buku: {data.book.title}
                                 </Text>
                                 {idx === 0 && item.compact.length > 1 && <Text style={styles.historyBookOther}>(+{item.compact.length - 1} Buku Lainnya)</Text>}
                              </View>
                           ))}
                        </View> */}
                        <View style={styles.historyBooksWrap}>
                           {historyData[0].compact.map((data, idx) => (
                              <View key={idx} style={styles.historyBookRow}>
                                 <Text style={styles.historyBookTitle} numberOfLines={1}>
                                    Buku: {data.book.title}
                                 </Text>
                                 {idx === 0 && item.compact.length > 1 && <Text style={styles.historyBookOther}>(+{item.compact.length - 1} Buku Lainnya)</Text>}
                              </View>
                           ))}
                        </View>
                        <View style={styles.historyCardRow}>
                           <View style={{ flex: 1 }}>
                              <Text style={styles.historyLabel}>Tanggal Peminjaman</Text>
                              <Text style={styles.historyDate}>{formatDate(item.created_at)}</Text>
                           </View>
                           <View style={{ flex: 1, alignItems: "flex-end" }}>
                              <Text style={styles.historyLabel}>Batas Peminjaman</Text>
                              <Text style={styles.historyDate}>{formatDate(item.return_date)}</Text>
                           </View>
                        </View>
                     </TouchableOpacity>
                  ))}
               </View>
            )}
         </ScrollView>
         {/* Detail Modal */}
         <Modal
            visible={!!selectedItem}
            transparent
            animationType="fade"
            onRequestClose={() => {
               setSelectedItem(null);
               setShowQR(false);
            }}
         >
            <View style={styles.modalOverlay}>
               <View style={styles.modalContent}>
                  {selectedItem && !showQR && (
                     <>
                        <View style={styles.modalHeader}>
                           <Text style={styles.historyId}>{selectedItem.transaction_id}</Text>
                           <Text style={[styles.historyStatus, { backgroundColor: getStatusColor(selectedItem.status) }]}>{statusMapping[selectedItem.status] || selectedItem.status}</Text>
                        </View>
                        <View style={styles.historyBooksWrap}>
                           {selectedItem.compact.map((data, idx) => (
                              <View key={idx} style={styles.historyBookRow}>
                                 <Text style={styles.historyBookTitle}>Buku: {data.book.title}</Text>
                              </View>
                           ))}
                        </View>
                        <View style={styles.historyCardRow}>
                           <View style={{ flex: 1 }}>
                              <Text style={styles.historyLabel}>Tanggal Peminjaman</Text>
                              <Text style={styles.historyDate}>{formatDate(selectedItem.created_at)}</Text>
                           </View>
                           <View style={{ flex: 1, alignItems: "flex-end" }}>
                              <Text style={styles.historyLabel}>Batas Peminjaman</Text>
                              <Text style={styles.historyDate}>{formatDate(selectedItem.return_date)}</Text>
                           </View>
                        </View>
                        <TouchableOpacity style={styles.qrBtn} onPress={() => setShowQR(true)}>
                           <Text style={styles.qrBtnText}>Tampilkan QR Code</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                           style={styles.closeBtn}
                           onPress={() => {
                              setSelectedItem(null);
                              setShowQR(false);
                           }}
                        >
                           <Text style={styles.closeBtnText}>Tutup</Text>
                        </TouchableOpacity>
                     </>
                  )}
                  {selectedItem && showQR && (
                     <>
                        <Text style={styles.qrTitle}>Gunakan QR berikut untuk mengambil buku</Text>
                        {qrData?.qr_code ? (
                           <Image source={{ uri: qrData.qr_code }} style={styles.qrImage} resizeMode="contain" />
                        ) : (
                           <View
                              style={{
                                 alignItems: "center",
                                 justifyContent: "center",
                                 // flex: 1,
                                 minHeight: 240,
                                 backgroundColor: "#fff",
                              }}
                           >
                              <ActivityIndicator size="large" color="#dc2626" />
                              <Text style={{ marginTop: 12, fontWeight: "bold" }}>Memuat QR Code</Text>
                           </View>
                        )}
                        <TouchableOpacity style={styles.qrBtn} onPress={() => setShowQR(false)}>
                           <Text style={styles.qrBtnText}>Tutup QR Code</Text>
                        </TouchableOpacity>
                     </>
                  )}
               </View>
            </View>
         </Modal>
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
      zIndex: -1,
   },
   headerContainer: {
      padding: 16,
      // gap: 16,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
   },
   headerSubtitle: {
      color: "#fff",
      fontSize: 16,
      marginBottom: 16,
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
   sectionTitleWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      marginTop: 8,
      marginBottom: 8,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 16,
   },
   sectionTotal: {
      fontWeight: "bold",
      color: "#dc2626",
      fontSize: 16,
   },
   refreshingText: {
      fontSize: 12,
      color: "#dc2626",
      fontWeight: "600",
   },
   refreshBtn: {
      backgroundColor: "#dc2626",
      borderRadius: 16,
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
   },
   refreshBtnDisabled: {
      backgroundColor: "#e5e7eb",
   },
   connectionStatus: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
   },
   connectionText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
   },
   lastUpdateText: {
      color: "#fff",
      fontSize: 10,
      opacity: 0.8,
   },
   historyCard: {
      backgroundColor: "#fff",
      borderRadius: 12,
      marginBottom: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      gap: 8,
   },
   historyCardRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
   },
   historyId: {
      fontWeight: "bold",
      textTransform: "uppercase",
      fontSize: 15,
   },
   historyStatus: {
      color: "#fff",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      fontSize: 12,
      fontWeight: "bold",
      overflow: "hidden",
   },
   historyBooksWrap: {
      backgroundColor: "#f3f4f6",
      borderRadius: 8,
      marginVertical: 6,
      paddingVertical: 4,
      paddingHorizontal: 8,
      gap: 2,
   },
   historyBookRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 2,
   },
   historyBookTitle: {
      fontSize: 13,
      color: "#222",
      fontWeight: "bold",
      flex: 1,
   },
   historyBookOther: {
      fontSize: 13,
      color: "#dc2626",
      fontWeight: "bold",
      marginLeft: 8,
   },
   historyLabel: {
      color: "#6b7280",
      fontSize: 12,
   },
   historyDate: {
      fontWeight: "bold",
      color: "#dc2626",
      fontSize: 14,
   },
   modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(231,0,11,1)",
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
      gap: 8,
   },
   modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
   },
   qrBtn: {
      backgroundColor: "#dc2626",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      marginTop: 16,
   },
   qrBtnText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 15,
   },
   closeBtn: {
      backgroundColor: "#fff",
      borderWidth: 2,
      borderColor: "#dc2626",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      marginTop: 8,
   },
   closeBtnText: {
      color: "#dc2626",
      fontWeight: "bold",
      fontSize: 15,
   },
   qrTitle: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 15,
      marginBottom: 8,
      color: "#222",
   },
   qrImage: {
      width: width * 0.7,
      height: width * 0.7,
      alignSelf: "center",
      // marginBottom: 16,
   },
});
