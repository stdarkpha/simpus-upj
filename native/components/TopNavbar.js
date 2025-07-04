import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, FlatList, Animated, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Pusher from "pusher-js";
import Config from "../config";

export default function UserNavbar({ status = "authenticated", greetings = "Pagi", userData = { data: { name: "Nama Pengguna" } } }) {
   // Manajemen state
   const [userName, setUserName] = useState(userData?.data?.name);
   const [notifications, setNotifications] = useState([]);
   const [unreadCount, setUnreadCount] = useState(0);
   const [showNotifications, setShowNotifications] = useState(false);
   const [authToken, setAuthToken] = useState(null);

   // Refs untuk Pusher
   const pusherRef = useRef(null);
   const channelRef = useRef(null);
   const pollingIntervalRef = useRef(null);

   // Animasi
   const badgeScale = useRef(new Animated.Value(1)).current;
   const panelTranslateY = useRef(new Animated.Value(300)).current; // Mulai dari luar layar

   useEffect(() => {
      initializeNotifications();
      return () => cleanup();
   }, []);

   useEffect(() => {
      // Inisialisasi Pusher ketika kita memiliki data user dan auth token
      const initializePusherIfReady = async () => {
         if (authToken) {
            // Dapatkan data user dari AsyncStorage jika tidak diteruskan melalui props
            let currentUserData = userData;

            if (!userData?.data?.id) {
               const userStr = await AsyncStorage.getItem("user");
               const user = userStr ? JSON.parse(userStr) : null;
               if (user?.data?.id) {
                  currentUserData = user;
                  console.log("🔄 Using user data from AsyncStorage for Pusher");
               }
            }

            if (currentUserData?.data?.id) {
               console.log("🚀 Ready to initialize Pusher with user ID:", currentUserData.data.id);
               initializePusher(currentUserData);
            } else {
               console.warn("⚠️ Cannot initialize Pusher: User ID not found");
            }
         }
      };

      initializePusherIfReady();
   }, [authToken]);

   const initializeNotifications = async () => {
      try {
         console.log("🚀 Initializing notifications...");

         // Dapatkan data user dan token dari AsyncStorage (metode yang benar)
         const userStr = await AsyncStorage.getItem("user");
         const user = userStr ? JSON.parse(userStr) : null;
         const token = user?.data?.token;

         console.log("📱 User from storage:", user ? "Found" : "Not found");
         console.log("🔑 Token from storage:", token ? "Found" : "Not found");

         if (user?.data?.name) {
            setUserName(user.data.name);
            console.log("✅ Username set:", user.data.name);
         }

         // Simpan data user lengkap untuk digunakan nanti
         if (user?.data?.id) {
            console.log("🆔 User ID found:", user.data.id);
            // Update prop userData dengan data yang tersimpan
            userData.data = { ...userData.data, ...user.data };
         }

         if (token) {
            console.log("🔑 Setting auth token...");
            setAuthToken(token);
            await fetchNotifications(token);
         } else {
            console.warn("⚠️ No auth token found in storage");
         }
      } catch (error) {
         console.error("❌ Failed to initialize notifications:", error);
      }
   };

   const fetchNotifications = async (token) => {
      try {
         // console.log("📡 Fetching notifications...");r
         // console.log("🌐 API URL:", `${Config.API_URL}/notifications`);r

         const response = await fetch(`${Config.API_URL}/notifications`, {
            method: "GET",
            headers: {
               Authorization: `Bearer ${token}`,
               Accept: "application/json",
               "Content-Type": "application/json",
            },
         });

         // console.log("📊 Response status:", response.status);
         const data = await response.json();
         // console.log("📋 Response data:", data);

         if (data.success && data.data) {
            // console.log("✅ Notifications loaded:", data.data.length);
            setNotifications(data.data);
            const unread = data.data.filter((n) => !n.is_read).length;
            setUnreadCount(unread);
            // console.log("🔔 Unread count:", unread);

            if (unread > 0) {
               animateBadge();
            }
         } else {
            console.warn("⚠️ No notifications data or request failed:", data);
         }
      } catch (error) {
         console.error("❌ Failed to fetch notifications:", error);
         console.log("🔄 Starting polling as fallback...");
         startPolling(); // Fallback to polling
      }
   };

   const initializePusher = () => {
      if (!userData?.data?.id || !authToken) {
         console.warn("Cannot initialize Pusher: Missing user ID or token");
         return;
      }

      try {
         // Inisialisasi Pusher dengan pengaturan yang kompatibel dengan Expo
         pusherRef.current = new Pusher(Config.PUSHER_KEY, {
            cluster: Config.PUSHER_CLUSTER,
            forceTLS: true,
            // Untuk kompatibilitas React Native/Expo
            enabledTransports: ["ws", "wss"],
         });

         const channelName = `user.${userData.data.id}`;
         console.log("📡 Subscribing to channel:", channelName);

         channelRef.current = pusherRef.current.subscribe(channelName);

         // Dengarkan notifikasi baru
         channelRef.current.bind("notification.created", (data) => {
            console.log("🔔 New notification received:", data);
            handleNewNotification(data);
         });

         pusherRef.current.connection.bind("connected", () => {
            console.log("✅ Pusher connected successfully!");
         });

         pusherRef.current.connection.bind("disconnected", () => {
            console.log("🔌 Pusher disconnected");
         });

         pusherRef.current.connection.bind("error", (error) => {
            console.error("❌ Pusher connection error:", error);
            startPolling(); // Fallback to polling
         });

         pusherRef.current.connection.bind("unavailable", () => {
            console.warn("⚠️ Pusher unavailable, falling back to polling");
            startPolling(); // Fallback ke polling
         });
      } catch (error) {
         console.error("💥 Failed to initialize Pusher:", error);
         startPolling(); // Fallback ke polling
      }
   };

   const handleNewNotification = (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);

      if (!newNotification.is_read) {
         setUnreadCount((prev) => prev + 1);
         animateBadge();
         console.log("🔔 New notification:", newNotification.title, "-", newNotification.message);
      }
   };

   const startPolling = () => {
      if (pollingIntervalRef.current) return; // Sudah polling

      console.log("🔄 Starting notification polling as fallback...");

      pollingIntervalRef.current = setInterval(async () => {
         if (authToken) {
            await fetchNotifications(authToken);
         }
      }, 30000); // Polling setiap 30 detik
   };

   const animateBadge = () => {
      Animated.sequence([
         Animated.timing(badgeScale, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
         }),
         Animated.timing(badgeScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
         }),
      ]).start();
   };

   const toggleNotifications = () => {
      if (!showNotifications) {
         // Reset panel ke posisi bawah terlebih dahulu
         panelTranslateY.setValue(300);
         setShowNotifications(true);
         // Delay kecil untuk memastikan modal di-render, lalu animasi panel naik
         setTimeout(() => {
            Animated.timing(panelTranslateY, {
               toValue: 0,
               duration: 400,
               useNativeDriver: true,
            }).start();
         }, 50);
      } else {
         // Animasi panel turun
         Animated.timing(panelTranslateY, {
            toValue: 500,
            duration: 400,
            useNativeDriver: true,
         }).start(() => {
            setShowNotifications(false);
         });
      }
   };

   const dismissModal = () => {
      // Animasi panel turun
      Animated.timing(panelTranslateY, {
         toValue: 500,
         duration: 400,
         useNativeDriver: true,
      }).start(() => {
         setShowNotifications(false);
      });
   };

   const markAllAsRead = async () => {
      if (!authToken) return;

      try {
         const response = await fetch(`${Config.API_URL}/notifications/read-all`, {
            method: "PUT",
            headers: {
               Authorization: `Bearer ${authToken}`,
               Accept: "application/json",
               "Content-Type": "application/json",
            },
         });

         const data = await response.json();

         if (data.success) {
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
            setShowNotifications(false);
         }
      } catch (error) {
         console.error("Failed to mark all notifications as read:", error);
      }
   };

   const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString("id-ID", {
         day: "numeric",
         month: "short",
      });
   };

   const getNotificationIcon = (type) => {
      switch (type) {
         case "success":
            return "check-circle";
         case "warning":
            return "warning";
         case "error":
            return "error";
         case "info":
            return "info";
         default:
            return "notifications";
      }
   };

   const getNotificationColor = (type) => {
      switch (type) {
         case "success":
            return "#10B981";
         case "warning":
            return "#F59E0B";
         case "error":
            return "#EF4444";
         case "info":
            return "#3B82F6";
         default:
            return "#6B7280";
      }
   };

   const cleanup = () => {
      if (channelRef.current) {
         channelRef.current.unbind_all();
         channelRef.current.unsubscribe();
      }
      if (pusherRef.current) {
         pusherRef.current.disconnect();
      }
      if (pollingIntervalRef.current) {
         clearInterval(pollingIntervalRef.current);
      }
   };

   const renderNotificationItem = ({ item }) => (
      <View style={[styles.notificationItem, !item.is_read && styles.unreadNotification]}>
         <View style={styles.notificationContent}>
            <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(item.type) + "20" }]}>
               <MaterialIcons name={getNotificationIcon(item.type)} size={20} color={getNotificationColor(item.type)} />
            </View>
            <View style={styles.notificationText}>
               <Text style={styles.notificationTitle} numberOfLines={1}>
                  {item.title}
               </Text>
               <Text style={styles.notificationMessage} numberOfLines={2}>
                  {item.message}
               </Text>
               <Text style={styles.notificationTime}>{formatDate(item.timestamp || item.created_at)}</Text>
            </View>
            {!item.is_read && <View style={styles.unreadDot} />}
         </View>
      </View>
   );

   return (
      <View style={[styles.navbar, status === "unauthenticated" ? styles.navbarHidden : null]}>
         <View style={styles.navbarContent}>
            <View style={styles.accountSection}>
               <View style={styles.logoContainer}>
                  <Image source={{ uri: "https://fesimp.farouq.me/logo.png" }} style={styles.logo} />
               </View>
               <View style={styles.accountText}>
                  <Text style={styles.greetingText}>Selamat {greetings},</Text>
                  <Text style={styles.userName} numberOfLines={1}>
                     {userName}
                  </Text>
               </View>
            </View>

            {/* Ikon Notifikasi dengan Badge */}
            <TouchableOpacity style={styles.notifIcon} onPress={toggleNotifications}>
               <MaterialIcons name="notifications-none" size={32} color="#888" />
               {unreadCount > 0 && (
                  <Animated.View style={[styles.notificationBadge, { transform: [{ scale: badgeScale }] }]}>
                     <Text style={styles.badgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
                  </Animated.View>
               )}
            </TouchableOpacity>
         </View>

         {/* Modal Notifikasi */}
         <Modal visible={showNotifications} animationType="fade" transparent={true} onRequestClose={dismissModal}>
            <View style={styles.modalOverlay}>
               {/* Overlay background yang menutup modal ketika di-tap */}
               <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={dismissModal} />

               <Animated.View
                  style={[
                     styles.notificationsPanel,
                     {
                        transform: [{ translateY: panelTranslateY }],
                     },
                  ]}
               >
                  {/* Header */}
                  <View style={styles.modalHeader}>
                     <Text style={styles.modalTitle}>Notifications</Text>
                     <TouchableOpacity onPress={dismissModal}>
                        <MaterialIcons name="close" size={24} color="#6B7280" />
                     </TouchableOpacity>
                  </View>

                  {/* Daftar Notifikasi */}
                  <View style={styles.notificationsList}>
                     {notifications.length === 0 ? (
                        <View style={styles.emptyState}>
                           <MaterialIcons name="notifications-none" size={48} color="#D1D5DB" />
                           <Text style={styles.emptyText}>No notifications yet</Text>
                        </View>
                     ) : (
                        <FlatList data={notifications} renderItem={renderNotificationItem} keyExtractor={(item) => item.id.toString()} showsVerticalScrollIndicator={false} style={styles.notificationsContainer} />
                     )}
                  </View>

                  {/* Footer */}
                  {notifications.length > 0 && unreadCount > 0 && (
                     <View style={styles.modalFooter}>
                        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                           <Text style={styles.markAllText}>Mark all as read</Text>
                        </TouchableOpacity>
                     </View>
                  )}
               </Animated.View>
            </View>
         </Modal>
      </View>
   );
}

