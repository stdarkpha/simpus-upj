import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookDetailModal from "./BookDetailModal";

const { width } = Dimensions.get("window");

export default function LendingBook({ navigation }) {
   const [lendingData, setLendingData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [itemActive, setItemActive] = useState(null);

   useEffect(() => {
      const fetchLendingData = async () => {
         setLoading(true);
         try {
            const userStr = await AsyncStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const token = user?.data?.token;
            const response = await fetch("https://besimpus.farouq.me/api/lending/reminder", {
               headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                  "Content-Type": "application/json",
               },
            });
            const data = await response.json();
            //  console.log(data)
            setLendingData(data?.data || []);
         } catch (e) {
            setLendingData([]);
         }
         setLoading(false);
      };
      fetchLendingData();
   }, []);

   // Calculate time left
   const countTime = (date) => {
      const now = new Date();
      const endDate = new Date(date);
      const diffTime = endDate.getTime() - now.getTime();
      if (diffTime < 0) return "Sudah lewat";
      const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (daysLeft >= 1) return `${daysLeft} hari`;
      const hoursLeft = Math.floor(diffTime / (1000 * 60 * 60));
      return `${hoursLeft} jam`;
   };

   // Calculate percentage
   const countPercentage = (lend_date, return_date) => {
      if (!lend_date || !return_date) return 0;

      const now = new Date();
      const lendStart = new Date(lend_date);
      const lendEnd = new Date(return_date);

      const totalDurationMs = lendEnd - lendStart;
      const remainingDurationMs = lendEnd - now;

      if (totalDurationMs <= 0) return 0;

      const totalHours = totalDurationMs / (1000 * 60 * 60);
      const remainingHours = Math.max(0, remainingDurationMs / (1000 * 60 * 60));

      const remainingPercent = (remainingHours / totalHours) * 100;

      return remainingPercent.toFixed(2) || 0;
   };

   return (
      <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
         <View style={styles.headerRow}>
            <Text style={styles.title}>Buku Pinjaman</Text>
            <TouchableOpacity onPress={() => navigation && navigation.navigate("History")}>
               <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
         </View>
         {loading ? (
            <ActivityIndicator size="large" color="#dc2626" style={{ marginVertical: 32 }} />
         ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
               {lendingData.items.map((item, idx) => {
                  const percentage = countPercentage(lendingData.lend_date, lendingData.return_date);
                  return (
                     <TouchableOpacity key={item.book.id} style={[styles.slide, { backgroundColor: `rgba(220,38,38,0.08)` }]} activeOpacity={0.9} onPress={() => setItemActive(item.book)}>
                        <View style={styles.coverWrap}>
                           <Image source={{ uri: item.book.img }} style={styles.coverImg} resizeMode="cover" />
                        </View>
                        <View style={styles.infoWrap}>
                           <View>
                              <Text style={styles.bookTitle} numberOfLines={2}>
                                 {item.book.title}
                              </Text>
                              <Text style={styles.bookAuthor}>Author: {item.book.author}</Text>
                           </View>
                           <View style={styles.progressBarBg}>
                              <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                           </View>
                           <Text style={styles.timeLeft}>
                              Sisa waktu: <Text style={styles.timeLeftRed}>{countTime(lendingData.return_date)}</Text>
                           </Text>
                        </View>
                     </TouchableOpacity>
                  );
               })}
            </ScrollView>
         )}
         <BookDetailModal visible={!!itemActive} onClose={() => setItemActive(null)} item={itemActive} loading={false} setLoading={() => {}} />
      </View>
   );
}

const styles = StyleSheet.create({
   headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      // paddingHorizontal: 16,
      marginBottom: 4,
   },
   title: {
      fontSize: 20,
      fontWeight: "bold",
   },
   seeAll: {
      fontWeight: "bold",
      color: "#dc2626",
   },
   slide: {
      width: width * 0.7,
      //   minHeight: 180,
      borderRadius: 12,
      // marginRight: 20,
      padding: 12,
      flexDirection: "row",
      alignItems: "flex-end",
      position: "relative",
      overflow: "hidden",
   },
   coverWrap: {
      height: 140,
      aspectRatio: 2 / 3,
      borderRadius: 8,
      overflow: "hidden",
      marginRight: 12,
      backgroundColor: "#fff",
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
   },
   coverImg: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
   },
   infoWrap: {
      flex: 1,
      justifyContent: "space-between",
      height: 140,
      paddingVertical: 2,
      gap: 2,
   },
   bookTitle: {
      fontWeight: "bold",
      fontSize: 16,
      lineHeight: 20,
      marginBottom: 2,
   },
   bookAuthor: {
      fontWeight: "bold",
      fontSize: 13,
      color: "#dc2626",
      marginBottom: 4,
   },
   progressBarBg: {
      height: 6,
      backgroundColor: "#dedede",
      borderRadius: 4,
      marginVertical: 4,
      width: "100%",
      overflow: "hidden",
   },
   progressBar: {
      height: 6,
      backgroundColor: "#dc2626",
      borderRadius: 4,
   },
   timeLeft: {
      fontSize: 12,
      color: "#444",
      marginTop: 2,
   },
   timeLeftRed: {
      color: "#dc2626",
      fontWeight: "bold",
   },
});
