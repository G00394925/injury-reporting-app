import React, { useContext, createContext, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [uuid, setUuid] = useState(null);
  const [userData, setUserData] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (userId, user, session) => {
    setUuid(userId);
    setUserData(user);
    setSession(session);
    setIsAuthenticated(true);

    // Store session in AsyncStorage
    await AsyncStorage.setItem("uuid", userId);
    await AsyncStorage.setItem("userData", JSON.stringify(user));
    await AsyncStorage.setItem("session", session);
    await AsyncStorage.setItem("isAuthenticated", "true")
  };

  const logout = async () => {
    try {
      // End session
      if (session) {
        console.log("Ending session");
        await axios.post(`${API_BASE_URL}/api/auth/logout`, {
          session: session
        });
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }

    // Clear from AsyncStorage
    await AsyncStorage.removeItem("uuid");
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("session");
    await AsyncStorage.removeItem("isAuthenticated")

    setUuid(null);
    setUserData(null);
    setSession(null);
    setIsAuthenticated(false);
  };

  const restoreSession = async () => {
    try {
      const [storedUuid, storedUserData, storedSession] = await Promise.all([
        AsyncStorage.getItem("uuid"),
        AsyncStorage.getItem("userData"),
        AsyncStorage.getItem("session")
      ]);

      if (storedUuid && storedUserData && storedSession) {
        setUuid(storedUuid);
        setUserData(JSON.parse(storedUserData));
        setSession(storedSession);
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error("Error retoring session:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        uuid,
        userData,
        session,
        isAuthenticated,
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
