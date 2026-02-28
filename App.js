import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";
import AthleteDashScreen from "./src/screens/athlete/AthleteHome";
import AthleteTeamScreen from "./src/screens/athlete/AthleteTeam";
import ReportScreen from "./src/screens/athlete/Report";
import RegisterScreen from "./src/screens/Register";
import LoginScreen from "./src/screens/Login";
import CoachDashScreen from "./src/screens/coach/CoachHome";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import AthleteAccountScreen from "./src/screens/athlete/AthleteAccount";
import CoachAccountScreen from "./src/screens/coach/CoachAccount";
import ClubSetup from "./src/screens/athlete/ClubSetup";
import TeamManagerScreen from "./src/screens/coach/TeamManager";
import TeamCreatorScreen from "./src/screens/coach/TeamCreator";
import TeamViewerScreen from "./src/screens/coach/TeamViewer";
import ManageScheduleScreen from "./src/screens/athlete/ManageSchedule";
import ReportFinish from "./src/screens/athlete/ReportFinish";

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
      <Tab.Screen name="Account" component={AthleteAccountScreen} />
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
          headerShown: false
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : userType === "Coach" ? (
          <>
            <Stack.Screen name="MainApp" component={CoachTabNavigator} />
            <Stack.Screen name="TeamCreator" component={TeamCreatorScreen} />
            <Stack.Screen name="TeamViewer" component={TeamViewerScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="AthleteMain" component={AthleteTabNavigator} />
            <Stack.Screen name="Report" component={ReportScreen} />
            <Stack.Screen name="ClubSetup" component={ClubSetup} />
            <Stack.Screen name="ReportFinish" component={ReportFinish} />
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
