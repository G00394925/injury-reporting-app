import { Platform } from "react-native";
import Constants from "expo-constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

let logoutCallback = null;

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
}

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

let refreshPromise = null;  // Track ongoing refresh request

apiClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalRequest = error.config;

    // Unauthorised - Retry with new JWT
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Retry is already ongoing
      if (refreshPromise) {
        try {
          await refreshPromise;
          const newToken = await SecureStore.getItemAsync("accessToken");
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (e) {
          throw e;
        }
      }

      // Otherwise begin the new token refresh
      refreshPromise = (async () => {
        try {
          const refreshToken = await SecureStore.getItemAsync("refreshToken");
          console.log( "Attempting retry. Refresh token exists:", !!refreshToken);

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const response = await axios.post(
            `${baseUrl}/api/auth/refresh_token`, { refresh_token: refreshToken }
          );

          await SecureStore.setItemAsync("accessToken", response.data.access_token);
          await SecureStore.setItemAsync("refreshToken", response.data.refresh_token);

          originalRequest.headers["Authorization"] = `Bearer ${response.data.access_token}`;
          return response.data.access_token;
        } finally {
          refreshPromise = null;  // Reset
        }
      })();

      try {
        await refreshPromise;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Token refresh failed, force logout
        if (logoutCallback) {
          logoutCallback();
        }
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
