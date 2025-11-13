import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AthleteDashScreen from "./screens/athlete-home";
import ReportScreen from "./screens/report";
import RegisterScreen from "./screens/register";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{ 
          headerShown: false 
        }}
      >
        <Tab.Screen name="Dashboard" component={AthleteDashScreen} />
        <Tab.Screen name="Report" component={ReportScreen} />
        <Tab.Screen name="History" component={RegisterScreen} />
        <Tab.Screen name="Account" component={ReportScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