const styles = StyleSheet.create({
   navbar: {
      left: 0,
      width: "100%",
      zIndex: 10,
      paddingVertical: 16,
      paddingHorizontal: 16,
   },
   navbarHidden: {
      transform: [{ translateY: -100 }],
      opacity: 0,
   },
   navbarContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   accountSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
   },
   logoContainer: {
      width: 40,
      height: 40,
      backgroundColor: "#fff",
      borderRadius: 20,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
   },
   logo: {
      width: 32,
      height: 32,
      resizeMode: "contain",
   },
   accountText: {
      flexDirection: "column",
      maxWidth: 120,
   },
   greetingText: {
      fontSize: 12,
      color: "#000",
      opacity: 0.75,
   },
   userName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#000",
      textTransform: "capitalize",
   },
   notifIcon: {
      width: 40,
      height: 40,
      backgroundColor: "#f5f6f8",
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
   },
   notificationBadge: {
      position: "absolute",
      top: -2,
      right: -2,
      backgroundColor: "#DC2626",
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
   },
   badgeText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
   },
   // Gaya Modal
   modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
   },
   modalBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
   },
   notificationsPanel: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "80%",
      minHeight: "50%",
   },
   modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
   },
   modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#111827",
   },
   notificationsList: {
      flex: 1,
   },
   notificationsContainer: {
      flex: 1,
   },
   emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
   },
   emptyText: {
      marginTop: 12,
      fontSize: 16,
      color: "#6B7280",
   },
   notificationItem: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#F3F4F6",
   },
   unreadNotification: {
      backgroundColor: "#EFF6FF",
   },
   notificationContent: {
      flexDirection: "row",
      alignItems: "flex-start",
   },
   notificationIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
   },
   notificationText: {
      flex: 1,
   },
   notificationTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#111827",
      marginBottom: 4,
   },
   notificationMessage: {
      fontSize: 14,
      color: "#6B7280",
      lineHeight: 20,
      marginBottom: 6,
   },
   notificationTime: {
      fontSize: 12,
      color: "#9CA3AF",
   },
   unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#3B82F6",
      marginLeft: 8,
      marginTop: 4,
   },
   modalFooter: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      backgroundColor: "#F9FAFB",
   },
   markAllButton: {
      alignSelf: "flex-start",
   },
   markAllText: {
      fontSize: 14,
      color: "#3B82F6",
      fontWeight: "600",
   },
});
