import React from "react";
import { View, StyleSheet } from "react-native";
import TopNavbar from "../components/TopNavbar";
import BottomNavbar from "../components/BottomNavbar";

export default function AppLayout({ children, navigation }) {
   return (
      <View style={styles.root}>
         <TopNavbar navigation={navigation} />
         <View style={styles.content}>{children}</View>
         <BottomNavbar navigation={navigation} />
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      flex: 1,
      backgroundColor: "#fff",
      position: "relative",
   },
   content: {
      flex: 1,
      backgroundColor: "#fff",
   },
});
