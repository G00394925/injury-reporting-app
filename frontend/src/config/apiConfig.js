import { Platform } from "react-native";
import Constants from "expo-constants";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const getBaseURL = () => {
  // Deployed backend URL for production
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
  return "https://injury-reporting-app.onrender.com";
};

const apiClient = axios.create({});
const baseUrl = getBaseURL();

apiClient.defaults.timeout = 60000;
apiClient.interceptors.request.use(
  async function (config) {

    // Get access token from storage and attach to request headers
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Set content type and base URL
    config.headers["Content-Type"] = "application/json";
    config.credentials = "same-origin";
    config.baseURL = baseUrl;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error?.response?.status === 403) {
      console.error("Forbidden access - token may be invalid or expired");
    }
    if (error?.response?.status === 401) {
      console.error("Unauthorized - token may be missing or invalid");
    }
    throw error;
  }
);

export default apiClient;
