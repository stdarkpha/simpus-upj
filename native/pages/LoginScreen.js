import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ onLogin }) {
   const [email, setEmail] = useState("farouq@upj.com");
   const [password, setPassword] = useState("qwe123321asd");
   const [isLoggingIn, setIsLoggingIn] = useState(false);
   const [error, setError] = useState(null);

   const handleLogin = async () => {
      setIsLoggingIn(true);
      setError(null);
      try {
         const response = await fetch("https://besimpus.farouq.me/api/user/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               email,
               password,
            }),
         });
         const data = await response.json();
         if (response.ok) {
            // Save all data to AsyncStorage
            await AsyncStorage.setItem("user", JSON.stringify(data));
            onLogin(data);
         } else {
            setError(data?.message || "Login gagal");
         }
      } catch (e) {
         setError("Terjadi kesalahan jaringan");
      }
      setIsLoggingIn(false);
   };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.loginWrapper}>
            <Image source={{ uri: "https://fesimp.farouq.me/Logo-upj.webp" }} style={styles.logo} resizeMode="contain" />
            <View style={styles.form}>
               <Text style={styles.formTitle}>Masuk untuk meminjam</Text>
               <TextInput style={styles.input} placeholder="Email.." value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} required />
               <TextInput style={styles.input} placeholder="Sandi.." value={password} onChangeText={setPassword} secureTextEntry required />
               {error && <Text style={styles.errorText}>{error}</Text>}
               <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoggingIn} activeOpacity={0.8}>
                  {isLoggingIn && <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />}
                  <Text style={styles.loginButtonText}>{isLoggingIn ? "Loading.." : "Masuk"}</Text>
               </TouchableOpacity>
            </View>
            <Text style={styles.registerText}>
               Tidak punya akun?{" "}
               <Text
                  style={styles.registerLink}
                  onPress={() => {
                     /* navigation placeholder */
                  }}
               >
                  Daftar
               </Text>
            </Text>
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      marginTop: 0,
      backgroundColor: "#fff",
   },
   loginWrapper: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      gap: 32,
   },
   logo: {
      width: 128,
      height: 128,
      marginBottom: 16,
   },
   form: {
      width: "100%",
      maxWidth: 400,
      gap: 16,
   },
   formTitle: {
      fontWeight: "bold",
      color: "#27272a",
      fontSize: 20,
      marginBottom: 8,
   },
   input: {
      backgroundColor: "#fff",
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontWeight: "600",
      fontSize: 16,
      marginBottom: 8,
      shadowColor: "#64748b",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
   },
   loginButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ef4444",
      paddingVertical: 16,
      borderRadius: 8,
      shadowColor: "#f87171",
      shadowOpacity: 0.5,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
      marginTop: 8,
   },
   loginButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
   },
   registerText: {
      color: "#a1a1aa",
      fontWeight: "500",
      marginTop: 24,
   },
   registerLink: {
      color: "#ef4444",
      fontWeight: "bold",
   },
   errorText: {
      color: "#ef4444",
      fontWeight: "bold",
      marginBottom: 8,
      marginTop: -4,
   },
});
