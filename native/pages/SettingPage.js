import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SettingPage({ navigation }) {
   return (
      <View style={styles.container}>
         <Text style={styles.text}>Setting Page (Blank)</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
   },
   text: {
      fontSize: 22,
      color: "#dc2626",
      fontWeight: "bold",
   },
});
