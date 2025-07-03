import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import TopNavbar from "./TopNavbar";

// Test component to verify notification system setup
export default function NotificationTest() {
   const testUserData = {
      data: {
         id: 1, // Replace with actual user ID for testing
         name: "Test User",
      },
   };

   return (
      <View style={styles.container}>
         <TopNavbar status="authenticated" greetings="Testing" userData={testUserData} />

         <View style={styles.content}>
            <Text style={styles.title}>Notification System Test</Text>
            <Text style={styles.subtitle}>Check the console for Pusher connection logs</Text>

            <View style={styles.instructions}>
               <Text style={styles.instructionTitle}>Expected Behavior:</Text>
               <Text style={styles.instruction}>• Bell icon should appear in top navbar</Text>
               <Text style={styles.instruction}>• Console should show Pusher connection attempt</Text>
               <Text style={styles.instruction}>• If successful: "✅ Pusher connected successfully!"</Text>
               <Text style={styles.instruction}>• If failed: Will fallback to polling every 30s</Text>
               <Text style={styles.instruction}>• Tap bell icon to open notifications panel</Text>
            </View>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
   },
   content: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
   },
   title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
   },
   subtitle: {
      fontSize: 16,
      textAlign: "center",
      color: "#666",
      marginBottom: 30,
   },
   instructions: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      marginTop: 20,
   },
   instructionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
   },
   instruction: {
      fontSize: 14,
      marginBottom: 8,
      color: "#333",
   },
});
