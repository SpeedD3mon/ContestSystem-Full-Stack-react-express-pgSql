import React, { createContext, useContext, useEffect, useState } from "react";
import { refreshTokenRequest } from "../api/auth.api"; // your API call


interface AuthContextType {
  currentUser: AuthUser | null;
  login: (currentUser: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
    refreshToken: () => Promise<void>; // <--- add this
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const login = (authUser: AuthUser) => {
    setUser(authUser);
    localStorage.setItem("auth", JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };
  const refreshToken = async () => {
    try {
      const data = await refreshTokenRequest(); // call API to get new tokens
      if (currentUser) {
        const updatedUser = { ...currentUser, access_token: data.access_token };
        setUser(updatedUser);
        localStorage.setItem("auth", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Failed to refresh token", err);
      logout();
    }
  };
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        refreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
