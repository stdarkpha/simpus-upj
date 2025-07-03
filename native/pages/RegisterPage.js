import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import Config from "../config";

export default function RegisterPage({ navigation }) {
   const [name, setName] = useState("");
   const [nim, setNim] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [passConfirm, setPassConfirm] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const handleRegister = async () => {
      if (password !== passConfirm) {
         Alert.alert("Error", "Password dan konfirmasi password tidak cocok.");
         return;
      }
      setIsLoading(true);
      try {
         const response = await fetch(`${Config.API_BASE_URL}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
               name,
               email,
               uid: nim,
               password,
               password_confirmation: passConfirm,
            }),
         });
         const data = await response.json();
         setIsLoading(false);
         if (data.success) {
            Alert.alert("Sukses", "Pendaftaran berhasil! Silakan masuk.");
            navigation.replace("Login");
         } else {
            Alert.alert("Gagal", data.message || "Pendaftaran gagal. Silakan coba lagi.");
         }
      } catch (e) {
         setIsLoading(false);
         Alert.alert("Error", "Terjadi kesalahan. Silakan coba lagi.");
      }
   };

   return (
      <View style={styles.container}>
         <Image source={{ uri: "https://fesimp.farouq.me/Logo-upj.webp" }} style={{ width: 128, height: 128, resizeMode: "contain", marginBottom: 24 }} />
         <View style={styles.form}>
            <Text style={styles.title}>Pendaftaran Akun (Mahasiswa)</Text>
            <TextInput style={styles.input} placeholder="Nama.." value={name} onChangeText={setName} autoCapitalize="words" />
            <TextInput style={styles.input} placeholder="NIM Mahasiswa.." value={nim} onChangeText={setNim} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Email.." value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Sandi.." value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="Konfirmasi Sandi.." value={passConfirm} onChangeText={setPassConfirm} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
               {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Daftar</Text>}
            </TouchableOpacity>
         </View>
         <Text style={styles.loginText}>
            Punya akun?{" "}
            <Text style={styles.loginLink} onPress={() => navigation.replace("Login")}>
               Masuk
            </Text>
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      gap: 32,
   },
   form: {
      width: "100%",
      maxWidth: 400,
      gap: 12,
   },
   title: {
      fontWeight: "bold",
      color: "#222",
      fontSize: 18,
      marginBottom: 8,
   },
   input: {
      backgroundColor: "#fff",
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      marginBottom: 4,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
   },
   button: {
      backgroundColor: "#dc2626",
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 8,
      shadowColor: "#dc2626",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 2,
   },
   buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
   },
   loginText: {
      color: "#888",
      fontSize: 15,
      marginTop: 24,
      fontWeight: "500",
   },
   loginLink: {
      color: "#dc2626",
      fontWeight: "bold",
   },
});
