import React, { useContext, createContext, useState } from "react";
import apiClient from "../config/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [uuid, setUuid] = useState(null);
  const [userData, setUserData] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (userId, user, session, accessToken, refreshToken) => {
    // Store session in AsyncStorage
    await SecureStore.setItemAsync("uuid", String(userId));
    await SecureStore.setItemAsync("session", String(session));
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    await AsyncStorage.setItem("userData", JSON.stringify(user));

    setUuid(userId);
    setUserData(user);
    setSession(session);
    setIsAuthenticated(true);

    const check = await SecureStore.getItemAsync("accessToken");
  };

  const logout = async () => {
    try {
      // End session
      if (session) {
        await apiClient.post('/api/auth/logout', { session });
      }
    } catch (error) {
      console.error("Error ending session:", error);
      throw error; // Re-throw to notify caller of logout failure
    }

    // Clear from AsyncStorage/SecureStore
    await SecureStore.deleteItemAsync("uuid");
    await SecureStore.deleteItemAsync("session");
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await AsyncStorage.removeItem("userData");

    setIsAuthenticated(false);
    setSession(null);
    setUuid(null);
    setUserData(null);
  };

  const restoreSession = async () => {
    try {
      const [storedUuid, storedSession, storedUserData] = await Promise.all([
        SecureStore.getItemAsync("uuid"),
        SecureStore.getItemAsync("session"),
        AsyncStorage.getItem("userData")
      ]);

      if (storedUuid && storedSession && storedUserData) {
        setUuid(storedUuid);
        setSession(storedSession);
        setUserData(JSON.parse(storedUserData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error restoring session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        uuid,
        userData,
        session,
        isAuthenticated,
        isLoading,
        login,
        logout,
        restoreSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
