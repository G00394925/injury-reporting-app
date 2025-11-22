import { Platform } from "react-native";
import Constants from "expo-constants";

const getBaseURL = () => {
  if (__DEV__) {
    // Dynamically get the IP address of the machine running the Expo server
    const debuggerHost = Constants.expoConfig?.hostUri;

    if (debuggerHost) {
      const localhost = debuggerHost.split(":")[0];
      return `http://${localhost}:5000`;
    }

    // Fallback for simulators/emulators if hostUri isn't available
    if (Platform.OS === "android") {
      return "http://10.0.2.2:5000"; // Android emulator localhost
    }
    return "http://localhost:5000"; // iOS simulator localhost
  }
};

export const API_BASE_URL = getBaseURL();
