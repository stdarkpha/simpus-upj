import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import LatestBookSection from "../components/LatestBookSection";
import UserHomeCategory from "../components/UserHomeCategory";
import LendingBook from "../components/LendingBook";
import Feather from "@expo/vector-icons/Feather";

export default function Dashboard({ onLogout, navigation }) {
   const sections = [
      {
         key: "header",
         render: () => (
            <View>
               <View style={styles.headerBg} />
               <View style={styles.headerContainer}>
                  <Text style={styles.headerTitle}>Laman Utama</Text>
                  <Text style={styles.headerSubtitle}>Cari buku berdasarkan judul</Text>
                  <TouchableOpacity
                     style={styles.searchBar}
                     activeOpacity={0.8}
                     onPress={() => {
                        navigation.navigate("BookPage", { autoFocus: false }); // reset param
                        setTimeout(() => {
                           navigation.navigate("BookPage", { autoFocus: true });
                        }, 10);
                     }}
                  >
                     <Feather name="search" size={24} color="#dc2626" />
                     {/* <TextInput style={styles.searchInput} placeholder="Cari buku berdasarkan judul" placeholderTextColor="#888" onFocus={() => navigation.navigate("BookPage")} onChangeText={() => navigation.navigate("BookPage")} /> */}
                     <Text style={styles.searchInput}>Cari buku berdasarkan judul</Text>
                     <Feather name="filter" size={24} color="#dc2626" />
                  </TouchableOpacity>
                  <View style={styles.card}>
                     <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Pinjam dengan Bijak,{"\n"}Kembalikan dengan Tepat!</Text>
                        <Text style={styles.cardDesc}>Pengembalian terlambat dikenakan denda sesuai durasi keterlambatan</Text>
                        <TouchableOpacity style={styles.ctaButton}>
                           <Text style={styles.ctaButtonText}>Info Lebih Lanjut</Text>
                        </TouchableOpacity>
                     </View>
                     <Image source={{ uri: "https://fesimp.farouq.me/buku.png" }} style={styles.cardImage} resizeMode="contain" />
                  </View>
               </View>
            </View>
         ),
      },
      { key: "lending", render: () => <LendingBook navigation={navigation} /> },
      {
         key: "latest",
         render: () => (
            <View style={styles.sectionContainer}>
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Buku Terbaru</Text>
                  <TouchableOpacity>
                     <Text style={styles.sectionLink}>Lihat Semua</Text>
                  </TouchableOpacity>
               </View>
               <LatestBookSection navigation={navigation} />
            </View>
         ),
      },
      {
         key: "category",
         render: () => (
            <View style={styles.sectionContainer}>
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Kategori Buku</Text>
                  <TouchableOpacity>
                     <Text style={styles.sectionLink}>Lihat Semua</Text>
                  </TouchableOpacity>
               </View>
               <UserHomeCategory navigation={navigation} />
            </View>
         ),
      },
   ];

   return (
      <View style={styles.container}>
         <FlatList data={sections} renderItem={({ item }) => item.render()} keyExtractor={(item) => item.key} contentContainerStyle={{}} showsVerticalScrollIndicator={false} />
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1, },
   headerBg: {
      backgroundColor: "#E7000B",
      width: "100%",
      height: 160,
      position: "absolute",
      top: 0,
      left: 0,
      //  borderBottomLeftRadius: 24,
      //  borderBottomRightRadius: 24,
      zIndex: -1,
   },
   headerContainer: {
      padding: 16,
      gap: 4,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
   },
   headerSubtitle: {
      color: "#fff",
      fontSize: 16,
      marginBottom: 8,
   },
   searchBar: {
      backgroundColor: "#fff",
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginTop: 8,
   },
   searchIcon: {
      fontSize: 22,
      color: "#dc2626",
      marginRight: 8,
   },
   searchInput: {
      flex: 1,
      fontSize: 15,
      color: "#222",
      paddingVertical: 0,
      paddingHorizontal: 6,
      opacity: 0.5,
   },
   filterIcon: {
      fontSize: 22,
      color: "#dc2626",
      marginLeft: 8,
   },
   card: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      paddingBottom: 32,
      marginTop: 40,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
      position: "relative",
      overflow: "visible",
      flexDirection: "row",
      alignItems: "flex-end",
   },
   cardContent: { flex: 1, gap: 8 },
   cardTitle: { fontSize: 16, fontWeight: "bold", lineHeight: 22 },
   cardDesc: { fontSize: 12, maxWidth: 200, color: "#6b7280" },
   ctaButton: {
      backgroundColor: "#dc2626",
      borderRadius: 999,
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginTop: 16,
      alignSelf: "flex-start",
   },
   ctaButtonText: { color: "#fff", fontWeight: "600", fontSize: 10 },
   cardImage: {
      position: "absolute",
      right: 0,
      bottom: 20,
      height: "80%",
      width: 200,
      zIndex: -1,
   },
   sectionContainer: { marginTop: 32, paddingHorizontal: 16 },
   sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 8,
   },
   sectionTitle: { fontSize: 20, fontWeight: "bold" },
   sectionLink: { color: "#dc2626", fontWeight: "bold" },
});
