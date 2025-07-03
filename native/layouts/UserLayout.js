import React, { useRef, useEffect } from "react"; // ✅ Import useRef and useEffect
import { SafeAreaView, View, StyleSheet, Animated } from "react-native"; // ✅ Import Animated
import TopNavbar from "../components/TopNavbar";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation, useIsFocused } from "@react-navigation/native"; // ✅ add useIsFocused

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
   const navigation = useNavigation();
   const greetings = getGreeting();
   const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for fade-in
   const slideAnim = useRef(new Animated.Value(20)).current; // Initial X position for slide-in (e.g., from right)
   const isFocused = useIsFocused(); // ✅ Get focus state of the screen

   useEffect(() => {
      if (isFocused) {
         // Reset and start animation when the screen becomes focused (i.e., when a new screen with this layout is shown)
         fadeAnim.setValue(0);
         slideAnim.setValue(20); // Or -20 for slide from left
         Animated.parallel([
            Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 300, // Duration of the fade-in animation
               useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
               toValue: 0,
               duration: 300, // Duration of the slide-in animation
               useNativeDriver: true,
            }),
         ]).start();
      }
   }, [isFocused, children]); // Re-run animation when children or focus changes

   return (
      <SafeAreaView style={styles.root}>
         <TopNavbar status={status} greetings={greetings} userData={userData} navigation={navigation} />
         {/* The headerBg view is commented out, so it won't affect the layout. */}
         {/* <View style={styles.headerBg} /> */}
         <Animated.View // ✅ Use Animated.View
            style={[
               styles.content,
               {
                  opacity: fadeAnim, // Apply opacity animation
                  transform: [{ translateX: slideAnim }], // Apply slide animation
               },
            ]}
         >
            {children}
         </Animated.View>
         <BottomNavbar navigation={navigation} status={status} />
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   root: {
      flex: 1,
      backgroundColor: "#fff",
      position: "relative",
      paddingTop: 30, // Assuming TopNavbar height is considered
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
      // You might need to adjust padding here if TopNavbar/BottomNavbar don't have fixed heights or are absolutely positioned.
   },
});