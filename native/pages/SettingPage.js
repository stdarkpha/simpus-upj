import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import Config from "../config";

const handleLogout = async (setIsLoggedIn) => {
   try {
      const userStr = await AsyncStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.data?.token;

      if (token) {
         await fetch(`${Config.API_BASE_URL}/user/logout`, {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
               Accept: "application/json",
               "Content-Type": "application/json",
            },
         });
      }
   } catch (e) {
      Alert.alert("Logout Error", "Terjadi kesalahan saat menghubungi server.");
   } finally {
      await AsyncStorage.removeItem("user");
      setIsLoggedIn(false); 
   }
};

export default function SettingPage({ navigation, setIsLoggedIn }) {
   const [userName, setUserName] = React.useState("");
   const [userRole, setUserRole] = React.useState("");
   const [userUid, setUserUid] = React.useState("");
   const [userEmail, setUserEmail] = React.useState("");
   const [lendingStats, setLendingStats] = React.useState({
      total: 0,
      onTime: 0,
      late: 0,
   });
   const [isLoadingStats, setIsLoadingStats] = React.useState(true);

   const fetchLendingStats = async () => {
      try {
         const userStr = await AsyncStorage.getItem("user");
         const user = userStr ? JSON.parse(userStr) : null;
         const token = user?.data?.token;

         if (token) {
            const response = await fetch(`${Config.API_URL}/lending/stats`, {
               method: "GET",
               headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                  "Content-Type": "application/json",
               },
            });

            const data = await response.json();
            console.log("Lending Stats Response:", data);
            if (data.success && data.data) {
               setLendingStats({
                  total: data.data.total_lendings || 0,
                  onTime: data.data.on_time_returns || 0,
                  late: data.data.currently_overdue || 0,
               });
            }
         }
      } catch (error) {
         console.error("Failed to fetch lending stats:", error);
      } finally {
         setIsLoadingStats(false);
      }
   };

   React.useEffect(() => {
      AsyncStorage.getItem("user").then((value) => {
         if (value) {
            try {
               const parsed = JSON.parse(value);
               if (parsed?.data) {
                  setUserName(parsed.data.name || "");
                  setUserRole(parsed.data.role || "");
                  setUserUid(parsed.data.uid || "");
                  setUserEmail(parsed.data.email || "");
               }
            } catch (e) {}
         }
      });

      // Fetch lending statistics
      fetchLendingStats();
   }, []);

   return (
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
         <View style={styles.headerBg} />
         <View style={styles.container}>
            <View style={styles.header}>
               <Text style={styles.headerTitle}>{userName}</Text>
               <Text style={styles.headerSubtitle}>
                  <Text style={{ textTransform: "capitalize" }}>{userRole} </Text>
                  {userUid && ` | NIM: ${userUid}`}| {userEmail}
               </Text>
            </View>

            <View style={styles.card}>
               <Text style={styles.cardTitle}>Total Peminjaman</Text>
               <View style={styles.chartRow}>
                  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                     <Text style={styles.chartTotal}>{isLoadingStats ? "..." : lendingStats.total}</Text>
                     <Text style={styles.statLabel}>Total</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={{ flex: 1, alignItems: "center" }}>
                     <Text style={styles.statNumber}>{isLoadingStats ? "..." : lendingStats.onTime}</Text>
                     <Text style={styles.statLabel}>Tepat Waktu</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={{ flex: 1, alignItems: "center" }}>
                     <Text style={styles.statNumber}>{isLoadingStats ? "..." : lendingStats.late}</Text>
                     <Text style={styles.statLabel}>Terlambat</Text>
                  </View>
               </View>
            </View>

            <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Pengaturan</Text>
               <TouchableOpacity>
                  <Text style={styles.seeAll}>Lihat Semua</Text>
               </TouchableOpacity>
            </View>

            <View style={styles.settingsList}>
               <TouchableOpacity style={styles.settingsItem}>
                  <Text style={styles.settingsText}>Update Foto</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.settingsItem}>
                  <Text style={styles.settingsText}>Update Profile</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.settingsItem, styles.logoutItem]} onPress={() => handleLogout(setIsLoggedIn)}>
                  <Text style={[styles.settingsText, styles.logoutText]}>Keluar</Text>
               </TouchableOpacity>
            </View>
         </View>
      </ScrollView>
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
   container: {
      flex: 1,
      padding: 16,
      paddingTop: 32,
   },
   header: {
      alignItems: "center",
      marginBottom: 16,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
   },
   headerSubtitle: {
      color: "#fff",
      marginTop: 4,
      fontSize: 14,
   },
   card: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
   },
   cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
      textAlign: "center",
   },
   chartRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
   },
   chartTotal: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#E7000B",
      marginTop: 8,
   },
   divider: {
      width: 1,
      height: 60,
      backgroundColor: "#DFE4EA",
      marginHorizontal: 8,
   },
   statNumber: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#333",
   },
   statLabel: {
      fontSize: 12,
      color: "#888",
   },
   sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginTop: 8,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
   },
   seeAll: {
      color: "#E7000B",
      fontWeight: "bold",
   },
   settingsList: {
      marginTop: 16,
      gap: 12,
   },
   settingsItem: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
   },
   settingsText: {
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 8,
      color: "#333",
   },
   logoutItem: {
      backgroundColor: "#FDEAEA",
      borderColor: "#E7000B",
      borderWidth: 1,
   },
   logoutText: {
      color: "#E7000B",
   },
});
