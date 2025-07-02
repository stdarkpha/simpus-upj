import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AppNav from "./AppNav";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const checkSession = async () => {
         try {
            const userStr = await AsyncStorage.getItem("user");
            if (userStr) {
               setIsLoggedIn(true);
            }
         } catch (e) {
            // ignore
         }
         setLoading(false);
      };
      checkSession();
   }, []);

   if (loading) {
      return (
         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#dc2626" />
         </View>
      );
   }

   return <AppNav />;
}
