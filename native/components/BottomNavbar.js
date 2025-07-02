import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const menuData = [
   { title: "utama", icon: "home-outline", route: "Dashboard", emoji: "🏠" },
   { title: "buku", icon: "book-outline", route: "BookPage", emoji: "📚" },
   { title: "tas", icon: "bag-outline", route: "BagPage", emoji: "👜" },
   { title: "riwayat", icon: "time-outline", route: "HistoryPage", emoji: "🕑" },
   { title: "akun", icon: "person-outline", route: "SettingPage", emoji: "👤" },
];

export default function BottomNavbar({ navigation, status = "authenticated" }) {
   return (
      <View style={[styles.bottomNav, status === "unauthenticated" ? styles.bottomNavHidden : null]}>
         {menuData.map((item, idx) => (
            <TouchableOpacity
               key={item.title}
               style={idx === 2 ? styles.centerNavItem : styles.navItem}
               activeOpacity={0.7}
               onPress={() => {
                  navigation?.navigate(item.route);
               }}
            >
               <Text style={[styles.navIcon, idx === 2 ? styles.centerNavIcon : null]}>{item.emoji}</Text>
               <Text style={[styles.navLabel, idx === 2 ? styles.centerNavLabel : null]}>{item.title}</Text>
            </TouchableOpacity>
         ))}
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
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: -4 },
      elevation: 8,
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
