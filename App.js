import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import AthleteDashScreen from "./src/screens/athlete/athlete_home";
import ReportScreen from "./src/screens/athlete/report";
import RegisterScreen from "./src/screens/register";
import LoginScreen from "./src/screens/login";
import CoachDashScreen from "./src/screens/coach/coach_home";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import AthleteAccountScreen from "./src/screens/athlete/athlete_account";
import CoachAccountScreen from "./src/screens/coach/coach_account";

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AthleteTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={AthleteDashScreen} />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen name="History" component={ReportScreen} />
      <Tab.Screen name="Account" component={AthleteAccountScreen} />
    </Tab.Navigator>
  );
}

function CoachTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={CoachDashScreen} />
      <Tab.Screen name="Athletes" component={CoachDashScreen} />
      <Tab.Screen name="Account" component={CoachAccountScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, userData } = useAuth();
  const userType = userData?.user_type; // 'Athlete' or 'Coach'

  return (
    <NavigationContainer fallback={<Text>Loading...</Text>}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : userType === "coach" ? (
          <>
            <Stack.Screen name="MainApp" component={CoachTabNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="AthleteMain" component={AthleteTabNavigator} />
            <Stack.Screen name="Report" component={ReportScreen} />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik: require("./assets/fonts/Rubik-VariableFont_wght.ttf"),
    ...MaterialIcons.font,
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
