import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AthleteDashScreen from "./screens/athlete-home";
import ReportScreen from "./screens/report";
import RegisterScreen from "./screens/register";
import LoginScreen from "./screens/login";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={AthleteDashScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="History" component={ReportScreen} />
      <Tab.Screen name="Account" component={ReportScreen} />
    </Tab.Navigator>
  );
}

function TestScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Test Screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer fallback={<Text>Loading...</Text>}>
      <Stack.Navigator
        initialRouteName="MainApp"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
