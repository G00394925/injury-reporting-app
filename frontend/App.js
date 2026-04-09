import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AthleteDashScreen from "./src/screens/athlete/AthleteHome";
import AthleteTeamScreen from "./src/screens/athlete/AthleteTeam";
import ReportScreen from "./src/screens/athlete/Report";
import RegisterScreen from "./src/screens/Register";
import LoginScreen from "./src/screens/Login";
import CoachDashScreen from "./src/screens/coach/CoachHome";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import AccountScreen from "./src/screens/Account";
import ClubSetup from "./src/screens/athlete/ClubSetup";
import TeamManagerScreen from "./src/screens/coach/TeamManager";
import TeamViewerScreen from "./src/screens/coach/TeamViewer";
import ManageScheduleScreen from "./src/screens/athlete/ManageSchedule";
import ReportFinish from "./src/screens/athlete/ReportFinish";
import AthleteViewerScreen from "./src/screens/coach/AthleteViewer";
import ResetPasswordScreen from "./src/screens/ResetPassword";
import ConfirmRegistrationScreen from "./src/screens/ConfirmRegistration";
import { usePushNotifications } from "./src/hooks/usePushNotifications";
import AdminDashScreen from "./src/screens/administrator/AdminDashboard";
import AdminReportHistoryScreen from "./src/screens/administrator/AdminReportHistory";
import apiClient from "./src/config/apiConfig";


SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AthleteTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "view-dashboard";
          } else if (route.name === "Report") {
            iconName = "file-document";
          } else if (route.name === "Team") {
            iconName = "crowd";
          } else if (route.name === "Schedule") {
            iconName = "calendar-month";
          } else if (route.name === "Account") {
            iconName = "account-circle";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#001a79",
        tabBarInactiveTintColor: "gray"
      })}
    >
      <Tab.Screen name="Dashboard" component={AthleteDashScreen} />
      <Tab.Screen name="Schedule" component={ManageScheduleScreen} />
      <Tab.Screen name="Team" component={AthleteTeamScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

function CoachTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "view-dashboard";
          } else if (route.name === "Team") {
            iconName = "crowd";
          } else if (route.name === "Account") {
            iconName = "account-circle";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#001a79",
        tabBarInactiveTintColor: "gray"
      })}
    >
      <Tab.Screen name="Dashboard" component={CoachDashScreen} />
      <Tab.Screen name="Team" component={TeamManagerScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "view-dashboard";
          } else if (route.name ==="Report History") {
            iconName = "clipboard-list"; 
          } else if (route.name === "Account") {
            iconName = "account-circle"
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          )
        },
        tabBarActiveTintColor: "#001a79",
        tabBarInactiveTintColor: "gray"
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashScreen} />
      <Tab.Screen name="Report History" component={AdminReportHistoryScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  usePushNotifications();
  const { isAuthenticated, userData, restoreSession, session, isLoading } = useAuth();
  const userType = userData?.user_type;
  const appState = useRef(AppState.currentState)
  
  useEffect(() => {
    const initializeApp = async () => {
      await restoreSession();
    };
    initializeApp();
    
    const subscription = AppState.addEventListener("change", handleAppStateChange)
    return () => subscription.remove()
  }, [])

  const logDailyOpen = useCallback(async () => {
    if (session) {
      try {
        const lastOpen = await AsyncStorage.getItem('lastAppOpen');
        const today = new Date().toISOString().split('T')[0];
        
        if (lastOpen !== today) {
          // First open of the day
          await apiClient.post('${API_BASE_URL}/api/session/log_event', {
            session_id: session,
            event_type: "app_open_daily",
            event_data: {"uuid": userData.id},
            endpoint: "app_state_change"
          })
          // Store today's date
          await AsyncStorage.setItem('lastAppOpen', today);
        }
      } catch (error) {
        console.error("Error logging app open event:", error)
      }
    }
  }, [session])
  
  useEffect(() => {
    if (session) {
      logDailyOpen()
    }
  }, [session])


  const handleAppStateChange = async (nextAppState) => {
    // App moving from background/inactive to foreground
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to foreground")
      await logDailyOpen();
    }
    
    appState.current = nextAppState;
  }
  
  if (isLoading) return <Text>Loading...</Text>;

  return (
    <NavigationContainer fallback={<Text>Loading...</Text>}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ConfirmRegistration" component={ConfirmRegistrationScreen} />
          </>
        ) : userType === "Admin" ? (
          <>
            <Stack.Screen name="Admin" component={AdminTabNavigator} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : userType === "Coach" ? (
          <>
            <Stack.Screen name="MainApp" component={CoachTabNavigator} />
            <Stack.Screen name="TeamViewer" component={TeamViewerScreen} />
            <Stack.Screen name="AthleteViewer" component={AthleteViewerScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainApp" component={AthleteTabNavigator} />
            <Stack.Screen name="Report" component={ReportScreen} />
            <Stack.Screen name="ClubSetup" component={ClubSetup} />
            <Stack.Screen name="ReportFinish" component={ReportFinish} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik: require("./assets/fonts/Rubik-VariableFont_wght.ttf"),
    ...MaterialIcons.font
  });

  // Load fonts first, then hide splash screen
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
