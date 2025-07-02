import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import your page components
import LoginScreen from "./pages/LoginScreen";
import Dashboard from "./pages/Dashboard";
import BookPage from "./pages/BookPage";
import BagPage from "./pages/BagPage";
import HistoryPage from "./pages/HistoryPage";
import SettingPage from "./pages/SettingPage";
import UserLayout from "./layouts/UserLayout";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

/**
 * A Higher-Order Component to wrap screens with the UserLayout.
 */
function withLayout(Component) {
   return function WrappedComponent(props) {
      return (
         <UserLayout>
            <Component {...props} />
         </UserLayout>
      );
   };
}

/**
 * The main tab navigator for when the user is logged in.
 * It receives `setIsLoggedIn` to pass it down to the SettingPage.
 */
function MainTabs({ setIsLoggedIn }) {
   return (
      <Tab.Navigator
         screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" }, // Hides the bottom tab bar
         }}
      >
         <Tab.Screen name="Dashboard" component={withLayout(Dashboard)} />
         <Tab.Screen name="BookPage" component={withLayout(BookPage)} />
         <Tab.Screen name="BagPage" component={withLayout(BagPage)} />
         <Tab.Screen name="HistoryPage" component={withLayout(HistoryPage)} />
         <Tab.Screen name="SettingPage">
            {(props) => withLayout(SettingPage)({ ...props, setIsLoggedIn })}
         </Tab.Screen>
      </Tab.Navigator>
   );
}

/**
 * The stack navigator for the main application screens.
 * It receives `setIsLoggedIn` to pass it to the MainTabs navigator.
 */
function AppNavigator({ setIsLoggedIn }) {
   return (
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
         <AppStack.Screen name="MainTabs">
            {(props) => <MainTabs {...props} setIsLoggedIn={setIsLoggedIn} />}
         </AppStack.Screen>
      </AppStack.Navigator>
   );
}

/**
 * The stack navigator for authentication screens (e.g., Login).
 * It receives `onLogin` to update the state upon successful login.
 */
function AuthNavigator({ onLogin }) {
   return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
         <AuthStack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={onLogin} />}
         </AuthStack.Screen>
      </AuthStack.Navigator>
   );
}

/**
 * The root component that manages the navigation state of the entire application.
 * It conditionally renders the appropriate navigator based on the `isLoggedIn` state.
 */
export default function AppNav() {
   const [isLoggedIn, setIsLoggedIn] = React.useState(false);
   const [loading, setLoading] = React.useState(true);

   // Check for a user session in AsyncStorage when the app loads
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

   // Show a loading indicator while checking the session
   if (loading) {
      return (
         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#E7000B" />
         </View>
      );
   }

   // Render the appropriate navigator based on the login state
   return (
      <NavigationContainer>
         {isLoggedIn ? (
            <AppNavigator setIsLoggedIn={setIsLoggedIn} />
         ) : (
            <AuthNavigator onLogin={() => setIsLoggedIn(true)} />
         )}
      </NavigationContainer>
   );
}