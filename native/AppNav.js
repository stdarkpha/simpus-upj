import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./pages/LoginScreen";
import Dashboard from "./pages/Dashboard";
import BookPage from "./pages/BookPage";
import BagPage from "./pages/BagPage";
import HistoryPage from "./pages/HistoryPage";
import SettingPage from "./pages/SettingPage";
import UserLayout from "./layouts/UserLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, Text } from "react-native";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
   return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
         <Tab.Screen name="Dashboard" component={withLayout(Dashboard)} />
         <Tab.Screen name="BookPage" component={withLayout(BookPage)} />
         <Tab.Screen name="BagPage" component={withLayout(BagPage)} />
         <Tab.Screen name="HistoryPage" component={withLayout(HistoryPage)} />
         <Tab.Screen name="SettingPage" component={withLayout(SettingPage)} />
      </Tab.Navigator>
   );
}

function withLayout(Component) {
   return (props) => (
      <UserLayout>
         <Component {...props} />
      </UserLayout>
   );
}

export default function AppNav() {
   const [isLoggedIn, setIsLoggedIn] = React.useState(false);
   const [loading, setLoading] = React.useState(true);

   React.useEffect(() => {
      const checkSession = async () => {
         const userStr = await AsyncStorage.getItem("user");
         if (userStr) setIsLoggedIn(true);
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

   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{ headerShown: false }}>{!isLoggedIn ? <Stack.Screen name="Login">{(props) => <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />}</Stack.Screen> : <Stack.Screen name="MainTabs" component={MainTabs} />}</Stack.Navigator>
      </NavigationContainer>
   );
}
