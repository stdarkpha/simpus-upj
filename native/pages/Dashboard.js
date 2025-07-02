import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LatestBookSection from "../components/LatestBookSection";
import UserHomeCategory from "../components/UserHomeCategory";
import LendingBook from "../components/LendingBook";

export default function Dashboard({ onLogout, navigation }) {
  const handleLogout = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.data?.token;
      if (!token) {
        Alert.alert("Logout Error", "Token tidak ditemukan.");
        return;
      }
      const response = await fetch("https://besimpus.farouq.me/api/user/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await AsyncStorage.removeItem("user");
        if (onLogout) onLogout();
      } else {
        Alert.alert("Logout Gagal", "Gagal logout dari server.");
      }
    } catch (e) {
      Alert.alert("Logout Error", "Terjadi kesalahan saat logout.");
    }
  };

  const sections = [
    {
      key: "header",
      render: () => (
        <View>
          <View style={styles.headerBg} />
          <View style={styles.contentHeader}>
            <Text style={styles.title}>Laman Utama</Text>
            <Text style={styles.subtitle}>Cari buku berdasarkan judul</Text>
            <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari buku berdasarkan judul"
                placeholderTextColor="#888"
              />
              <Text style={styles.filterIcon}>⚙️</Text>
            </TouchableOpacity>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  Pinjam dengan Bijak,{"\n"}Kembalikan dengan Tepat!
                </Text>
                <Text style={styles.cardDesc}>
                  Pengembalian terlambat dikenakan denda sesuai durasi keterlambatan
                </Text>
                <TouchableOpacity style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Info Lebih Lanjut</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={{ uri: "https://fesimp.farouq.me/buku.png" }}
                style={styles.cardImage}
                resizeMode="contain"
              />
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
            <TouchableOpacity><Text style={styles.sectionLink}>Lihat Semua</Text></TouchableOpacity>
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
            <TouchableOpacity><Text style={styles.sectionLink}>Lihat Semua</Text></TouchableOpacity>
          </View>
          <UserHomeCategory navigation={navigation} />
        </View>
      ),
    },
    {
      key: "logout",
      render: () => (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={sections}
        renderItem={({ item }) => item.render()}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBg: {
    backgroundColor: "#E7000B",
    width: "100%",
    height: 220,
    position: "absolute",
    top: 0,
    left: 0,
   //  borderBottomLeftRadius: 24,
   //  borderBottomRightRadius: 24,
    zIndex: -1,
  },
  contentHeader: { zIndex: 2, paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subtitle: { color: "#fff", fontSize: 16, marginTop: 4 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 24,
    marginBottom: 8,
    shadowColor: "#E7000B",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchIcon: { fontSize: 22, color: "#dc2626", marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: "#222" },
  filterIcon: { fontSize: 22, color: "#dc2626", marginLeft: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    paddingBottom: 32,
    marginTop: 16,
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
  logoutButton: {
    marginTop: 32,
    alignSelf: "center",
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});