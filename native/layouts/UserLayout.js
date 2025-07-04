import React, { useRef, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Animated } from "react-native";
import TopNavbar from "../components/TopNavbar";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation, useIsFocused } from "@react-navigation/native";

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
   const fadeAnim = useRef(new Animated.Value(0)).current;
   const slideAnim = useRef(new Animated.Value(20)).current;
   const isFocused = useIsFocused();

   useEffect(() => {
      if (isFocused) {
         fadeAnim.setValue(0);
         slideAnim.setValue(20);
         Animated.parallel([
            Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 300,
               useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
               toValue: 0,
               duration: 300,
               useNativeDriver: true,
            }),
         ]).start();
      }
   }, [isFocused, children]);

   return (
      <SafeAreaView style={styles.root}>
         <TopNavbar status={status} greetings={greetings} userData={userData} navigation={navigation} />
         <Animated.View
            style={[
               styles.content,
               {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
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
      paddingTop: 30,
      zIndex: 0,
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
