import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const handleLogout = async (setIsLoggedIn) => {
   // Accept setIsLoggedIn
   try {
      // It's good practice to also inform the server about the logout
      const userStr = await AsyncStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.data?.token;

      if (token) {
         await fetch("https://besimpus.farouq.me/api/user/logout", {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
               Accept: "application/json",
               "Content-Type": "application/json",
            },
         });
         // Not handling the response of the fetch for simplicity,
         // but in a real app you might want to.
      }
   } catch (e) {
      // Even if the server call fails, the user should be logged out on the client
      Alert.alert("Logout Error", "Terjadi kesalahan saat menghubungi server.");
   } finally {
      // This block will run regardless of errors
      await AsyncStorage.removeItem("user");
      setIsLoggedIn(false); // This will trigger the navigation change
   }
};

export default function SettingPage({ navigation, setIsLoggedIn }) {
   const [userName, setUserName] = React.useState("");
   const [userRole, setUserRole] = React.useState("");
   const [userUid, setUserUid] = React.useState("");
   const [userEmail, setUserEmail] = React.useState("");

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
   }, []);

   return (
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
         <View style={styles.headerBg} />
         <View style={styles.container}>
            <View style={styles.header}>
               <Text style={styles.headerTitle}>{userName}</Text>
               <Text style={styles.headerSubtitle}>
                  <Text style={{ textTransform: "capitalize" }}>{userRole}</Text> | NIM: {userUid} | {userEmail}
               </Text>
            </View>

            <View style={styles.card}>
               <Text style={styles.cardTitle}>Total Peminjaman</Text>
               <View style={styles.chartRow}>
                  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                     <Text style={styles.chartTotal}>100</Text>

                     <Text style={styles.statLabel}>Total</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={{ flex: 1, alignItems: "center" }}>
                     <Text style={styles.statNumber}>75</Text>
                     <Text style={styles.statLabel}>Tepat Waktu</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={{ flex: 1, alignItems: "center" }}>
                     <Text style={styles.statNumber}>25</Text>
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
                  {/* <Icon name="account" size={24} color="#333" /> */}
                  <Text style={styles.settingsText}>Update Foto</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.settingsItem}>
                  {/* <Icon name="form-select" size={24} color="#333" /> */}
                  <Text style={styles.settingsText}>Update Profile</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.settingsItem, styles.logoutItem]} onPress={() => handleLogout(setIsLoggedIn)}>
                  {/* <Icon name="logout" size={24} color="#E7000B" /> */}
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
