import React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from 'react-native-vector-icons/Ionicons'; // Uncomment if using vector icons

export default function UserNavbar({ status = "authenticated", greetings = "Pagi", userData = { data: { name: "Nama Pengguna" } } }) {
   // Get user name from AsyncStorage if not provided in props
   const [userName, setUserName] = React.useState(userData?.data?.name);

   React.useEffect(() => {
      if (!userData?.data?.name) {
         // Try to get user from AsyncStorage
         AsyncStorage.getItem("user").then((value) => {
            if (value) {
               try {
                  const parsed = JSON.parse(value);
                  if (parsed?.data?.name) {
                     setUserName(parsed.data.name);
                  }
               } catch (e) {}
            }
         });
      }
   }, [userData?.data?.name]);

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
            <View style={styles.notifIcon}>
               {/* <Icon name="notifications-outline" size={28} color="#E7000B" /> */}
               <Text style={{ fontSize: 24, color: "#E7000B" }}>🔔</Text>
            </View>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   navbar: {
    //   position: "absolute",
    //   top: 20,
      left: 0,
      width: "100%",
      zIndex: 10,
      // backgroundColor: "#fff",
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
   },
});
