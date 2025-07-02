import React from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import TopNavbar from "../components/TopNavbar";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native"; // ✅ add this

function getGreeting() {
   const hour = new Date().getHours();
   if (hour < 10) return "Pagi";
   if (hour < 15) return "Siang";
   if (hour < 18) return "Sore";
   return "Malam";
}

const status = "authenticated";
const userData = { name: "Nama Pengguna" };

export default function UserLayout({ children }) {
   const navigation = useNavigation(); // ✅ get nav from context
   const greetings = getGreeting();

   return (
      <SafeAreaView style={styles.root}>
         <TopNavbar status={status} greetings={greetings} userData={userData} navigation={navigation} />
         {/* <View style={styles.headerBg} /> */}
         <SafeAreaView style={styles.content}>{children}</SafeAreaView>
         <BottomNavbar navigation={navigation} status={status} />
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   root: {
      flex: 1,
      backgroundColor: "#fff",
      position: "relative",
      paddingVertical: 30,
      zIndex: 0, // Ensure navbar is above content
   },
   headerBg: {
      backgroundColor: "#E7000B",
      width: "100%",
      height: 260,
      position: "absolute",
      top: 0,
      left: 0,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      zIndex: -1,
   },
   content: {
      flex: 1,
   },
});
