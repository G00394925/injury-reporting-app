import React, { useContext, createContext, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [uuid, setUuid] = useState(null);
  const [userData, setUserData] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userId, user, session) => {
    setUuid(userId);
    setUserData(user);
    setSession(session);
    setIsAuthenticated(true);
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
    setUuid(null);
    setUserData(null);
    setSession(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        uuid,
        userData,
        session,
        isAuthenticated,
        login,
        logout,
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
