import { Platform } from "react-native";

const getBaseURL = () => {
  if (__DEV__) {
    return "http://10.27.10.187:5000";
    //Development
    // if (Platform.OS === "android") {
    //   return "http://10.0.2.2:5000"; // Android emulator localhost
    // }
    // return "http://localhost:5000"; // iOS simulator localhost
  }
};

export const API_BASE_URL = getBaseURL();
