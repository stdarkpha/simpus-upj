import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransitionPresets } from "@react-navigation/stack";

import LoginScreen from "./pages/LoginScreen";
import Dashboard from "./pages/Dashboard";
import BookPage from "./pages/BookPage";
import BagPage from "./pages/BagPage";
import HistoryPage from "./pages/HistoryPage";
import SettingPage from "./pages/SettingPage";
import UserLayout from "./layouts/UserLayout";
import RegisterPage from "./pages/RegisterPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

function withLayout(Component) {
   return function WrappedComponent(props) {
      return (
         <UserLayout>
            <Component {...props} />
         </UserLayout>
      );
   };
}

function MainTabs({ setIsLoggedIn }) {
   return (
      <Tab.Navigator
         screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
         }}
      >
         <Tab.Screen name="Dashboard" component={withLayout(Dashboard)} />
         <Tab.Screen name="BookPage" component={withLayout(BookPage)} />
         <Tab.Screen name="BagPage" component={withLayout(BagPage)} />
         <Tab.Screen name="HistoryPage" component={withLayout(HistoryPage)} />
         <Tab.Screen name="SettingPage">{(props) => withLayout(SettingPage)({ ...props, setIsLoggedIn })}</Tab.Screen>
      </Tab.Navigator>
   );
}

function AppNavigator({ setIsLoggedIn }) {
   return (
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
         <AppStack.Screen name="MainTabs">{(props) => <MainTabs {...props} setIsLoggedIn={setIsLoggedIn} />}</AppStack.Screen>
      </AppStack.Navigator>
   );
}

function AuthNavigator({ onLogin }) {
   return (
      <AuthStack.Navigator screenOptions={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }}>
         <AuthStack.Screen name="Login">{(props) => <LoginScreen {...props} onLogin={onLogin} />}</AuthStack.Screen>
         <AuthStack.Screen name="RegisterPage" component={RegisterPage} />
      </AuthStack.Navigator>
   );
}

export default function AppNav() {
   const [isLoggedIn, setIsLoggedIn] = React.useState(false);
   const [loading, setLoading] = React.useState(true);

   React.useEffect(() => {
      const checkSession = async () => {
         try {
            const userStr = await AsyncStorage.getItem("user");
            if (userStr) {
               setIsLoggedIn(true);
            }
         } catch (error) {
            console.error("Failed to check user session:", error);
         } finally {
            setLoading(false);
         }
      };
      checkSession();
   }, []);

   if (loading) {
      return (
         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#E7000B" />
         </View>
      );
   }

   return <NavigationContainer>{isLoggedIn ? <AppNavigator setIsLoggedIn={setIsLoggedIn} /> : <AuthNavigator onLogin={() => setIsLoggedIn(true)} />}</NavigationContainer>;
}
