import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const menuData = [
   { title: "utama", icon: { name: "home", lib: AntDesign }, route: "Dashboard" },
   { title: "buku", icon: { name: "book", lib: AntDesign }, route: "BookPage" },
   { title: "tas", icon: { name: "bag-outline", lib: Ionicons }, route: "BagPage" },
   { title: "riwayat", icon: { name: "history", lib: MaterialCommunityIcons }, route: "HistoryPage" },
   { title: "akun", icon: { name: "user", lib: AntDesign }, route: "SettingPage" },
];

export default function BottomNavbar({ navigation, status = "authenticated" }) {
   return (
      <View style={[styles.bottomNav, status === "unauthenticated" ? styles.bottomNavHidden : null]}>
         {menuData.map((item, idx) => {
            const IconComponent = item.icon.lib;
            return (
               <TouchableOpacity
                  key={item.title}
                  style={idx === 2 ? styles.centerNavItem : styles.navItem}
                  activeOpacity={0.7}
                  onPress={() => {
                     navigation?.navigate(item.route);
                  }}
               >
                  <IconComponent name={item.icon.name} size={idx === 2 ? 24 : 20} color={idx === 2 ? "#fff" : "#E7000B"} style={idx === 2 ? styles.centerNavIcon : styles.navIcon} />
                  <Text style={[styles.navLabel, idx === 2 ? styles.centerNavLabel : null]}>{item.title}</Text>
               </TouchableOpacity>
            );
         })}
      </View>
   );
}

const styles = StyleSheet.create({
   bottomNav: {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      backgroundColor: "#fff",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      zIndex: 20,
   },
   bottomNavHidden: {
      transform: [{ translateY: 100 }],
      opacity: 0,
   },
   navItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 6,
   },
   navIcon: {
      fontSize: 24,
      color: "#E7000B",
   },
   navLabel: {
      fontSize: 12,
      marginTop: 4,
      color: "#E7000B",
      fontWeight: "bold",
      textTransform: "capitalize",
   },
   centerNavItem: {
      width: 72,
      height: 72,
      marginTop: -32,
      backgroundColor: "#E7000B",
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#E7000B",
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 8,
   },
   centerNavIcon: {
      fontSize: 32,
      color: "#fff",
   },
   centerNavLabel: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 13,
   },
});
